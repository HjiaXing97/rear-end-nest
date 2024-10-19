import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";

import { PrismaModule, RedisModule, AlicloudModule } from "@/common";
import { UserModule, RoleModule } from "@/module";
import { LoginGuard } from "@/common/guard/login/login.guard";
import EnvVariableEnum from "./static/envEnum";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "/.env"
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(EnvVariableEnum.JWT_SECRET),
          signOptions: {
            expiresIn: configService.get(
              EnvVariableEnum.JWT_ACCESS_TOKEN_EXPIRES
            )
          }
        };
      },
      inject: [ConfigService]
    }),
    PrismaModule,
    RedisModule,
    UserModule,
    RoleModule,
    AlicloudModule
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
