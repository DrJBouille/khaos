import { LucideIcon } from "lucide-react";

export type ButtonProps = {
  text?: string,
  icon?: LucideIcon;
  onClick: () => void,
  type?: "button" | "submit" | "reset"
  fit?: boolean
  center?: boolean
}
