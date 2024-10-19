import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { omit } from "lodash";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RedisService } from "@/common/redis/redis.service";
import { PrismaService } from "@/common/prisma/prisma.service";

import { md5 } from "@/utils/md5";

@Injectable()
export class UserService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async create(createUserDto: CreateUserDto) {
    const {
      phone_number,
      captcha: user_captcha,
      user_name,
      password
    } = createUserDto;

    /** 通过redis获取验证吗 */
    const captcha = await this.redisService.get(`captcha_${phone_number}`);

    if (user_captcha !== captcha)
      throw new HttpException("验证码错误", HttpStatus.BAD_REQUEST);

    if (!captcha)
      throw new HttpException("验证码已过期", HttpStatus.BAD_REQUEST);

    const user = await this.prismaService.user.findUnique({
      where: {
        user_name
      }
    });

    if (user) throw new HttpException("用户名已存在", HttpStatus.BAD_REQUEST);

    const param = omit({ ...createUserDto, password: md5(password) }, [
      "captcha"
    ]);

    /** 返回对象中去除密码字段 */
    return omit(
      await this.prismaService.user.create({
        // @ts-ignore
        data: param
      }),
      "password"
    );
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);

    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
