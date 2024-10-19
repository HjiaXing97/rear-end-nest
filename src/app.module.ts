import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule, RedisModule } from "@/common";
import { UserModule, RoleModule } from "./module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "/.env"
    }),
    PrismaModule,
    RedisModule,
    UserModule,
    RoleModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
