export const PRODUCT_IDEA = {
  name: "Annaelle Learning MVP",
  audience: "employee-training",
  primaryGoal: "Give employees training materials and verify knowledge through tests.",
  primaryScenario: "Employee studies course materials, then passes an exam based on them.",
} as const;

export const TARGET_STACK = {
  mobile: "Flutter",
  admin: "Next.js + TypeScript",
  backend: "NestJS",
  api: "REST",
  database: "PostgreSQL",
  repository: "pnpm-monorepo",
} as const;

export const TARGET_WORKSPACES = [
  "apps/mobile",
  "apps/admin",
  "apps/backend",
  "packages/shared-contracts",
  "packages/tooling",
  "docs",
  "infra",
] as const;

export const MVP_SCENARIOS = [
  "User signs in with employee or admin credentials.",
  "Employee studies assigned learning materials.",
  "Employee passes a final test for the course.",
  "System stores progress and test results.",
  "Admin sees course and employee overview.",
] as const;

export const DEFERRED_CAPABILITIES = [
  "Microservices",
  "CQRS",
  "Event-driven architecture",
  "Complex offline sync",
  "SSO",
  "Advanced analytics",
  "Push notifications",
  "Enterprise-grade integrations",
] as const;

export type UserRole = "employee" | "admin";
export type EnvironmentName = "local" | "dev" | "prod";
export type CourseStatus = "not_started" | "in_progress" | "completed" | "overdue";
export type CourseColor = "rose" | "green";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string;
  user: SessionUser;
}

export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  status: CourseStatus;
  color: CourseColor;
  isMandatory: boolean;
  isRecommended: boolean;
  deadline: string | null;
}

export interface LessonSummary {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article";
  progress: number;
  isCompleted: boolean;
}

export interface LessonDetails extends LessonSummary {
  courseId: string;
  content: string[];
  videoCaption: string;
  description?: string;
  objectives?: string[];
  videoUrl?: string | null;
  presentationPdfUrl?: string | null;
  presentationPptxUrl?: string | null;
  resources?: Array<{ id: string; label: string; url: string }>;
}

export interface CourseDetails extends CourseSummary {
  lessons: LessonSummary[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface TestDetails {
  id: string;
  courseId: string;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
  attemptsLimit: number;
  questions: Array<TestQuestion & { correctAnswer?: number }>;
}

export interface TestResult {
  attemptId: string;
  courseId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  spentTimeSeconds: number;
}

export interface EmployeeOverview {
  id: string;
  name: string;
  role: string;
  progress: number;
  courses: number;
  averageScore: number;
}

export interface AdminStats {
  totalCourses: number;
  activeEmployees: number;
  completedAttempts: number;
  averageScore: number;
}

export interface AdminOverview {
  stats: AdminStats;
  courses: CourseSummary[];
  employees: EmployeeOverview[];
}

export interface ApiErrorPayload {
  message: string;
}
