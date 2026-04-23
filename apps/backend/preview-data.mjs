import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.resolve(__dirname, "../../storage/catalog.generated.json");
const rawCatalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

const users = [
  {
    id: "user-employee",
    email: "employee@annaelle.ru",
    password: "demo123",
    name: "Александра Белова",
    role: "employee",
  },
  {
    id: "user-admin",
    email: "admin@annaelle.ru",
    password: "demo123",
    name: "Марина Орлова",
    role: "admin",
  },
];

const lessonTitleOverrides = {
  "day-1-lesson-4": "Практический разбор сервиса",
};

function normalizeLessonTitle(lesson) {
  return lessonTitleOverrides[lesson.id] ?? lesson.title;
}

function lessonKind(lesson) {
  const title = normalizeLessonTitle(lesson).toLowerCase();
  if (title.includes("экзамен") || title.includes("домашнее задание")) {
    return "article";
  }

  return lesson.videoUrl ? "video" : "article";
}

function buildLessonNarrative(course, lesson) {
  const title = normalizeLessonTitle(lesson);
  const objectives = lesson.objectives?.length
    ? lesson.objectives
    : [
        `Понять, как тема «${title}» встроена в модуль ${course.title}.`,
        "Связать урок с практикой мастера и клиентским сценарием.",
        "Подготовиться к следующему уроку или проверочному вопросу.",
      ];

  return {
    description:
      lesson.description ??
      `Урок «${title}» раскрывает часть программы «${course.title}» и помогает разобрать тему на практическом уровне.`,
    content: [
      lesson.fullDescription ??
        `В центре урока — тема «${title}». Материал продолжает программу ${course.title} и собирает в единую логику знания, сервисные шаги и ключевые акценты работы мастера.`,
      `После просмотра важно зафиксировать, как тема «${title}» влияет на качество общения с клиентом, подготовку к следующему этапу и итоговый результат.`,
    ],
    objectives,
    videoCaption: lesson.videoUrl ? `Видео по теме «${title}»` : `Материал по теме «${title}»`,
    resources: [
      lesson.presentationPdfUrl
        ? { id: `${lesson.id}-pdf`, label: "PDF-презентация", url: lesson.presentationPdfUrl }
        : null,
    ].filter(Boolean),
  };
}

function buildTestQuestions(course) {
  const sourceLessons = course.lessons
    .filter((lesson) => !normalizeLessonTitle(lesson).toLowerCase().includes("экзамен"))
    .slice(0, Math.min(course.lessons.length, 5));

  return sourceLessons.map((lesson, index) => {
    const correctTitle = normalizeLessonTitle(lesson);
    const distractors = course.lessons
      .filter((candidate) => candidate.id !== lesson.id)
      .map((candidate) => normalizeLessonTitle(candidate))
      .slice(index, index + 3);

    while (distractors.length < 3) {
      distractors.push(course.title);
    }

    return {
      id: `${course.id}-test-${index + 1}`,
      question: `Какая тема выделена в уроке «${correctTitle}»?`,
      options: [correctTitle, ...distractors].slice(0, 4),
      correctAnswer: 0,
    };
  });
}

const courseTemplates = rawCatalog.courses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  color: course.color,
  isMandatory: course.isMandatory,
  isRecommended: course.isRecommended,
  deadline: course.deadline,
  lessons: course.lessons.map((lesson) => {
    const narrative = buildLessonNarrative(course, lesson);
    return {
      id: lesson.id,
      title: normalizeLessonTitle(lesson),
      duration: lesson.durationLabel || (lesson.videoUrl ? "Видео" : "Материал"),
      type: lessonKind(lesson),
      content: narrative.content,
      description: narrative.description,
      objectives: narrative.objectives,
      videoCaption: narrative.videoCaption,
      videoUrl: lesson.videoUrl,
      presentationPdfUrl: lesson.presentationPdfUrl,
      presentationPptxUrl: null,
      resources: narrative.resources,
    };
  }),
  test: {
    id: `${course.id}-final-test`,
    title: `Итоговый тест: ${course.title}`,
    passingScore: 80,
    timeLimitMinutes: 12,
    attemptsLimit: 3,
    questions: buildTestQuestions(course),
  },
}));

const initialState = {
  "user-employee": {
    completedLessons: {
      "day-1": ["day-1-lesson-1"],
      "day-2": [],
    },
    attempts: [],
  },
  "user-admin": {
    completedLessons: {
      "day-1": ["day-1-lesson-1", "day-1-lesson-2", "day-1-lesson-3"],
      "day-2": ["day-2-lesson-1", "day-2-lesson-2"],
    },
    attempts: [
      {
        attemptId: "attempt-admin-1",
        courseId: "day-1",
        score: 100,
        passed: true,
        correctAnswers: 5,
        totalQuestions: 5,
        spentTimeSeconds: 520,
      },
    ],
  },
};

const runtimeState = JSON.parse(JSON.stringify(initialState));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getUserByToken(token) {
  if (!token) {
    return null;
  }

  return users.find((user) => token === `demo-token-${user.id}`) ?? null;
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email) ?? null;
}

function getUserState(userId) {
  return runtimeState[userId];
}

function computeCourseProgress(userId, course) {
  const completedLessonIds = getUserState(userId)?.completedLessons?.[course.id] ?? [];
  const totalLessons = course.lessons.length;
  const completedLessons = completedLessonIds.length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  let status = "not_started";
  if (progress > 0 && progress < 100) {
    status = "in_progress";
  } else if (progress === 100) {
    status = "completed";
  }

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    color: course.color,
    isMandatory: course.isMandatory,
    isRecommended: course.isRecommended,
    deadline: course.deadline,
    totalLessons,
    completedLessons,
    progress,
    status,
  };
}

function attachLessonProgress(userId, course) {
  const completedLessonIds = new Set(getUserState(userId)?.completedLessons?.[course.id] ?? []);

  return course.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    type: lesson.type,
    progress: completedLessonIds.has(lesson.id) ? 100 : 0,
    isCompleted: completedLessonIds.has(lesson.id),
  }));
}

export function authenticateUser(email, password) {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return {
    accessToken: `demo-token-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export function resolveUserFromToken(token) {
  return getUserByToken(token);
}

export function listCoursesForUser(userId) {
  return clone(courseTemplates.map((course) => computeCourseProgress(userId, course)));
}

export function getCourseForUser(userId, courseId) {
  const course = courseTemplates.find((item) => item.id === courseId);

  if (!course) {
    return null;
  }

  return clone({
    ...computeCourseProgress(userId, course),
    lessons: attachLessonProgress(userId, course),
  });
}

export function getLessonForUser(userId, courseId, lessonId) {
  const course = courseTemplates.find((item) => item.id === courseId);
  const lesson = course?.lessons.find((item) => item.id === lessonId);

  if (!course || !lesson) {
    return null;
  }

  const completedLessonIds = new Set(getUserState(userId)?.completedLessons?.[course.id] ?? []);

  return clone({
    id: lesson.id,
    courseId: course.id,
    title: lesson.title,
    duration: lesson.duration,
    type: lesson.type,
    progress: completedLessonIds.has(lesson.id) ? 100 : 0,
    isCompleted: completedLessonIds.has(lesson.id),
    content: lesson.content,
    description: lesson.description,
    objectives: lesson.objectives,
    videoCaption: lesson.videoCaption,
    videoUrl: lesson.videoUrl,
    presentationPdfUrl: lesson.presentationPdfUrl,
    presentationPptxUrl: null,
    resources: lesson.resources,
  });
}

export function completeLessonForUser(userId, courseId, lessonId) {
  const course = courseTemplates.find((item) => item.id === courseId);
  const lesson = course?.lessons.find((item) => item.id === lessonId);

  if (!course || !lesson) {
    return false;
  }

  const userState = getUserState(userId);
  userState.completedLessons[courseId] = userState.completedLessons[courseId] ?? [];

  if (!userState.completedLessons[courseId].includes(lessonId)) {
    userState.completedLessons[courseId].push(lessonId);
  }

  return true;
}

export function getTestForUser(courseId) {
  const course = courseTemplates.find((item) => item.id === courseId);

  if (!course) {
    return null;
  }

  return clone({
    id: course.test.id,
    courseId: course.id,
    title: course.test.title,
    passingScore: course.test.passingScore,
    timeLimitMinutes: course.test.timeLimitMinutes,
    attemptsLimit: course.test.attemptsLimit,
    questions: course.test.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
    })),
  });
}

export function submitTestForUser(userId, courseId, answers) {
  const course = courseTemplates.find((item) => item.id === courseId);

  if (!course) {
    return null;
  }

  const correctAnswers = course.test.questions.reduce((total, question, index) => {
    return total + (answers[index] === question.correctAnswer ? 1 : 0);
  }, 0);

  const totalQuestions = course.test.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const result = {
    attemptId: `attempt-${userId}-${Date.now()}`,
    courseId,
    score,
    passed: score >= course.test.passingScore,
    correctAnswers,
    totalQuestions,
    spentTimeSeconds: totalQuestions * 95,
  };

  getUserState(userId).attempts.push(result);

  return clone(result);
}

export function getAdminOverview() {
  const employeeUsers = users.filter((user) => user.role === "employee");
  const allCourses = listCoursesForUser("user-employee");
  const allAttempts = Object.values(runtimeState).flatMap((state) => state.attempts);
  const averageScore = allAttempts.length
    ? Math.round(allAttempts.reduce((total, attempt) => total + attempt.score, 0) / allAttempts.length)
    : 0;

  return clone({
    stats: {
      totalCourses: courseTemplates.length,
      activeEmployees: employeeUsers.length,
      completedAttempts: allAttempts.length,
      averageScore,
    },
    courses: allCourses,
    employees: employeeUsers.map((user) => {
      const userCourses = listCoursesForUser(user.id);
      const progress = userCourses.length
        ? Math.round(userCourses.reduce((total, course) => total + course.progress, 0) / userCourses.length)
        : 0;
      const attempts = getUserState(user.id).attempts;
      const employeeAverageScore = attempts.length
        ? Math.round(attempts.reduce((total, attempt) => total + attempt.score, 0) / attempts.length)
        : 0;

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        progress,
        courses: userCourses.length,
        averageScore: employeeAverageScore,
      };
    }),
  });
}
