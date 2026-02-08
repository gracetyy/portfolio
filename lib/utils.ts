import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a pseudo-random number based on a seed value.
 * Uses sine function for deterministic randomness.
 * @param seed - The seed value for generating the random number
 * @returns A number between 0 and 1
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
