import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";

import { UserModule } from "@/modules/user/user.module";
import { RedisModule } from "@/common/redis/redis.module";

import { Role, User, Permission } from "@/modules/user/entities";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { LoginGuard } from "@/common/guard/login/login.guard";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: "mysql",
          host: configService.get("MYSQL_SERVICE_HOST"),
          port: configService.get("MYSQL_SERVICE_PORT"),
          username: configService.get("MYSQL_SERVICE_USERNAME"),
          password: configService.get("MYSQL_SERVICE_PASSWORD"),
          database: configService.get("MYSQL_SERVICE_BATABASE"),
          synchronize: true,
          logging: true,
          entities: [Role, User, Permission],
          poolSize: 10,
          connectorPackage: "mysql2",
          extra: {
            authPlugins: "sha256_password"
          }
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "src/.env"
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get("JWT_ACCESS_TOKEN_EXPIRES_TIME")
          }
        };
      },
      inject: [ConfigService]
    }),
    UserModule,
    RedisModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    }
  ]
})
export class AppModule {}
