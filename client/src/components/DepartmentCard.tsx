import { DepartmentAttendanceStats } from '../../../shared/schema';
import { getDepartmentIcon, formatPercentage } from '../lib/utils';

interface DepartmentCardProps {
  department: DepartmentAttendanceStats;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceBg = (rate: number) => {
    if (rate >= 90) return 'bg-green-100';
    if (rate >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getDepartmentIcon(department.department)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{department.department}</h3>
            <p className="text-sm text-gray-600">{department.totalEmployees} employees</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceBg(department.attendanceRate)} ${getAttendanceColor(department.attendanceRate)}`}>
          {formatPercentage(department.attendanceRate)}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Present Today:</span>
        <span className="font-medium text-gray-900">
          {department.presentToday} / {department.totalEmployees}
        </span>
      </div>
      
      <div className="mt-3">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              department.attendanceRate >= 90
                ? 'bg-green-500'
                : department.attendanceRate >= 70
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${department.attendanceRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
