// Helpful utility functions used throughout the app
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jwtDecode from 'jsonwebtoken'

export const getTokenExpiry = (token: string) => {
  try {
    const decoded: any = jwtDecode.decode(token);
    return decoded?.exp as number;
  } catch (error) {
    console.error('Error decoding token:', error);
    return Date.now()
  }
};

// Used to merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Used to set the local storage with an expiry time
export function setLocalStorageWithExpiry(key: string, value: any, ttl: number) {
  const now = new Date();
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

// Used to get the local storage with an expiry time
export function getLocalStorageWithExpiry(key: string): any | null {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export const getAPIServerURL = () =>
  process.env.API_SERVER_URL || 'http://localhost:5001/wealthos/us-central1/app';
