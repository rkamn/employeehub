import { useState, useEffect } from 'react';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, AttendanceRecord, CreateAttendanceRequest, DashboardStats } from '../../shared/schema';
import { EmployeeCard } from './components/EmployeeCard';
import { EmployeeForm } from './components/EmployeeForm';
import { AttendanceCard } from './components/AttendanceCard';
import { AttendanceForm } from './components/AttendanceForm';
import { ClockInOut } from './components/ClockInOut';
import { StatsCard } from './components/StatsCard';
import { DepartmentCard } from './components/DepartmentCard';
import { RecentActivity } from './components/RecentActivity';
import { AttendanceTrend } from './components/AttendanceTrend';
import { apiService } from './lib/api';

type ViewMode = 'dashboard' | 'employees' | 'attendance';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingAttendance, setEditingAttendance] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    loadEmployees();
    if (viewMode === 'attendance') {
      loadAttendance();
    } else if (viewMode === 'dashboard') {
      loadDashboardStats();
    }
  }, [viewMode]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (data: CreateEmployeeRequest) => {
    try {
      const newEmployee = await apiService.createEmployee(data);
      setEmployees(prev => [...prev, newEmployee]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create employee');
      console.error('Error creating employee:', err);
    }
  };

  const handleUpdateEmployee = async (data: CreateEmployeeRequest) => {
    if (!editingEmployee) return;
    
    try {
      const updatedEmployee = await apiService.updateEmployee(editingEmployee.id, data);
      setEmployees(prev => 
        prev.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp)
      );
      setEditingEmployee(null);
      setError(null);
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error updating employee:', err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await apiService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete employee');
      console.error('Error deleting employee:', err);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  // Attendance functions
  const loadAttendance = async () => {
    try {
      const data = await apiService.getAllAttendance();
      setAttendance(data);
      setError(null);
    } catch (err) {
      setError('Failed to load attendance records');
      console.error('Error loading attendance:', err);
    }
  };

  const handleClockIn = async (employeeId: string) => {
    try {
      setClockLoading(true);
      const record = await apiService.clockIn(employeeId);
      setAttendance(prev => [...prev, record]);
      setError(null);
    } catch (err) {
      setError('Failed to clock in');
      console.error('Error clocking in:', err);
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      setClockLoading(true);
      const record = await apiService.clockOut(employeeId);
      setAttendance(prev => 
        prev.map(att => att.id === record.id ? record : att)
      );
      setError(null);
    } catch (err) {
      setError('Failed to clock out');
      console.error('Error clocking out:', err);
    } finally {
      setClockLoading(false);
    }
  };

  const handleCreateAttendance = async (data: CreateAttendanceRequest) => {
    try {
      const record = await apiService.createAttendanceRecord(data);
      setAttendance(prev => [...prev, record]);
      setShowAttendanceForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create attendance record');
      console.error('Error creating attendance:', err);
    }
  };

  const handleUpdateAttendance = async (data: CreateAttendanceRequest) => {
    if (!editingAttendance) return;
    
    try {
      const record = await apiService.updateAttendanceRecord(editingAttendance.id, data);
      setAttendance(prev => 
        prev.map(att => att.id === editingAttendance.id ? record : att)
      );
      setEditingAttendance(null);
      setError(null);
    } catch (err) {
      setError('Failed to update attendance record');
      console.error('Error updating attendance:', err);
    }
  };

  const handleDeleteAttendance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    
    try {
      await apiService.deleteAttendanceRecord(id);
      setAttendance(prev => prev.filter(att => att.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete attendance record');
      console.error('Error deleting attendance:', err);
    }
  };

  const handleEditAttendance = (record: AttendanceRecord) => {
    setEditingAttendance(record);
  };

  const handleCloseAttendanceForm = () => {
    setShowAttendanceForm(false);
    setEditingAttendance(null);
  };

  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  // Dashboard functions
  const loadDashboardStats = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setDashboardStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error loading dashboard:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Hub</h1>
              <p className="text-gray-600 mt-2">Manage your team effectively</p>
            </div>
            <div className="flex space-x-3">
              {viewMode === 'attendance' && (
                <button
                  onClick={() => setShowAttendanceForm(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Add Record
                </button>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Employee
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setViewMode('employees')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'employees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Employees
              </button>
              <button
                onClick={() => setViewMode('attendance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  viewMode === 'attendance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Attendance
              </button>
            </nav>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{employees.length}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {employees.filter(emp => emp.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {new Set(employees.map(emp => emp.department)).size}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
            </div>
          </div>
        </div>

        <main>
          {viewMode === 'dashboard' ? (
            // Dashboard View
            dashboardStats ? (
              <div className="space-y-6">
                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total Employees"
                    value={dashboardStats.employees.totalEmployees}
                    icon="👥"
                    color="blue"
                  />
                  <StatsCard
                    title="Present Today"
                    value={dashboardStats.attendance.presentToday}
                    icon="✅"
                    color="green"
                  />
                  <StatsCard
                    title="Late Today"
                    value={dashboardStats.attendance.lateToday}
                    icon="⚠️"
                    color="yellow"
                  />
                  <StatsCard
                    title="Total Records"
                    value={dashboardStats.attendance.totalRecords}
                    icon="📋"
                    color="gray"
                  />
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AttendanceTrend data={dashboardStats.attendanceTrend} />
                  <RecentActivity activities={dashboardStats.recentActivity} />
                </div>

                {/* Department Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Department Attendance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardStats.departmentAttendance.map(dept => (
                      <DepartmentCard key={dept.department} department={dept} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Loading Dashboard...</h3>
                <p className="text-gray-600">Gathering analytics and statistics</p>
              </div>
            )
          ) : viewMode === 'employees' ? (
            // Employee View
            employees.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No employees yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first employee</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Employee
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(employee => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                  />
                ))}
              </div>
            )
          ) : (
            // Attendance View
            <div className="space-y-6">
              {/* Clock In/Out Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ClockInOut
                    employees={employees}
                    onClockIn={handleClockIn}
                    onClockOut={handleClockOut}
                    loading={clockLoading}
                  />
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Today's Attendance Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {attendance.filter(att => att.date === new Date().toISOString().split('T')[0] && att.status === 'present').length}
                        </div>
                        <div className="text-sm text-gray-600">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {attendance.filter(att => att.date === new Date().toISOString().split('T')[0] && att.status === 'late').length}
                        </div>
                        <div className="text-sm text-gray-600">Late</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {attendance.filter(att => att.date === new Date().toISOString().split('T')[0] && att.status === 'absent').length}
                        </div>
                        <div className="text-sm text-gray-600">Absent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Records */}
              {attendance.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No attendance records yet</h3>
                  <p className="text-gray-600 mb-4">Start tracking attendance by clocking in employees or adding records manually</p>
                  <button
                    onClick={() => setShowAttendanceForm(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add First Record
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Attendance Records</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attendance
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(record => {
                        const employee = getEmployeeById(record.employeeId);
                        return employee ? (
                          <AttendanceCard
                            key={record.id}
                            record={record}
                            employee={employee}
                            onEdit={handleEditAttendance}
                            onDelete={handleDeleteAttendance}
                          />
                        ) : null;
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {(showForm || editingEmployee) && (
          <EmployeeForm
            employee={editingEmployee || undefined}
            onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
            onCancel={handleCloseForm}
            isEdit={!!editingEmployee}
          />
        )}
        
        {(showAttendanceForm || editingAttendance) && (
          <AttendanceForm
            record={editingAttendance || undefined}
            employees={employees}
            onSubmit={editingAttendance ? handleUpdateAttendance : handleCreateAttendance}
            onCancel={handleCloseAttendanceForm}
            isEdit={!!editingAttendance}
          />
        )}
      </div>
    </div>
  );
}

export default App;
