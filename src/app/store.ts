import { create } from "zustand";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  status: "not_started" | "in_progress" | "completed";
}

interface UserState {
  courses: Course[];
  markLessonComplete: (courseId: string) => void;
  markTestPassed: (courseId: string) => void;
}

export const useStore = create<UserState>((set) => ({
  courses: [
    {
      id: "1",
      title: "Основы корпоративной этики",
      description: "Базовый курс для новых сотрудников о ценностях компании.",
      progress: 60,
      totalLessons: 5,
      completedLessons: 3,
      status: "in_progress",
    },
    {
      id: "2",
      title: "Стандарты обслуживания",
      description: "Как общаться с клиентами и решать сложные ситуации.",
      progress: 0,
      totalLessons: 4,
      completedLessons: 0,
      status: "not_started",
    },
    {
      id: "3",
      title: "Продуктовая линейка 2024",
      description: "Новые продукты и их ключевые преимущества.",
      progress: 100,
      totalLessons: 3,
      completedLessons: 3,
      status: "completed",
    },
  ],
  markLessonComplete: (courseId) =>
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId && c.completedLessons < c.totalLessons) {
          const newCompleted = c.completedLessons + 1;
          const newProgress = Math.round((newCompleted / c.totalLessons) * 100);
          return {
            ...c,
            completedLessons: newCompleted,
            progress: newProgress,
            status: newProgress === 100 ? "completed" : "in_progress",
          };
        }
        return c;
      }),
    })),
  markTestPassed: (courseId) =>
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            progress: 100,
            completedLessons: c.totalLessons,
            status: "completed",
          };
        }
        return c;
      }),
    })),
}));
