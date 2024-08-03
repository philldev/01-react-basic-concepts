import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isReactElement(value: unknown): value is React.ReactElement {
  return typeof value === "object" && value != null && "type" in value;
}
