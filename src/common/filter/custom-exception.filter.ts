import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const statusCode = exception.getStatus();

    response
      .json({
        statusCode,
        data: exception.message,
        message: "fail",
        success: false
      })
      .end();
  }
}
