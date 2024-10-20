import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Dysmsapi20170525, * as $Dysmsapi20170525 from "@alicloud/dysmsapi20170525";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";

import { RedisService } from "@/common/redis/redis.service";
import EnvVariableEnum from "@/static/envEnum";
import { generateRandomCode } from "@/utils/md5";
import { log } from "console";
@Injectable()
export class AlicloudService {
  private client: Dysmsapi20170525;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  onModuleInit() {
    const config = new $OpenApi.Config({
      accessKeyId: this.configService.get(EnvVariableEnum.ALIYUN_ACCESS_KEY_ID),
      accessKeySecret: this.configService.get(
        EnvVariableEnum.ALIYUN_ACCESS_KEY_SECRET
      ),
      endpoint: "dysmsapi.aliyuncs.com"
    });

    this.client = new Dysmsapi20170525(config);
  }
  async sendMessage(phone_number: string) {
    const param = {
      signName: "Ethan的个人网站",
      templateCode: "SMS_475030055",
      phoneNumbers: phone_number,
      templateParam: generateRandomCode()
    };

    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest(param);
    const runtime = new $Util.RuntimeOptions({});

    try {
      const res = await this.client.sendSmsWithOptions(sendSmsRequest, runtime);
      this.redisService.set(`captcha_${phone_number}`, param.templateParam);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
}
