import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";

import { RedisService } from "./redis.service";
import EnvVariableEnum from "@/static/envEnum";

@Global()
@Module({
  controllers: [],
  providers: [
    RedisService,
    {
      provide: "REDIS_CLIENT",
      async useFactory(configServer: ConfigService) {
        const client = createClient({
          socket: {
            host: configServer.get(EnvVariableEnum.REDIS_SERVER_HOST),
            port: configServer.get(EnvVariableEnum.REDIS_SERVER_PROT)
          },
          database: configServer.get(EnvVariableEnum.REDIS_SERVER_DB)
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
