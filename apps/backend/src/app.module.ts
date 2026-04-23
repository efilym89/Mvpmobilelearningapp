import { Module } from "@nestjs/common";
import { DemoDataService } from "./demo-data.service.js";
import { AuthController } from "./auth.controller.js";
import { CoursesController } from "./courses.controller.js";
import { AdminController } from "./admin.controller.js";

@Module({
  controllers: [AuthController, CoursesController, AdminController],
  providers: [DemoDataService],
})
export class AppModule {}
