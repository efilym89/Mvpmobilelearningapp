import { create } from "zustand";
import type { AuthSession, CourseSummary } from "../domain/mvp";
import { courses as mockCourses } from "./lib/mock-data";

const SESSION_STORAGE_KEY = "annaelle-mvp-session-v2";

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function persistSession(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

interface AppState {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  courses: CourseSummary[];
  hydrateSession: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  toggleAdmin: () => void;
}

const initialSession = readStoredSession();

function toLegacyCourseSummaries(): CourseSummary[] {
  return mockCourses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    progress: course.progress,
    totalLessons: course.totalLessons,
    completedLessons: course.completedLessons,
    color: course.color,
    isMandatory: course.isMandatory,
    isRecommended: Boolean(course.isRecommended),
    deadline: course.deadline,
    status:
      course.progress >= 100 || course.completedLessons >= course.totalLessons
        ? "completed"
        : course.progress > 0 || course.completedLessons > 0
          ? "in_progress"
          : "not_started",
  }));
}

export const useStore = create<AppState>((set) => ({
  session: initialSession,
  isAuthenticated: Boolean(initialSession),
  isAdmin: initialSession?.user.role === "admin",
  courses: toLegacyCourseSummaries(),
  hydrateSession: () => {
    const session = readStoredSession();
    set({
      session,
      isAuthenticated: Boolean(session),
      isAdmin: session?.user.role === "admin",
      courses: toLegacyCourseSummaries(),
    });
  },
  setSession: (session) => {
    persistSession(session);
    set({
      session,
      isAuthenticated: true,
      isAdmin: session.user.role === "admin",
      courses: toLegacyCourseSummaries(),
    });
  },
  clearSession: () => {
    persistSession(null);
    set({
      session: null,
      isAuthenticated: false,
      isAdmin: false,
      courses: toLegacyCourseSummaries(),
    });
  },
  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),
}));
