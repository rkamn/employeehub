export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'late';
}

export type CreateEmployeeRequest = Omit<Employee, 'id'>;
export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest>;

export type CreateAttendanceRequest = Omit<AttendanceRecord, 'id' | 'totalHours'>;

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentCounts: Record<string, number>;
}

export interface AttendanceStats {
  totalRecords: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
}

export interface DashboardStats {
  employees: EmployeeStats;
  attendance: AttendanceStats;
  recentActivity: RecentActivity[];
  departmentAttendance: DepartmentAttendanceStats[];
  attendanceTrend: AttendanceTrendData[];
}

export interface RecentActivity {
  id: string;
  type: 'employee_added' | 'clock_in' | 'clock_out' | 'attendance_added';
  description: string;
  timestamp: string;
  employeeName?: string;
}

export interface DepartmentAttendanceStats {
  department: string;
  totalEmployees: number;
  presentToday: number;
  attendanceRate: number;
}

export interface AttendanceTrendData {
  date: string;
  present: number;
  late: number;
  absent: number;
  total: number;
}
