import { User } from "../entities";

export interface UserWithToken extends User {
  access_token: string;
  refresh_token: string;
}
