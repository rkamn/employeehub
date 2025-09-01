import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, AttendanceRecord, CreateAttendanceRequest } from '../../../shared/schema';

const API_BASE = '/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Employee operations
  async getAllEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/employees');
  }

  async getEmployeeById(id: string): Promise<Employee> {
    return this.request<Employee>(`/employees/${id}`);
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    return this.request<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    return this.request<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.request<void>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance operations
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    return this.request<AttendanceRecord[]>('/attendance');
  }

  async getAttendanceByEmployeeId(employeeId: string): Promise<AttendanceRecord[]> {
    return this.request<AttendanceRecord[]>(`/attendance/employee/${employeeId}`);
  }

  async createAttendanceRecord(data: CreateAttendanceRequest): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAttendanceRecord(id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAttendanceRecord(id: string): Promise<void> {
    return this.request<void>(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // Clock in/out operations
  async clockIn(employeeId: string): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/clock-in', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    });
  }

  async clockOut(employeeId: string): Promise<AttendanceRecord> {
    return this.request<AttendanceRecord>('/attendance/clock-out', {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    });
  }
}

export const apiService = new ApiService();
