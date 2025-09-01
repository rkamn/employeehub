import { Employee, AttendanceRecord, CreateEmployeeRequest, UpdateEmployeeRequest } from '../shared/schema.js';

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
}

export const storage = new InMemoryStorage();
