import { IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";
export class CreateUserDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  user_name: string;

  @IsNotEmpty({ message: "密码不能为空" })
  @MinLength(6, { message: "密码长度不能小于6位" })
  password: string;
  @IsNotEmpty({ message: "真实姓名不能为空" })
  real_name: string;

  @IsNotEmpty({ message: "手机号不能为空" })
  @IsPhoneNumber("CN", { message: "手机号格式不正确" })
  phone_number: string;

  @IsNotEmpty({ message: "验证码不能为空" })
  captcha: string;

  email?: string;
  head_pic?: string;
  roleId?: string;
}
