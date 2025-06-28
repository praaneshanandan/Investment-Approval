import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format amount in Indian currency format (₹) with proper comma placement
export function formatIndianCurrency(amount: number): string {
  const formatted = amount.toFixed(2);
  const [wholePart, decimalPart] = formatted.split(".");

  const lastThree =
    wholePart.length > 3 ? wholePart.substr(wholePart.length - 3) : wholePart;
  const otherNumbers =
    wholePart.length > 3 ? wholePart.substr(0, wholePart.length - 3) : "";

  const formattedWholePart =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;

  return `₹${formattedWholePart}.${decimalPart}`;
}
