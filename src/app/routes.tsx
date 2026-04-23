import { createBrowserRouter } from "react-router";
import { MobileLayout, StandaloneLayout } from "./components/layout/MobileLayout";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CourseDetail from "./pages/CourseDetail";
import Lesson from "./pages/Lesson";
import Test from "./pages/Test";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import { Navigate } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    Component: StandaloneLayout,
    children: [
      { index: true, Component: Onboarding }
    ]
  },
  {
    path: "/login",
    Component: StandaloneLayout,
    children: [
      { index: true, Component: Login }
    ]
  },
  {
    path: "/signup",
    Component: StandaloneLayout,
    children: [
      { index: true, Component: Signup }
    ]
  },
  {
    path: "/forgot-password",
    Component: StandaloneLayout,
    children: [
      { index: true, Component: ForgotPassword }
    ]
  },
  {
    path: "/",
    Component: MobileLayout,
    children: [
      { index: true, Component: Home },
      { path: "courses", Component: Catalog },
      { path: "progress", element: <Navigate to="/profile" replace /> },
      { path: "profile", Component: Profile },
      { path: "dashboard", Component: Dashboard },
    ],
  },
  {
    path: "/",
    Component: StandaloneLayout,
    children: [
      { path: "course/:id", Component: CourseDetail },
      { path: "course/:id/lesson/:lessonId", Component: Lesson },
      { path: "course/:id/lesson/:lessonId/quiz", Component: Quiz },
      { path: "course/:id/test", Component: Test },
      { path: "course/:id/result", Component: Result },
      { path: "course/:id/certificate", Component: Certificate },
    ]
  }
]);
