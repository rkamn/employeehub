import { useState, useEffect } from 'react';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../../shared/schema';
import { EmployeeCard } from './components/EmployeeCard';
import { EmployeeForm } from './components/EmployeeForm';
import { apiService } from './lib/api';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

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
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Employee
            </button>
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
          {employees.length === 0 ? (
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
      </div>
    </div>
  );
}

export default App;
