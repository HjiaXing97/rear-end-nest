import { ConfigService } from "@nestjs/config";
import { Global, Module } from "@nestjs/common";
import { createClient } from "redis";

import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [
    RedisService,

    /** 配置redis链接信息 */
    {
      provide: "REDIS_CLIENT",
      async useFactory(configServer: ConfigService) {
        const client = createClient({
          socket: {
            host: configServer.get("REDIS_SERVICE_HOST"),
            port: configServer.get("REDIS_SERVICE_PORT")
          },
          database: configServer.get("REDIS_SERVICE_DB")
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
