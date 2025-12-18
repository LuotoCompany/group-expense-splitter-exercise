import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Split an amount equally among a given number of people, assigning any remaining cents
 * to the last person to ensure the sum equals the original amount.
 *
 * @param totalAmount - The total amount to split
 * @param numberOfPeople - The number of people to split among
 * @returns Array of split amounts (as numbers with 2 decimal places)
 *
 * @example
 * splitAmountEqually(10, 3) // Returns [3.33, 3.33, 3.34]
 * splitAmountEqually(100, 3) // Returns [33.33, 33.33, 33.34]
 */
export function splitAmountEqually(totalAmount: number, numberOfPeople: number): number[] {
  if (numberOfPeople <= 0 || totalAmount < 0) {
    return [];
  }

  // Calculate the base amount each person pays (rounded down to 2 decimals)
  const baseAmount = Math.floor((totalAmount / numberOfPeople) * 100) / 100;
  
  // Create array with base amount for each person
  const splits = new Array(numberOfPeople).fill(baseAmount);
  
  // Calculate the remainder (in cents, to avoid floating point issues)
  const totalAssigned = baseAmount * numberOfPeople;
  const remainder = Math.round((totalAmount - totalAssigned) * 100) / 100;
  
  // Add the remainder to the last person
  if (remainder > 0 && numberOfPeople > 0) {
    splits[numberOfPeople - 1] = Math.round((splits[numberOfPeople - 1] + remainder) * 100) / 100;
  }
  
  return splits;
}
