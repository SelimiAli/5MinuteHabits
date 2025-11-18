/**
 * Date utility functions for habit tracking
 */

export function getTodayISO(): string {
  const today = new Date();
  return formatToISO(today);
}

export function formatToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateString: string | null): boolean {
  if (!dateString) return false;
  return dateString === getTodayISO();
}

export function isYesterday(dateString: string | null): boolean {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === formatToISO(yesterday);
}

export function parseISO(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

export function getYesterdayISO(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatToISO(yesterday);
}

