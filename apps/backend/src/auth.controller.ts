import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { DemoDataService } from "./demo-data.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly demoData: DemoDataService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    const session = this.demoData.login(body.email, body.password);

    if (!session) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return session;
  }
}
