export interface IFont {
  category: string
  family: string
  files: Record<string, string>
  kind: string
  lastModified: string
  subsets: string[]
  variants: string[]
  version: string
}
