export type buttonProp = {
  content?: string,
  type?: "button" | "submit" | "reset",
  myStyles?: string | "",
  handleClick?: React.MouseEventHandler | undefined,
  icon?: string,
  iconPos: "front" | "back" | "none"
}

export type BtnLink = {
  to: string,
  content?: string,
  icon?: string,
  image?: string,
  myStyles?: string,
  iconPos: "front" | "back" | "none"
}