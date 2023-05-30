import type { ISpaceResponse } from "./space";

export interface IUser {
  pk: string,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  spaces: ISpaceResponse[],
  default_space: string | null,
}


export interface IGoogleResponse {
  access: string,
  refresh: string,
  user: IUser,
}
