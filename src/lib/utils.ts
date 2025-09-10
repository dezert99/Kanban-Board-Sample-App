import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateTaskId(): string {
  const timestamp = Date.now().toString().slice(-6);
  return `TSK-${timestamp}`;
}