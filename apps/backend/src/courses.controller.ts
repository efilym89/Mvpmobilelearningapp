import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { DemoDataService } from "./demo-data.service.js";

function extractToken(value?: string) {
  return value?.startsWith("Bearer ") ? value.replace("Bearer ", "") : null;
}

@Controller("courses")
export class CoursesController {
  constructor(private readonly demoData: DemoDataService) {}

  @Get()
  listCourses(@Headers("authorization") authorization?: string) {
    const user = this.demoData.resolveUser(extractToken(authorization));

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.demoData.getCourses(user.id);
  }

  @Get(":courseId")
  getCourse(
    @Param("courseId") courseId: string,
    @Headers("authorization") authorization?: string,
  ) {
    const user = this.demoData.resolveUser(extractToken(authorization));
    if (!user) {
      throw new UnauthorizedException();
    }

    const course = this.demoData.getCourse(user.id, courseId);
    if (!course) {
      throw new NotFoundException();
    }

    return course;
  }

  @Get(":courseId/lessons/:lessonId")
  getLesson(
    @Param("courseId") courseId: string,
    @Param("lessonId") lessonId: string,
    @Headers("authorization") authorization?: string,
  ) {
    const user = this.demoData.resolveUser(extractToken(authorization));
    if (!user) {
      throw new UnauthorizedException();
    }

    const lesson = this.demoData.getLesson(user.id, courseId, lessonId);
    if (!lesson) {
      throw new NotFoundException();
    }

    return lesson;
  }

  @Post(":courseId/lessons/:lessonId/complete")
  completeLesson(
    @Param("courseId") courseId: string,
    @Param("lessonId") lessonId: string,
    @Headers("authorization") authorization?: string,
  ) {
    const user = this.demoData.resolveUser(extractToken(authorization));
    if (!user) {
      throw new UnauthorizedException();
    }

    const ok = this.demoData.completeLesson(user.id, courseId, lessonId);
    if (!ok) {
      throw new NotFoundException();
    }

    return { ok: true };
  }

  @Get(":courseId/test")
  getTest(
    @Param("courseId") courseId: string,
    @Headers("authorization") authorization?: string,
  ) {
    const user = this.demoData.resolveUser(extractToken(authorization));
    if (!user) {
      throw new UnauthorizedException();
    }

    const test = this.demoData.getTest(courseId);
    if (!test) {
      throw new NotFoundException();
    }

    return test;
  }

  @Post(":courseId/test/submit")
  submitTest(
    @Param("courseId") courseId: string,
    @Body() body: { answers: number[] },
    @Headers("authorization") authorization?: string,
  ) {
    const user = this.demoData.resolveUser(extractToken(authorization));
    if (!user) {
      throw new UnauthorizedException();
    }

    const result = this.demoData.submitTest(user.id, courseId, body.answers ?? []);
    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
