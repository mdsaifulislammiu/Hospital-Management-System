const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'hospital.db');

const initializeDatabase = () => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });

  // Create tables
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Departments table
    db.run(`CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      budget REAL NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Patients table
    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      admission_date DATE,
      discharge_date DATE,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Transactions table
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id)
    )`);

    // Expenses table
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id INTEGER,
      amount REAL NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments (id)
    )`);

    // Insert default admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
      ['admin', hashedPassword, 'admin']);

    // Insert sample departments
    const departments = [
      ['Emergency', 50000],
      ['Cardiology', 75000],
      ['Pediatrics', 40000],
      ['Surgery', 100000],
      ['Radiology', 60000]
    ];

    departments.forEach(dept => {
      db.run(`INSERT OR IGNORE INTO departments (name, budget) VALUES (?, ?)`, dept);
    });

    // Insert sample patients
    const patients = [
      ['John Doe', '2024-01-15', '2024-01-20', '555-0101', '123 Main St'],
      ['Jane Smith', '2024-01-18', null, '555-0102', '456 Oak Ave'],
      ['Bob Johnson', '2024-01-20', '2024-01-25', '555-0103', '789 Pine Rd']
    ];

    patients.forEach(patient => {
      db.run(`INSERT OR IGNORE INTO patients (name, admission_date, discharge_date, phone, address) VALUES (?, ?, ?, ?, ?)`, patient);
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database initialized successfully');
    }
  });
};

const getDatabase = () => {
  return new sqlite3.Database(dbPath);
};

module.exports = { initializeDatabase, getDatabase };

