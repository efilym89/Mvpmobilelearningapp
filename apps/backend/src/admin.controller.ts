import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { DemoDataService } from "./demo-data.service.js";

function extractToken(value?: string) {
  return value?.startsWith("Bearer ") ? value.replace("Bearer ", "") : null;
}

@Controller("admin")
export class AdminController {
  constructor(private readonly demoData: DemoDataService) {}

  @Get("overview")
  getOverview(@Headers("authorization") authorization?: string) {
    const user = this.demoData.resolveUser(extractToken(authorization));

    if (!user || user.role !== "admin") {
      throw new UnauthorizedException();
    }

    return this.demoData.getAdminOverview();
  }
}
