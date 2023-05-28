import type { IWidget } from "./widget"

export interface ISpaces {
  [key: string]: ISpace
}

export interface ISpace {
  uid: string
  created_at: string
  updated_at: string
  owner: string
  name: string
  description: string
  is_bookmarked: boolean
}

export interface ISpaceResponse extends ISpace {
  widgets?: IWidget[]
}
