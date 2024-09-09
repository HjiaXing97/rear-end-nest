import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from "@nestjs/common";

import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto, LoginUserDto } from "./dto";
import { RequireLogin } from "@/common/decorator/authentication.decorator";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("login")
  login(@Body() user: LoginUserDto) {
    return this.userService.login(user);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @RequireLogin()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @RequireLogin()
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @RequireLogin()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
