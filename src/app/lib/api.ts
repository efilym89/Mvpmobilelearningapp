import { API_BASE_URL } from "./config";
import { demoApi } from "./demo-api";
import { IS_STATIC_DEMO } from "./runtime";
import type {
  AdminOverview,
  AuthSession,
  CourseDetails,
  CourseSummary,
  LessonDetails,
  TestDetails,
  TestResult,
} from "../../domain/mvp";

async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const rawText = await response.text();
  const payload = rawText ? (JSON.parse(rawText) as T | { message?: string }) : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message || "Request failed"
        : "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

const liveApi = {
  login(email: string, password: string) {
    return request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  getCourses(accessToken: string) {
    return request<CourseSummary[]>("/courses", {}, accessToken);
  },
  getCourse(accessToken: string, courseId: string) {
    return request<CourseDetails>(`/courses/${courseId}`, {}, accessToken);
  },
  getLesson(accessToken: string, courseId: string, lessonId: string) {
    return request<LessonDetails>(`/courses/${courseId}/lessons/${lessonId}`, {}, accessToken);
  },
  completeLesson(accessToken: string, courseId: string, lessonId: string) {
    return request<{ ok: true }>(
      `/courses/${courseId}/lessons/${lessonId}/complete`,
      {
        method: "POST",
      },
      accessToken,
    );
  },
  getTest(accessToken: string, courseId: string) {
    return request<TestDetails>(`/courses/${courseId}/test`, {}, accessToken);
  },
  submitTest(accessToken: string, courseId: string, answers: number[]) {
    return request<TestResult>(
      `/courses/${courseId}/test/submit`,
      {
        method: "POST",
        body: JSON.stringify({ answers }),
      },
      accessToken,
    );
  },
  getAdminOverview(accessToken: string) {
    return request<AdminOverview>("/admin/overview", {}, accessToken);
  },
};

export const api = IS_STATIC_DEMO ? demoApi : liveApi;
