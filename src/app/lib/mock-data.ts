export const mockUser = {
  name: "Александр",
  role: "Менеджер по продажам",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=256&h=256",
  completedCourses: 4,
  averageScore: 92,
  learningHours: 12
};

export const courses = [
  {
    id: "1",
    title: "Корпоративная этика 101",
    description: "Изучите основные ценности и этические стандарты нашей компании.",
    progress: 40,
    totalLessons: 6,
    completedLessons: 2,
    color: "rose", // "rose" | "green"
    lessons: [
      { id: "101", title: "Введение в этику", duration: "5 мин", type: "видео", day: 1, isCompleted: true, quizPassed: true, progress: 100, thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "102", title: "Поведение на рабочем месте", duration: "8 мин", type: "видео", day: 1, isCompleted: true, quizPassed: true, progress: 100, thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "103", title: "Конфиденциальность данных", duration: "10 мин", type: "видео", day: 1, isCompleted: false, quizPassed: false, progress: 100, thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1600&h=900" }, // Watched, but quiz not passed yet
      { id: "104", title: "Разрешение конфликтов", duration: "7 мин", type: "видео", day: 2, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600&h=900" }, // Locked
      { id: "105", title: "Корпоративные финансы", duration: "12 мин", type: "видео", day: 2, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "106", title: "Итоговое тестирование", duration: "15 мин", type: "тест", day: 2, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "" }
    ]
  },
  {
    id: "2",
    title: "Эффективная коммуникация",
    description: "Освойте искусство ясной и эмпатичной коммуникации в команде.",
    progress: 25,
    totalLessons: 4,
    completedLessons: 1,
    color: "green",
    lessons: [
      { id: "201", title: "Активное слушание", duration: "6 мин", type: "видео", day: 1, isCompleted: true, quizPassed: true, progress: 100, thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "202", title: "Написание понятных писем", duration: "5 мин", type: "видео", day: 1, isCompleted: false, quizPassed: false, progress: 30, thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "203", title: "Фреймворки обратной связи", duration: "8 мин", type: "видео", day: 2, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "204", title: "Тест по коммуникации", duration: "10 мин", type: "тест", day: 2, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "" }
    ]
  },
  {
    id: "3",
    title: "Безопасность продукта",
    description: "Лучшие практики поддержания безопасности и надежности продукта.",
    progress: 0,
    totalLessons: 3,
    completedLessons: 0,
    color: "rose",
    lessons: [
      { id: "301", title: "Модели угроз", duration: "10 мин", type: "видео", day: 1, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "302", title: "Безопасная разработка", duration: "15 мин", type: "видео", day: 1, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1600&h=900" },
      { id: "303", title: "Оценка безопасности", duration: "20 мин", type: "тест", day: 2, isCompleted: false, quizPassed: false, progress: 0, thumbnail: "" }
    ]
  }
];

export const mockTest = [
  {
    id: "q1",
    question: "Какой способ разрешения конфликта на рабочем месте наиболее эффективен?",
    options: [
      "Игнорировать, пока всё не решится само собой",
      "Открыто и профессионально обсудить с вовлеченными сторонами",
      "Немедленно сообщить в HR, не разговаривая с человеком",
      "Пожаловаться другим коллегам"
    ],
    correctAnswer: 1
  },
  {
    id: "q2",
    question: "В каком случае допустимо делиться данными клиентов?",
    options: [
      "Когда партнер запрашивает их",
      "Только при явном разрешении и в рамках правил комплаенса",
      "Когда вы считаете, что это поможет закрыть сделку",
      "Никогда, ни при каких обстоятельствах"
    ],
    correctAnswer: 1
  },
  {
    id: "q3",
    question: "Что из перечисленного является ключевой ценностью компании?",
    options: [
      "Двигаться быстро и всё ломать",
      "Честность и прозрачность",
      "Прибыль важнее всего",
      "Личный успех на первом месте"
    ],
    correctAnswer: 1
  }
];

export const mockQuiz = {
  id: "quiz-103",
  question: "Главная мысль урока о конфиденциальности данных — это:",
  options: [
    "Всегда делиться данными с коллегами",
    "Отдавать приоритет прозрачности, но соблюдать справочник сотрудника",
    "Хранить все данные локально",
    "Не обращать внимания на мелкие ошибки"
  ],
  correctAnswer: 1
};
