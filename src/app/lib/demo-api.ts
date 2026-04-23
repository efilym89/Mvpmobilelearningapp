import type {
  AdminOverview,
  AuthSession,
  CourseDetails,
  CourseSummary,
  LessonDetails,
  TestDetails,
  TestResult,
} from "../../domain/mvp";
import { courses, getMockTestForCourse, mockEmployees } from "./mock-data";

const DEMO_STATE_KEY = "annaelle-pages-demo-state-v1";

const demoUsers = [
  {
    id: "user-employee",
    email: "employee@annaelle.ru",
    password: "demo123",
    name: "Александра Белова",
    role: "employee" as const,
  },
  {
    id: "user-admin",
    email: "admin@annaelle.ru",
    password: "demo123",
    name: "Марина Орлова",
    role: "admin" as const,
  },
];

type DemoState = {
  completedLessons: Record<string, string[]>;
  attempts: Array<{
    attemptId: string;
    courseId: string;
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    spentTimeSeconds: number;
  }>;
};

type DemoStateMap = Record<string, DemoState>;

const defaultState: DemoStateMap = {
  "user-employee": {
    completedLessons: {
      "day-1": [],
      "day-2": [],
    },
    attempts: [],
  },
  "user-admin": {
    completedLessons: {
      "day-1": ["day-1-lesson-1", "day-1-lesson-2"],
      "day-2": ["day-2-lesson-1"],
    },
    attempts: [],
  },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readState(): DemoStateMap {
  if (typeof window === "undefined") {
    return clone(defaultState);
  }

  const rawValue = window.localStorage.getItem(DEMO_STATE_KEY);
  if (!rawValue) {
    return clone(defaultState);
  }

  try {
    return { ...clone(defaultState), ...(JSON.parse(rawValue) as DemoStateMap) };
  } catch {
    window.localStorage.removeItem(DEMO_STATE_KEY);
    return clone(defaultState);
  }
}

function writeState(state: DemoStateMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
}

function findUserByToken(accessToken: string) {
  return demoUsers.find((user) => accessToken === `demo-static-${user.id}`) ?? null;
}

function getUserState(accessToken: string) {
  const user = findUserByToken(accessToken);
  if (!user) {
    throw new Error("Сессия не найдена");
  }

  const state = readState();
  state[user.id] = state[user.id] ?? clone(defaultState["user-employee"]);
  return { user, state };
}

function toCourseSummary(accessToken: string, courseId: string): CourseSummary {
  const course = courses.find((item) => item.id === courseId) ?? courses[0];
  const { state, user } = getUserState(accessToken);
  const completedLessons = state[user.id]?.completedLessons?.[course.id] ?? [];
  const completedCount = completedLessons.length;
  const totalLessons = course.lessons.length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    progress,
    totalLessons,
    completedLessons: completedCount,
    color: course.color,
    isMandatory: course.isMandatory,
    isRecommended: Boolean(course.isRecommended),
    deadline: course.deadline,
    status: progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started",
  };
}

function toLessonDetails(accessToken: string, courseId: string, lessonId: string): LessonDetails {
  const course = courses.find((item) => item.id === courseId) ?? courses[0];
  const lesson = course.lessons.find((item) => item.id === lessonId) ?? course.lessons[0];
  const { state, user } = getUserState(accessToken);
  const completedLessons = new Set(state[user.id]?.completedLessons?.[course.id] ?? []);
  const isCompleted = completedLessons.has(lesson.id);

  return {
    id: lesson.id,
    courseId: course.id,
    title: lesson.title,
    duration: lesson.duration,
    type: lesson.videoUrl ? "video" : "article",
    progress: isCompleted ? 100 : lesson.progress ?? 0,
    isCompleted,
    content: [
      lesson.fullDescription ?? lesson.description ?? `Материал урока «${lesson.title}» доступен в приложении.`,
      ...(lesson.objectives?.length
        ? [`В этом уроке вы разбираете: ${lesson.objectives.join("; ")}.`]
        : []),
    ],
    videoCaption: lesson.videoCaption ?? `Видео по теме «${lesson.title}»`,
    description: lesson.description,
    objectives: lesson.objectives,
    videoUrl: lesson.videoUrl,
    presentationPdfUrl: lesson.presentationPdfUrl,
    presentationPptxUrl: null,
    resources: lesson.resources,
  };
}

export const demoApi = {
  async login(email: string, password: string): Promise<AuthSession> {
    const user = demoUsers.find((entry) => entry.email === email && entry.password === password);

    if (!user) {
      throw new Error("Неверный email или пароль");
    }

    return {
      accessToken: `demo-static-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async getCourses(accessToken: string): Promise<CourseSummary[]> {
    return courses.map((course) => toCourseSummary(accessToken, course.id));
  },

  async getCourse(accessToken: string, courseId: string): Promise<CourseDetails> {
    const course = courses.find((item) => item.id === courseId) ?? courses[0];
    const summary = toCourseSummary(accessToken, course.id);
    const { state, user } = getUserState(accessToken);
    const completedLessons = new Set(state[user.id]?.completedLessons?.[course.id] ?? []);

    return {
      ...summary,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        type: lesson.videoUrl ? "video" : "article",
        progress: completedLessons.has(lesson.id) ? 100 : lesson.progress ?? 0,
        isCompleted: completedLessons.has(lesson.id),
      })),
    };
  },

  async getLesson(accessToken: string, courseId: string, lessonId: string): Promise<LessonDetails> {
    return toLessonDetails(accessToken, courseId, lessonId);
  },

  async completeLesson(accessToken: string, courseId: string, lessonId: string): Promise<{ ok: true }> {
    const { state, user } = getUserState(accessToken);
    const userState = state[user.id] ?? clone(defaultState["user-employee"]);
    userState.completedLessons[courseId] = userState.completedLessons[courseId] ?? [];

    if (!userState.completedLessons[courseId].includes(lessonId)) {
      userState.completedLessons[courseId].push(lessonId);
    }

    state[user.id] = userState;
    writeState(state);
    return { ok: true };
  },

  async getTest(accessToken: string, courseId: string): Promise<TestDetails> {
    getUserState(accessToken);
    const questions = getMockTestForCourse(courseId);

    return {
      id: `${courseId}-final-test`,
      courseId,
      title: `Итоговый тест: ${courses.find((item) => item.id === courseId)?.title ?? "Курс"}`,
      passingScore: 80,
      timeLimitMinutes: 12,
      attemptsLimit: 3,
      questions,
    };
  },

  async submitTest(accessToken: string, courseId: string, answers: number[]): Promise<TestResult> {
    const { state, user } = getUserState(accessToken);
    const questions = getMockTestForCourse(courseId);
    const correctAnswers = questions.reduce((total, question, index) => total + (answers[index] === question.correctAnswer ? 1 : 0), 0);
    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const result: TestResult = {
      attemptId: `demo-attempt-${Date.now()}`,
      courseId,
      score,
      passed: score >= 80,
      correctAnswers,
      totalQuestions,
      spentTimeSeconds: totalQuestions * 90,
    };

    state[user.id].attempts.push(result);
    writeState(state);
    return result;
  },

  async getAdminOverview(accessToken: string): Promise<AdminOverview> {
    const { user, state } = getUserState(accessToken);
    if (user.role !== "admin") {
      throw new Error("Недостаточно прав");
    }

    const employeeSessionToken = "demo-static-user-employee";
    const employeeCourses = courses.map((course) => toCourseSummary(employeeSessionToken, course.id));
    const attempts = state["user-employee"]?.attempts ?? [];
    const averageScore = attempts.length
      ? Math.round(attempts.reduce((total, attempt) => total + attempt.score, 0) / attempts.length)
      : 0;

    return {
      stats: {
        totalCourses: courses.length,
        activeEmployees: mockEmployees.length,
        completedAttempts: attempts.length,
        averageScore,
      },
      courses: employeeCourses,
      employees: mockEmployees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        progress: employee.progress,
        courses: employee.courses,
        averageScore: employee.progress,
      })),
    };
  },
};
