import * as crypto from "crypto";

export function md5(str: string) {
  return crypto.createHash("md5").update(str).digest("hex");
}

export function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
