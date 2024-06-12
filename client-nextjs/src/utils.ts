// Helpful utility functions used throughout the app
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Used to merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAPIServerURL = () =>
  process.env.API_SERVER_URL || 'http://localhost:5001/wealthos/us-central1/app';
