import {
  getMockQuizForLesson,
  getMockTestForCourse,
  programCourses,
  programNews,
} from "./training-program";

export const mockUser = {
  name: "Аннаель Академия",
  role: "Мастер Annaelle",
  isAdmin: true,
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256",
  completedCourses: 0,
  averageScore: 0,
  learningHours: 6,
  level: "Старт программы",
  levelProgress: 24,
  levelPointsToNext: 76,
};

export const news = programNews;

export const mockEmployees = [
  { id: "e1", name: "Елена Миронова", role: "Мастер", progress: 18, courses: 2 },
  { id: "e2", name: "София Климова", role: "Старший мастер", progress: 42, courses: 2 },
  { id: "e3", name: "Марина Орлова", role: "Куратор обучения", progress: 100, courses: 2 },
];

export const courses = programCourses;

export const mockTest = getMockTestForCourse(courses[0]?.id ?? "day-1");

export const mockQuiz = getMockQuizForLesson(
  courses[0]?.id ?? "day-1",
  courses[0]?.lessons[0]?.id ?? "day-1-lesson-1",
);

export { getMockQuizForLesson, getMockTestForCourse };
