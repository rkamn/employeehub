import { Employee } from '../../../shared/schema';
import { formatCurrency, formatDate } from '../lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-gray-600">{employee.position}</p>
          <p className="text-sm text-gray-500">{employee.department}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            employee.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {employee.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <span className="font-medium">Email:</span> {employee.email}
        </p>
        {employee.phone && (
          <p className="text-sm">
            <span className="font-medium">Phone:</span> {employee.phone}
          </p>
        )}
        <p className="text-sm">
          <span className="font-medium">Salary:</span> {formatCurrency(employee.salary)}
        </p>
        <p className="text-sm">
          <span className="font-medium">Hire Date:</span> {formatDate(employee.hireDate)}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(employee)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
