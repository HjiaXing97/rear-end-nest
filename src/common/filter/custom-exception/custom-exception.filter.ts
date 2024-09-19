import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    response.statusCode = exception.getStatus();

    response
      .json({
        statusCode: exception.getStatus(),
        success: false,
        message: exception.message
      })
      .end();
  }
}
