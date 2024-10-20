import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Pagination = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(),
      query = request.query,
      pageNo = parseInt(query.pageNo) || 1,
      pageSize = parseInt(query.pageSize) || 10,
      skip = (pageNo - 1) * pageSize,
      take = pageSize;

    return { skip, take };
  }
);
