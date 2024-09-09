import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RedisService } from "@/common/redis/redis.service";

import { CreateUserDto, UpdateUserDto, LoginUserDto } from "./dto";

import { User } from "./entities";
import { md5 } from "@/utils";
import { ConfigService } from "@nestjs/config";

import type { UserWithToken } from "./types/type";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject(RedisService)
  private readonly redisServive: RedisService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async create(createUserDto: CreateUserDto) {
    const captcha = await this.redisServive.get(
      `captcha_${createUserDto.phone_number}`
    );

    if (!captcha)
      throw new HttpException("验证码已过期", HttpStatus.BAD_REQUEST);

    if (captcha !== createUserDto.captcha)
      throw new HttpException("验证码错误", HttpStatus.BAD_REQUEST);

    const findUser = await this.userRepository.findOneBy({
      user_name: createUserDto.user_name
    });

    if (findUser)
      throw new HttpException("用户名已存在", HttpStatus.BAD_REQUEST);

    const newUser = new User();
    newUser.user_name = createUserDto.user_name;
    newUser.email = createUserDto.email;
    newUser.password = md5(createUserDto.password);
    newUser.phone_number = createUserDto.phone_number;

    try {
      await this.userRepository.save(newUser);

      return "注册成功";
    } catch (error) {
      this.logger.error(error, newUser);
      return "注册失败";
    }
  }

  async login(user: LoginUserDto) {
    const findUser = (await this.userRepository.findOne({
      where: {
        user_name: user.username
      }
    })) as UserWithToken;
    if (!findUser)
      throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);

    if (findUser.password !== md5(user.password))
      throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);

    findUser.access_token = this.jwtService.sign(
      {
        user_id: findUser.id,
        user_name: findUser.user_name
      },
      {
        expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRES_TIME")
      }
    );

    findUser.refresh_token = this.jwtService.sign(
      {
        user_id: findUser.id
      },
      {
        expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPRES_TIME")
      }
    );

    return findUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: {
        id
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);

    updateUserDto.id = user.id;
    try {
      this.userRepository.save(updateUserDto);
      return "更新成功";
    } catch (error) {
      this.logger.error(error, UserService);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
