import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { omit } from "lodash";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RedisService } from "@/common/redis/redis.service";
import { PrismaService } from "@/common/prisma/prisma.service";
import { AlicloudService } from "@/common/alicloud/alicloud.service";
import EnvVariableEnum from "@/static/envEnum";

import { md5 } from "@/utils/md5";

@Injectable()
export class UserService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(AlicloudService)
  private readonly alicloudService: AlicloudService;

  async create(createUserDto: CreateUserDto) {
    const {
      phone_number,
      captcha: user_captcha,
      user_name,
      password
    } = createUserDto;

    await this.alicloudService.sendMessage(phone_number);

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

  async login(v: { user_name: string; password: string }) {
    const { user_name, password } = v;
    const user = await this.prismaService.user.findUnique({
      where: {
        user_name
      }
    });

    if (!user) throw new HttpException("用户名不存在", HttpStatus.BAD_REQUEST);
    if (user.password !== md5(password))
      throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);

    const access_token = this.jwtService.sign(
      {
        id: user.id,
        username: user.user_name
      },
      {
        expiresIn: this.configService.get(
          EnvVariableEnum.JWT_ACCESS_TOKEN_EXPIRES
        )
      }
    );

    const refresh_token = this.jwtService.sign(
      {
        id: user.id,
        username: user.user_name
      },
      {
        expiresIn: this.configService.get(
          EnvVariableEnum.JWT_REFRESH_TOKEN_EXPIRES
        )
      }
    );

    return omit({ ...user, access_token, refresh_token }, "password");
  }

  async findAll() {
    return (
      (await this.prismaService.user.findMany()) ??
      [].map(item => omit(item, "password"))
    );
  }

  async findOne(id: string) {
    return omit(
      await this.prismaService.user.findUnique({
        where: {
          id
        }
      }),
      "password"
    );
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id
      },
      data: updateUserDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
