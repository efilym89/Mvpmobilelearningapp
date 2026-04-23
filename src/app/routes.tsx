import type { ComponentType } from "react";
import { Navigate, createBrowserRouter, createHashRouter, useLocation } from "react-router";
import { MobileLayout, StandaloneLayout } from "./components/layout/MobileLayout";
import { USE_HASH_ROUTER } from "./lib/runtime";
import { useStore } from "./store";
import LoginPage from "./pages/mvp/LoginPage";

function RootEntry() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/home" : "/onboarding"} replace />;
}

function PublicStandaloneLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <StandaloneLayout />;
}

function ProtectedMobileLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }

  return <MobileLayout />;
}

function ProtectedStandaloneLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }

  return <StandaloneLayout />;
}

function lazyDefault<TModule extends { default: ComponentType }>(loader: () => Promise<TModule>) {
  return async () => {
    const module = await loader();
    return { Component: module.default };
  };
}

function lazyNamed<TModule extends Record<string, unknown>, TName extends keyof TModule & string>(
  loader: () => Promise<TModule>,
  exportName: TName,
) {
  return async () => {
    const module = await loader();
    return { Component: module[exportName] as ComponentType };
  };
}

const routes = [
  {
    path: "/",
    Component: RootEntry,
  },
  {
    path: "/login",
    Component: PublicStandaloneLayout,
    children: [{ index: true, Component: LoginPage }],
  },
  {
    path: "/onboarding",
    Component: PublicStandaloneLayout,
    children: [{ index: true, lazy: lazyDefault(() => import("./pages/Onboarding")) }],
  },
  {
    path: "/signup",
    Component: PublicStandaloneLayout,
    children: [{ index: true, lazy: lazyDefault(() => import("./pages/Signup")) }],
  },
  {
    path: "/forgot-password",
    Component: PublicStandaloneLayout,
    children: [{ index: true, lazy: lazyDefault(() => import("./pages/ForgotPassword")) }],
  },
  {
    path: "/legacy/login",
    Component: PublicStandaloneLayout,
    children: [{ index: true, lazy: lazyDefault(() => import("./pages/Login")) }],
  },
  {
    path: "/",
    Component: ProtectedMobileLayout,
    children: [
      { path: "home", lazy: lazyDefault(() => import("./pages/Home")) },
      { path: "catalog", lazy: lazyDefault(() => import("./pages/Catalog")) },
      { path: "courses", lazy: lazyNamed(() => import("./pages/Courses"), "Courses") },
      { path: "dashboard", lazy: lazyDefault(() => import("./pages/Dashboard")) },
      { path: "profile", lazy: lazyDefault(() => import("./pages/Profile")) },
    ],
  },
  {
    path: "/",
    Component: ProtectedStandaloneLayout,
    children: [
      { path: "course/:id", lazy: lazyDefault(() => import("./pages/CourseDetail")) },
      { path: "course/:id/lesson/:lessonId", lazy: lazyDefault(() => import("./pages/Lesson")) },
      { path: "course/:id/lesson/:lessonId/pdf", lazy: lazyDefault(() => import("./pages/PdfViewer")) },
      { path: "course/:id/lesson/:lessonId/quiz", lazy: lazyDefault(() => import("./pages/Quiz")) },
      { path: "course/:id/test", lazy: lazyDefault(() => import("./pages/Test")) },
      { path: "course/:id/result", lazy: lazyDefault(() => import("./pages/Result")) },
      { path: "course/:id/certificate", lazy: lazyDefault(() => import("./pages/Certificate")) },
      { path: "legacy/course/:id", lazy: lazyNamed(() => import("./pages/Course"), "Course") },
    ],
  },
];

const createRouter = USE_HASH_ROUTER ? createHashRouter : createBrowserRouter;

export const router = createRouter(routes, {
  basename: import.meta.env.BASE_URL,
});
