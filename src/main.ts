import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";
import { FormatResponseInterceptor } from "@/common/interceptor/format-response.interceptor";
import { UnloginFilter } from "@/common/filter/unlogin/unlogin.filter";
import { CustomExceptionFilter } from "@/common/filter/custom-exception/custom-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new UnloginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(3000);
}
bootstrap();
