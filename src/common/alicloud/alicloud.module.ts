import { Global, Module } from "@nestjs/common";
import { AlicloudService } from "./alicloud.service";

@Global()
@Module({
  controllers: [],
  providers: [AlicloudService],
  exports: [AlicloudService]
})
export class AlicloudModule {}
