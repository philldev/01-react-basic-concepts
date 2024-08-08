import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isReactElement(value: unknown): value is React.ReactElement {
  return typeof value === "object" && value != null && "type" in value;
}

export function prefixObjectKeys<T extends Object, K extends string>(
  object: T,
  prefix: K,
): Prefixed<T, K> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [`${prefix}${key}`, value]),
  ) as any;
}

type Prefixed<T, K extends string> = {
  [P in keyof T as P extends string ? `${K}${P}` : never]: T[P];
};
