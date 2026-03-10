/**
 * Lib Index
 * Central export for utility libraries
 */

export * from './spacing';
export * from './compatibility';
export * from './presetToLayout';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export * from './animations';
