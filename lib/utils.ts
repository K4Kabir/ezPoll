import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isPollActive = (creationTime: number, validityTill: number) => {
  const expirationTime = Math.floor(creationTime) + validityTill * 60 * 1000;
  return Date.now() < expirationTime;
};
