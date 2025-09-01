import { AttendanceTrendData } from '../../../shared/schema';
import { formatDate } from '../lib/utils';

interface AttendanceTrendProps {
  data: AttendanceTrendData[];
}

export function AttendanceTrend({ data }: AttendanceTrendProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Attendance Trend (7 Days)</h3>
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">📈</span>
          <p>No trend data available</p>
        </div>
      </div>
    );
  }

  const maxTotal = Math.max(...data.map(d => d.total), 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Attendance Trend (7 Days)</h3>
      
      {/* Chart */}
      <div className="space-y-4">
        {data.map((day, index) => (
          <div key={day.date} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">
                {index === data.length - 1 ? 'Today' : formatDate(day.date).split(',')[0]}
              </span>
              <span className="text-gray-600">{day.total} total</span>
            </div>
            
            <div className="relative">
              <div className="bg-gray-200 rounded-full h-6 flex overflow-hidden">
                {day.total > 0 && (
                  <>
                    {day.present > 0 && (
                      <div
                        className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(day.present / day.total) * 100}%` }}
                        title={`Present: ${day.present}`}
                      >
                        {day.present > 0 && day.present}
                      </div>
                    )}
                    {day.late > 0 && (
                      <div
                        className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(day.late / day.total) * 100}%` }}
                        title={`Late: ${day.late}`}
                      >
                        {day.late > 0 && day.late}
                      </div>
                    )}
                    {day.absent > 0 && (
                      <div
                        className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(day.absent / day.total) * 100}%` }}
                        title={`Absent: ${day.absent}`}
                      >
                        {day.absent > 0 && day.absent}
                      </div>
                    )}
                  </>
                )}
                {day.total === 0 && (
                  <div className="w-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                    No data
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
