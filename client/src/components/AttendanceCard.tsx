import { AttendanceRecord, Employee } from '../../../shared/schema';
import { formatTime, formatHours, getAttendanceStatusColor, formatDate } from '../lib/utils';

interface AttendanceCardProps {
  record: AttendanceRecord;
  employee: Employee;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (id: string) => void;
}

export function AttendanceCard({ record, employee, onEdit, onDelete }: AttendanceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-gray-600">{employee.position}</p>
          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}
        >
          {record.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Clock In:</span>
          <span className="font-medium">{formatTime(record.clockIn)}</span>
        </div>
        
        {record.clockOut && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Clock Out:</span>
            <span className="font-medium">{formatTime(record.clockOut)}</span>
          </div>
        )}
        
        {record.totalHours && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Hours:</span>
            <span className="font-medium">{formatHours(record.totalHours)}</span>
          </div>
        )}
        
        {!record.clockOut && (
          <div className="text-sm text-blue-600 font-medium">
            Currently working...
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(record)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(record.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
