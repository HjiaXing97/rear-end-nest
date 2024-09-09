import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request } from "express";

interface RequestUser extends Request {
  user: {
    user_id: number;
    user_name: string;
  };
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject()
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestUser = context.switchToHttp().getRequest();

    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      "require-login",
      [context.getHandler(), context.getClass()]
    );

    if (!requireLogin) return true;

    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException("用户未登录");

    try {
      const token = authorization.split(" ")[0];
      const userData = this.jwtService.verify(token);

      request.user = {
        user_id: userData.user_id,
        user_name: userData.user_name
      };

      return true;
    } catch (e) {
      console.log(e);

      throw new UnauthorizedException("token 失效，请重新登录");
    }
  }
}
