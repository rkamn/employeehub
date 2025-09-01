import { useState } from 'react';
import { Employee } from '../../../shared/schema';

interface ClockInOutProps {
  employees: Employee[];
  onClockIn: (employeeId: string) => void;
  onClockOut: (employeeId: string) => void;
  loading?: boolean;
}

export function ClockInOut({ employees, onClockIn, onClockOut, loading }: ClockInOutProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const handleClockIn = () => {
    if (selectedEmployeeId) {
      onClockIn(selectedEmployeeId);
    }
  };

  const handleClockOut = () => {
    if (selectedEmployeeId) {
      onClockOut(selectedEmployeeId);
    }
  };

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Quick Clock In/Out</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Employee</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Choose an employee...</option>
            {employees.filter(emp => emp.status === 'active').map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} - {employee.position}
              </option>
            ))}
          </select>
        </div>

        {selectedEmployee && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Selected:</span> {selectedEmployee.firstName} {selectedEmployee.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Department:</span> {selectedEmployee.department}
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleClockIn}
            disabled={!selectedEmployeeId || loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : '🕘 Clock In'}
          </button>
          
          <button
            onClick={handleClockOut}
            disabled={!selectedEmployeeId || loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : '🕐 Clock Out'}
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Current time: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
