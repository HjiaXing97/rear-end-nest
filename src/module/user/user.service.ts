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

  async pageList(
    pagination: { skip: number; take: number },
    user_name: string,
    real_name: string
  ) {
    /** 获取总条数 */
    const total = await this.prismaService.user.count({
      where: {
        user_name: {
          contains: user_name
        },
        real_name: {
          contains: real_name
        },
        is_deleted: false,
        is_frozen: false
      }
    });

    /** 获取分页数据 */
    const records = await this.prismaService.user.findMany({
      where: {
        user_name: {
          contains: user_name
        },
        real_name: {
          contains: real_name
        },
        is_deleted: false,
        is_frozen: false
      },
      skip: pagination.skip,
      take: pagination.take
    });

    /** 返回分当前页码 */
    const currentPage = Math.ceil(pagination.skip / pagination.take) + 1;
    const totalPages = Math.ceil(total / pagination.take);

    return {
      total,
      currentPage,
      totalPages,
      records
    };
  }
  async remove(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      }
    });

    if (!user) throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);
    if (user.is_deleted)
      throw new HttpException("用户已删除", HttpStatus.BAD_REQUEST);

    await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        is_deleted: true
      }
    });

    return "删除成功";
  }

  async frozen(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      }
    });

    if (!user)
      throw new HttpException("用户不存在", HttpStatus.INTERNAL_SERVER_ERROR);
    if (user.is_frozen)
      throw new HttpException("用户已冻结", HttpStatus.INTERNAL_SERVER_ERROR);

    if (user.is_deleted)
      throw new HttpException("用户已删除", HttpStatus.INTERNAL_SERVER_ERROR);
    await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        is_frozen: true
      }
    });

    return "冻结成功";
  }
}
