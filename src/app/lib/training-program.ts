import catalog from "../../../storage/catalog.generated.json";
import { withBasePath } from "./runtime";

type RawLesson = {
  id: string;
  day: number;
  order: number;
  title: string;
  status: string;
  durationLabel: string;
  videoDurationSeconds: number | null;
  description: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  speakerName: string | null;
  placeholderNote: string | null;
  objectives: string[];
  coverAlt: string | null;
  videoUrl: string | null;
  presentationPdfUrl: string | null;
  presentationPptxUrl: string | null;
  coverUrl: string | null;
  videoSequence: Array<{
    id: string;
    title: string;
    file: string;
    durationLabel: string | null;
    videoDurationSeconds: number | null;
    completionThreshold: number;
    url: string;
  }>;
};

type RawCourse = {
  id: string;
  title: string;
  description: string;
  color: "rose" | "green";
  isMandatory: boolean;
  isRecommended: boolean;
  deadline: string | null;
  lessons: RawLesson[];
};

const rawCourses = (catalog as { courses: RawCourse[] }).courses;

const lessonTitleOverrides: Record<string, string> = {
  "day-1-lesson-4": "Практический разбор сервиса",
};

function encodeSvg(value: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(value)}`;
}

function createGradientArtwork(title: string, subtitle: string, color: "rose" | "green") {
  const palette =
    color === "rose"
      ? { start: "#A7738B", end: "#D9A6B9", accent: "#FFF2F7" }
      : { start: "#7F9D7A", end: "#BFD2B0", accent: "#F5FFF0" };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette.start}" />
          <stop offset="1" stop-color="${palette.end}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" rx="56" fill="url(#bg)" />
      <circle cx="1030" cy="170" r="170" fill="white" fill-opacity="0.12" />
      <circle cx="150" cy="670" r="220" fill="white" fill-opacity="0.10" />
      <circle cx="860" cy="640" r="110" fill="${palette.accent}" fill-opacity="0.18" />
      <text x="84" y="140" fill="white" fill-opacity="0.75" font-family="Arial, sans-serif" font-size="32" font-weight="700">${subtitle}</text>
      <foreignObject x="84" y="200" width="940" height="420">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color: white; font-size: 58px; font-weight: 800; line-height: 1.12;">
          ${title}
        </div>
      </foreignObject>
    </svg>
  `;

  return encodeSvg(svg);
}

function normalizeLessonTitle(lesson: RawLesson) {
  return lessonTitleOverrides[lesson.id] ?? lesson.title;
}

function normalizeDuration(lesson: RawLesson) {
  return lesson.durationLabel || (lesson.videoUrl ? "Видео" : "Материал");
}

function lessonKind(lesson: RawLesson) {
  const title = normalizeLessonTitle(lesson).toLowerCase();

  if (title.includes("экзамен") || title.includes("домашнее задание")) {
    return "тест";
  }

  return lesson.videoUrl ? "видео" : "материал";
}

function buildLessonNarrative(course: RawCourse, lesson: RawLesson) {
  const title = normalizeLessonTitle(lesson);

  return {
    shortDescription:
      lesson.shortDescription ?? `Краткий разбор темы «${title}» внутри модуля «${course.title}».`,
    description:
      lesson.description ??
      `Урок посвящен теме «${title}» и помогает закрепить логику работы мастера в рамках программы ${course.title}.`,
    fullDescription:
      lesson.fullDescription ??
      `В этом уроке разбирается тема «${title}». Материал опирается на программу ${course.title} и помогает связать теорию, сервисный сценарий и практические действия мастера.`,
    objectives:
      lesson.objectives.length > 0
        ? lesson.objectives
        : [
            `Понять ключевую идею урока «${title}».`,
            "Связать тему урока с работой мастера и клиентским сценарием.",
            "Подготовиться к проверочному квизу и итоговому тесту.",
          ],
    videoCaption: lesson.videoUrl ? `Видео по теме «${title}»` : `Материал по теме «${title}»`,
  };
}

function buildTestQuestions(course: RawCourse) {
  const sourceLessons = course.lessons
    .filter((lesson) => lessonKind(lesson) !== "тест")
    .slice(0, Math.min(course.lessons.length, 5));

  return sourceLessons.map((lesson, index) => {
    const lessonTitle = normalizeLessonTitle(lesson);
    const distractors = course.lessons
      .filter((candidate) => candidate.id !== lesson.id)
      .map((candidate) => normalizeLessonTitle(candidate))
      .slice(index, index + 3);

    while (distractors.length < 3) {
      distractors.push(course.title);
    }

    return {
      id: `${course.id}-test-${index + 1}`,
      question: `Какая тема выделена в уроке «${lessonTitle}»?`,
      options: [lessonTitle, ...distractors].slice(0, 4),
      correctAnswer: 0,
    };
  });
}

function buildQuizQuestion(course: RawCourse, lessonId: string) {
  const lesson = course.lessons.find((item) => item.id === lessonId) ?? course.lessons[0];
  const lessonTitle = normalizeLessonTitle(lesson);
  const distractors = course.lessons
    .filter((candidate) => candidate.id !== lesson.id)
    .map((candidate) => normalizeLessonTitle(candidate))
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(course.title);
  }

  return {
    id: `${lesson.id}-quiz`,
    question: "Какой теме посвящен текущий урок?",
    options: [lessonTitle, ...distractors].slice(0, 4),
    correctAnswer: 0,
  };
}

function buildCourseArtwork(course: RawCourse) {
  return createGradientArtwork(course.title, `День ${course.id.replace("day-", "")}`, course.color);
}

function buildLessonArtwork(course: RawCourse, lesson: RawLesson) {
  return withBasePath(lesson.coverUrl) ?? createGradientArtwork(normalizeLessonTitle(lesson), course.title, course.color);
}

export const programCourses = rawCourses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  progress: 0,
  totalLessons: course.lessons.length,
  completedLessons: 0,
  color: course.color,
  status: "не начат",
  isAssigned: true,
  isMandatory: course.isMandatory,
  isRecommended: course.isRecommended,
  deadline: course.deadline,
  artwork: buildCourseArtwork(course),
  lessons: course.lessons.map((lesson) => {
    const narrative = buildLessonNarrative(course, lesson);

    return {
      id: lesson.id,
      title: normalizeLessonTitle(lesson),
      duration: normalizeDuration(lesson),
      type: lessonKind(lesson),
      day: lesson.day,
      isCompleted: false,
      quizPassed: false,
      progress: 0,
      thumbnail: buildLessonArtwork(course, lesson),
      shortDescription: narrative.shortDescription,
      description: narrative.description,
      fullDescription: narrative.fullDescription,
      objectives: narrative.objectives,
      videoCaption: narrative.videoCaption,
      videoUrl: withBasePath(lesson.videoUrl),
      presentationPdfUrl: withBasePath(lesson.presentationPdfUrl),
      presentationPptxUrl: null,
      coverUrl: withBasePath(lesson.coverUrl),
      videoSequence: lesson.videoSequence.map((item) => ({
        ...item,
        url: withBasePath(item.url) ?? item.url,
      })),
      speakerName: lesson.speakerName,
      resources: [
        lesson.presentationPdfUrl
          ? {
              id: `${lesson.id}-pdf`,
              label: "PDF-презентация",
              url: withBasePath(lesson.presentationPdfUrl) ?? lesson.presentationPdfUrl,
            }
          : null,
      ].filter(Boolean),
    };
  }),
}));

export const programTests = Object.fromEntries(rawCourses.map((course) => [course.id, buildTestQuestions(course)]));

export function getMockTestForCourse(courseId: string) {
  return programTests[courseId] ?? programTests[programCourses[0].id] ?? [];
}

export function getMockQuizForLesson(courseId: string, lessonId: string) {
  const course = rawCourses.find((item) => item.id === courseId) ?? rawCourses[0];
  return buildQuizQuestion(course, lessonId);
}

export const programNews = [
  {
    id: "program-launch",
    title: "Старт двухдневной программы адаптации",
    description:
      "В компании запущен обновленный трек обучения мастеров: первый день посвящен бренду и клиентскому пути, второй — продажам и доведению до сделки.",
    date: "2026-04-23",
    image: programCourses[0]?.artwork,
    tag: "Программа",
  },
  {
    id: "sales-focus",
    title: "Фокус недели: продажи через ценность сервиса",
    description:
      "В учебной программе акцент смещен на подготовку к контакту, выявление потребностей и презентацию продукта без давления на клиента.",
    date: "2026-04-24",
    image: programCourses[1]?.artwork ?? programCourses[0]?.artwork,
    tag: "Фокус дня",
  },
  {
    id: "materials-update",
    title: "В приложении доступны реальные материалы уроков",
    description:
      "Видео и PDF-презентации по каждому уроку уже подключены в программу, чтобы команда могла проходить обучение в одном потоке без заглушек.",
    date: "2026-04-25",
    image: createGradientArtwork("Материалы курсов", "Annaelle", "rose"),
    tag: "Обновление",
  },
];
