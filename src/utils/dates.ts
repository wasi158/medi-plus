const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDisplayDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseReportDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\w+)\s+(\d+),\s+(\d+)$/);
  if (!match) return null;
  const monthIndex = MONTHS.indexOf(match[1]);
  if (monthIndex === -1) return null;
  return new Date(parseInt(match[3], 10), monthIndex, parseInt(match[2], 10));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface CalendarDay {
  day: string;
  isCurrentMonth: boolean;
  label?: string;
  date?: Date;
  isPast?: boolean;
}

export function generateCalendarDays(year: number, month: number, today: Date = new Date()): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const todayStart = startOfDay(today);

  const days: CalendarDay[] = [];

  const prevMonthLast = new Date(year, month, 0).getDate();
  for (let i = startPadding - 1; i >= 0; i--) {
    days.push({ day: String(prevMonthLast - i), isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      day: String(d),
      isCurrentMonth: true,
      label: formatDisplayDate(date),
      date,
      isPast: startOfDay(date) < todayStart,
    });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: String(d), isCurrentMonth: false });
  }

  return days;
}

export function getDefaultBookingDate(today: Date = new Date()): string {
  const next = new Date(today);
  next.setDate(next.getDate() + 2);
  return formatDisplayDate(next);
}
