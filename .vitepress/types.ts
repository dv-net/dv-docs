export type SidebarItemType = {
  text: string
  link?: string
  collapsible?: boolean
  collapsed?: boolean
  items?: [text: string, link: string]
}

export type RegionsType = {
  name: string
  slug: string
  code?: string
  svg?: string
}