import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorators";

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(Reflector)
  private readonly reflect: Reflector;

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflect.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;

    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException("用户未登录");

    try {
      const token = authorization;
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new UnauthorizedException("token失效,请重新登录");
    }
  }
}
