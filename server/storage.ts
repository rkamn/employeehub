import { Employee, AttendanceRecord, CreateEmployeeRequest, UpdateEmployeeRequest, DashboardStats, EmployeeStats, AttendanceStats, RecentActivity, DepartmentAttendanceStats, AttendanceTrendData } from '../shared/schema.js';

class InMemoryStorage {
  private employees: Map<string, Employee> = new Map();
  private attendance: Map<string, AttendanceRecord> = new Map();

  constructor() {
    this.initSampleData();
  }

  private initSampleData() {
    const sampleEmployees: Employee[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        position: 'Software Engineer',
        department: 'Engineering',
        salary: 75000,
        hireDate: '2023-01-15',
        status: 'active',
        phone: '+1-555-0123',
        address: '123 Main St, Anytown, USA'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        position: 'Product Manager',
        department: 'Product',
        salary: 85000,
        hireDate: '2022-11-01',
        status: 'active',
        phone: '+1-555-0124'
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@company.com',
        position: 'Designer',
        department: 'Design',
        salary: 65000,
        hireDate: '2023-03-10',
        status: 'active'
      }
    ];

    sampleEmployees.forEach(emp => this.employees.set(emp.id, emp));
    
    // Add sample attendance data
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const sampleAttendance: AttendanceRecord[] = [
      {
        id: 'att1',
        employeeId: '1',
        date: today,
        clockIn: '09:00',
        status: 'present'
      },
      {
        id: 'att2',
        employeeId: '2',
        date: today,
        clockIn: '09:15',
        status: 'late'
      },
      {
        id: 'att3',
        employeeId: '3',
        date: yesterday,
        clockIn: '08:45',
        clockOut: '17:30',
        totalHours: 8.75,
        status: 'present'
      },
      {
        id: 'att4',
        employeeId: '1',
        date: yesterday,
        clockIn: '09:00',
        clockOut: '18:00',
        totalHours: 9,
        status: 'present'
      },
      {
        id: 'att5',
        employeeId: '2',
        date: yesterday,
        clockIn: '09:30',
        clockOut: '17:45',
        totalHours: 8.25,
        status: 'late'
      }
    ];
    
    sampleAttendance.forEach(att => this.attendance.set(att.id, att));
  }

  // Employee operations
  getAllEmployees(): Employee[] {
    return Array.from(this.employees.values());
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.get(id);
  }

  createEmployee(data: CreateEmployeeRequest): Employee {
    const id = Date.now().toString();
    const employee: Employee = {
      id,
      ...data
    };
    this.employees.set(id, employee);
    return employee;
  }

  updateEmployee(id: string, data: UpdateEmployeeRequest): Employee | null {
    const existing = this.employees.get(id);
    if (!existing) return null;

    const updated: Employee = { ...existing, ...data };
    this.employees.set(id, updated);
    return updated;
  }

  deleteEmployee(id: string): boolean {
    return this.employees.delete(id);
  }

  // Attendance operations
  getAllAttendance(): AttendanceRecord[] {
    return Array.from(this.attendance.values());
  }

  getAttendanceByEmployeeId(employeeId: string): AttendanceRecord[] {
    return Array.from(this.attendance.values()).filter(
      record => record.employeeId === employeeId
    );
  }

  createAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const id = Date.now().toString();
    const attendanceRecord: AttendanceRecord = {
      id,
      ...record
    };
    this.attendance.set(id, attendanceRecord);
    return attendanceRecord;
  }

  updateAttendanceRecord(id: string, data: Partial<AttendanceRecord>): AttendanceRecord | null {
    const existing = this.attendance.get(id);
    if (!existing) return null;

    const updated: AttendanceRecord = { ...existing, ...data };
    this.attendance.set(id, updated);
    return updated;
  }

  deleteAttendanceRecord(id: string): boolean {
    return this.attendance.delete(id);
  }

  getAttendanceByDate(date: string): AttendanceRecord[] {
    return Array.from(this.attendance.values()).filter(
      record => record.date === date
    );
  }

  // Dashboard analytics methods
  getDashboardStats(): DashboardStats {
    return {
      employees: this.getEmployeeStats(),
      attendance: this.getAttendanceStats(),
      recentActivity: this.getRecentActivity(),
      departmentAttendance: this.getDepartmentAttendanceStats(),
      attendanceTrend: this.getAttendanceTrend()
    };
  }

  getEmployeeStats(): EmployeeStats {
    const employees = this.getAllEmployees();
    const departmentCounts: Record<string, number> = {};
    
    employees.forEach(emp => {
      departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
    });

    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      inactiveEmployees: employees.filter(emp => emp.status === 'inactive').length,
      departmentCounts
    };
  }

  getAttendanceStats(): AttendanceStats {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.getAttendanceByDate(today);
    
    return {
      totalRecords: this.getAllAttendance().length,
      presentToday: todayAttendance.filter(att => att.status === 'present').length,
      lateToday: todayAttendance.filter(att => att.status === 'late').length,
      absentToday: todayAttendance.filter(att => att.status === 'absent').length
    };
  }

  getRecentActivity(): RecentActivity[] {
    const activities: RecentActivity[] = [];
    const attendance = this.getAllAttendance();
    const employees = this.getAllEmployees();
    
    // Add recent attendance activities
    attendance.slice(-10).forEach(record => {
      const employee = this.getEmployeeById(record.employeeId);
      if (employee) {
        if (record.clockOut) {
          activities.push({
            id: `clock_out_${record.id}`,
            type: 'clock_out',
            description: `${employee.firstName} ${employee.lastName} clocked out`,
            timestamp: new Date(`${record.date}T${record.clockOut}`).toISOString(),
            employeeName: `${employee.firstName} ${employee.lastName}`
          });
        }
        activities.push({
          id: `clock_in_${record.id}`,
          type: 'clock_in',
          description: `${employee.firstName} ${employee.lastName} clocked in`,
          timestamp: new Date(`${record.date}T${record.clockIn}`).toISOString(),
          employeeName: `${employee.firstName} ${employee.lastName}`
        });
      }
    });
    
    // Add recent employee additions
    employees.slice(-5).forEach(employee => {
      activities.push({
        id: `employee_${employee.id}`,
        type: 'employee_added',
        description: `${employee.firstName} ${employee.lastName} joined as ${employee.position}`,
        timestamp: new Date(employee.hireDate).toISOString(),
        employeeName: `${employee.firstName} ${employee.lastName}`
      });
    });
    
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  getDepartmentAttendanceStats(): DepartmentAttendanceStats[] {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.getAttendanceByDate(today);
    const employees = this.getAllEmployees();
    const departments = [...new Set(employees.map(emp => emp.department))];
    
    return departments.map(department => {
      const deptEmployees = employees.filter(emp => emp.department === department);
      const deptPresentToday = todayAttendance.filter(att => {
        const employee = this.getEmployeeById(att.employeeId);
        return employee?.department === department && att.status === 'present';
      }).length;
      
      return {
        department,
        totalEmployees: deptEmployees.length,
        presentToday: deptPresentToday,
        attendanceRate: deptEmployees.length > 0 ? Math.round((deptPresentToday / deptEmployees.length) * 100) : 0
      };
    });
  }

  getAttendanceTrend(days: number = 7): AttendanceTrendData[] {
    const dateRange: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dateRange.push(date.toISOString().split('T')[0]);
    }
    
    return dateRange.map(date => {
      const dayAttendance = this.getAttendanceByDate(date);
      const present = dayAttendance.filter(att => att.status === 'present').length;
      const late = dayAttendance.filter(att => att.status === 'late').length;
      const absent = dayAttendance.filter(att => att.status === 'absent').length;
      
      return {
        date,
        present,
        late,
        absent,
        total: present + late + absent
      };
    });
  }
}

export const storage = new InMemoryStorage();
