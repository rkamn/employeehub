import express from 'express';
import cors from 'cors';
import { storage } from './storage.js';
import { CreateEmployeeRequest, UpdateEmployeeRequest, CreateAttendanceRequest } from '../shared/schema.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Employee routes
app.get('/api/employees', (req, res) => {
  try {
    const employees = storage.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/:id', (req, res) => {
  try {
    const employee = storage.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const employeeData: CreateEmployeeRequest = req.body;
    
    // Basic validation
    if (!employeeData.firstName || !employeeData.lastName || !employeeData.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const employee = storage.createEmployee(employeeData);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

app.put('/api/employees/:id', (req, res) => {
  try {
    const updateData: UpdateEmployeeRequest = req.body;
    const employee = storage.updateEmployee(req.params.id, updateData);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  try {
    const success = storage.deleteEmployee(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Attendance routes
app.get('/api/attendance', (req, res) => {
  try {
    const attendance = storage.getAllAttendance();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

app.get('/api/attendance/employee/:employeeId', (req, res) => {
  try {
    const attendance = storage.getAttendanceByEmployeeId(req.params.employeeId);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const attendanceData: CreateAttendanceRequest = req.body;
    
    // Basic validation
    if (!attendanceData.employeeId || !attendanceData.date || !attendanceData.clockIn) {
      return res.status(400).json({ error: 'Missing required fields: employeeId, date, clockIn' });
    }

    // Check if employee exists
    const employee = storage.getEmployeeById(attendanceData.employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Calculate total hours if clockOut is provided
    let totalHours: number | undefined;
    if (attendanceData.clockOut) {
      const clockIn = new Date(`${attendanceData.date}T${attendanceData.clockIn}`);
      const clockOut = new Date(`${attendanceData.date}T${attendanceData.clockOut}`);
      totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
    }

    const record = storage.createAttendanceRecord({
      ...attendanceData,
      totalHours
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

app.put('/api/attendance/:id', (req, res) => {
  try {
    const updateData = req.body;
    const record = storage.updateAttendanceRecord(req.params.id, updateData);
    
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

app.delete('/api/attendance/:id', (req, res) => {
  try {
    const success = storage.deleteAttendanceRecord(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

// Clock in/out endpoints for easy attendance management
app.post('/api/attendance/clock-in', (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Check if employee exists
    const employee = storage.getEmployeeById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

    // Check if already clocked in today
    const existingRecord = storage.getAttendanceByEmployeeId(employeeId)
      .find(record => record.date === today && !record.clockOut);

    if (existingRecord) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }

    const record = storage.createAttendanceRecord({
      employeeId,
      date: today,
      clockIn: currentTime,
      status: 'present'
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to clock in' });
  }
});

app.post('/api/attendance/clock-out', (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

    // Find today's attendance record without clockOut
    const todayRecord = storage.getAttendanceByEmployeeId(employeeId)
      .find(record => record.date === today && !record.clockOut);

    if (!todayRecord) {
      return res.status(400).json({ error: 'No clock-in record found for today' });
    }

    // Calculate total hours
    const clockIn = new Date(`${today}T${todayRecord.clockIn}`);
    const clockOut = new Date(`${today}T${currentTime}`);
    const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

    const updatedRecord = storage.updateAttendanceRecord(todayRecord.id, {
      clockOut: currentTime,
      totalHours
    });
    
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to clock out' });
  }
});

// Dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  try {
    const stats = storage.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Employee Hub API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Employee Hub API ready at http://localhost:${PORT}/api`);
});
