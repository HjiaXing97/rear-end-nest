import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "@/common/decorators/public.decorators";
import { Pagination } from "@/common/decorators/pagination.decorators";

@Controller("user")
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Public()
  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Post("login")
  login(@Body() loginParam: { user_name: string; password: string }) {
    return this.userService.login(loginParam);
  }

  @Get("list/all")
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }

  @Get("page/list")
  pageList(
    @Query("user_name") user_name: string,
    @Query("real_name") real_name: string,
    @Pagination()
    pagination: {
      skip: number;
      take: number;
    }
  ) {
    return this.userService.pageList(pagination, user_name, real_name);
  }

  @Get("frozen/:id")
  frozen(@Param("id") id: string) {
    return this.userService.frozen(id);
  }
}
