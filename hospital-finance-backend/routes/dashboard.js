const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard summary
router.get('/summary', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const queries = {
    totalPatients: 'SELECT COUNT(*) as count FROM patients',
    activePatients: 'SELECT COUNT(*) as count FROM patients WHERE discharge_date IS NULL',
    totalRevenue: 'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = "payment"',
    totalCharges: 'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = "charge"',
    totalExpenses: 'SELECT COALESCE(SUM(amount), 0) as total FROM expenses',
    totalDepartments: 'SELECT COUNT(*) as count FROM departments',
    totalBudget: 'SELECT COALESCE(SUM(budget), 0) as total FROM departments'
  };
  
  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;
  
  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, row) => {
      if (err) {
        console.error(`Error in ${key} query:`, err);
        results[key] = 0;
      } else {
        results[key] = row.count || row.total || 0;
      }
      
      completed++;
      if (completed === totalQueries) {
        // Calculate net revenue
        results.netRevenue = results.totalRevenue - results.totalCharges;
        results.remainingBudget = results.totalBudget - results.totalExpenses;
        
        db.close();
        res.json(results);
      }
    });
  });
});

// Get recent transactions
router.get('/recent-transactions', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT t.*, p.name as patient_name 
    FROM transactions t 
    LEFT JOIN patients p ON t.patient_id = p.id 
    ORDER BY t.created_at DESC 
    LIMIT 10
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Get recent expenses
router.get('/recent-expenses', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT e.*, d.name as department_name 
    FROM expenses e 
    LEFT JOIN departments d ON e.department_id = d.id 
    ORDER BY e.created_at DESC 
    LIMIT 10
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Get department budget utilization
router.get('/department-budgets', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT 
      d.id,
      d.name,
      d.budget,
      COALESCE(SUM(e.amount), 0) as spent,
      (d.budget - COALESCE(SUM(e.amount), 0)) as remaining,
      ROUND((COALESCE(SUM(e.amount), 0) / d.budget * 100), 2) as utilization_percentage
    FROM departments d
    LEFT JOIN expenses e ON d.id = e.department_id
    GROUP BY d.id, d.name, d.budget
    ORDER BY utilization_percentage DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Get monthly revenue trend
router.get('/monthly-revenue', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT 
      strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END) as revenue,
      SUM(CASE WHEN type = 'charge' THEN amount ELSE 0 END) as charges
    FROM transactions 
    WHERE date >= date('now', '-12 months')
    GROUP BY strftime('%Y-%m', date)
    ORDER BY month
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Get monthly expenses trend
router.get('/monthly-expenses', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT 
      strftime('%Y-%m', date) as month,
      SUM(amount) as expenses
    FROM expenses 
    WHERE date >= date('now', '-12 months')
    GROUP BY strftime('%Y-%m', date)
    ORDER BY month
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

module.exports = router;

