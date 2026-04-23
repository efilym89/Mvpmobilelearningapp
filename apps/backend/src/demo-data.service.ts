import { Injectable } from "@nestjs/common";
import {
  authenticateUser,
  completeLessonForUser,
  getAdminOverview,
  getCourseForUser,
  getLessonForUser,
  getTestForUser,
  listCoursesForUser,
  resolveUserFromToken,
  submitTestForUser,
} from "../preview-data.mjs";

@Injectable()
export class DemoDataService {
  login(email: string, password: string) {
    return authenticateUser(email, password);
  }

  resolveUser(token: string | null) {
    return resolveUserFromToken(token);
  }

  getCourses(userId: string) {
    return listCoursesForUser(userId);
  }

  getCourse(userId: string, courseId: string) {
    return getCourseForUser(userId, courseId);
  }

  getLesson(userId: string, courseId: string, lessonId: string) {
    return getLessonForUser(userId, courseId, lessonId);
  }

  completeLesson(userId: string, courseId: string, lessonId: string) {
    return completeLessonForUser(userId, courseId, lessonId);
  }

  getTest(courseId: string) {
    return getTestForUser(courseId);
  }

  submitTest(userId: string, courseId: string, answers: number[]) {
    return submitTestForUser(userId, courseId, answers);
  }

  getAdminOverview() {
    return getAdminOverview();
  }
}
