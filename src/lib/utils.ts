import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculatePercentageDifference(
    num1: number,
    num2: number
): number {
    if (num1 === num2) {
        return parseFloat(Number(0).toFixed(2));
    }

    if (num2 === 0) return parseFloat(Number(100).toFixed(2));

    const difference = num1 - num2;
    const percentageDifference = Math.abs((num1 * 100) / num2 - 100);

    return difference >= 0
        ? parseFloat(percentageDifference.toFixed(2))
        : -parseFloat(percentageDifference.toFixed(2));
}

export function formatDuration(seconds: number) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${Math.floor(seconds)}s`);

    return parts.length ? parts.join(" ") : "0s";
}

export function getCurrentDate() {
    const date = new Date();

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export function getTomorrowDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export function getFormatedDateString(date: string | Date) {
    const _date = new Date(date);

    const month = String(_date.getMonth() + 1).padStart(2, "0");
    const day = String(_date.getDate()).padStart(2, "0");
    const year = _date.getFullYear();

    return `${month}/${day}/${year}`;
}
