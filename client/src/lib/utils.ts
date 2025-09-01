import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}m`;
}

export function getAttendanceStatusColor(status: 'present' | 'absent' | 'late'): string {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-800';
    case 'late':
      return 'bg-yellow-100 text-yellow-800';
    case 'absent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function isLateArrival(clockIn: string): boolean {
  const clockInTime = new Date(`2000-01-01T${clockIn}`);
  const standardStart = new Date('2000-01-01T09:00'); // 9 AM standard start time
  return clockInTime > standardStart;
}

export function getCurrentTime(): string {
  return new Date().toTimeString().split(' ')[0].substring(0, 5);
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateRange(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

export function calculateAttendanceRate(present: number, total: number): number {
  return total > 0 ? Math.round((present / total) * 100) : 0;
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function getStatusIcon(status: 'present' | 'absent' | 'late'): string {
  switch (status) {
    case 'present':
      return '✅';
    case 'late':
      return '⚠️';
    case 'absent':
      return '❌';
    default:
      return '❓';
  }
}

export function getDepartmentIcon(department: string): string {
  const icons: Record<string, string> = {
    'Engineering': '👨‍💻',
    'Product': '📱',
    'Design': '🎨',
    'Marketing': '📢',
    'Sales': '💼',
    'HR': '👥',
    'Finance': '💰',
    'Operations': '⚙️'
  };
  return icons[department] || '🏢';
}

export function getActivityIcon(type: 'employee_added' | 'clock_in' | 'clock_out' | 'attendance_added'): string {
  switch (type) {
    case 'employee_added':
      return '👤';
    case 'clock_in':
      return '🕘';
    case 'clock_out':
      return '🕐';
    case 'attendance_added':
      return '📝';
    default:
      return '📋';
  }
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return time.toLocaleDateString();
}
