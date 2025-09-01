import express from 'express';
import cors from 'cors';
import { storage } from './storage.js';
import { CreateEmployeeRequest, UpdateEmployeeRequest } from '../shared/schema.js';

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Employee Hub API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Employee Hub API ready at http://localhost:${PORT}/api`);
});
