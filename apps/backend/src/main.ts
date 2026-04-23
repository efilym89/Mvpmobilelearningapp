import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT ?? 4100);
  await app.listen(port);
}

void bootstrap();
