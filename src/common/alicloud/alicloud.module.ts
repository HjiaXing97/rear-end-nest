import { Module } from "@nestjs/common";
import { AlicloudService } from "./alicloud.service";

@Module({
  controllers: [],
  providers: [AlicloudService]
})
export class AlicloudModule {}
