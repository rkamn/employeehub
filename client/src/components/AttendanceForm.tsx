import { useState, useEffect } from 'react';
import { AttendanceRecord, CreateAttendanceRequest, Employee } from '../../../shared/schema';
import { getCurrentDate, getCurrentTime } from '../lib/utils';

interface AttendanceFormProps {
  record?: AttendanceRecord;
  employees: Employee[];
  onSubmit: (data: CreateAttendanceRequest) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function AttendanceForm({ record, employees, onSubmit, onCancel, isEdit = false }: AttendanceFormProps) {
  const [formData, setFormData] = useState<CreateAttendanceRequest>({
    employeeId: '',
    date: getCurrentDate(),
    clockIn: getCurrentTime(),
    status: 'present',
  });

  useEffect(() => {
    if (record) {
      setFormData({
        employeeId: record.employeeId,
        date: record.date,
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        status: record.status,
      });
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {isEdit ? 'Edit Attendance Record' : 'Add Attendance Record'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Clock In</label>
                <input
                  type="time"
                  name="clockIn"
                  value={formData.clockIn}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clock Out (Optional)</label>
                <input
                  type="time"
                  name="clockOut"
                  value={formData.clockOut || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEdit ? 'Update' : 'Create'} Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
