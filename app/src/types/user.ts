import type { ISpace } from "./space";

export interface IUser {
  uid: string,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  spaces: ISpace[],
  default_space: string | null,
}


export interface IGoogleResponse {
  access_token: string,
  refresh_token: string,
  user: IUser,
}
