const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all expenses
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT e.*, d.name as department_name 
    FROM expenses e 
    LEFT JOIN departments d ON e.department_id = d.id 
    ORDER BY e.date DESC, e.created_at DESC
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

// Get expense by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  const query = `
    SELECT e.*, d.name as department_name 
    FROM expenses e 
    LEFT JOIN departments d ON e.department_id = d.id 
    WHERE e.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      db.close();
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    db.close();
    res.json(row);
  });
});

// Get expenses by department ID
router.get('/department/:departmentId', authenticateToken, (req, res) => {
  const { departmentId } = req.params;
  const db = getDatabase();
  
  db.all('SELECT * FROM expenses WHERE department_id = ? ORDER BY date DESC', [departmentId], (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Create new expense
router.post('/', authenticateToken, [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('date').isISO8601().withMessage('Valid date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { department_id, amount, description, date } = req.body;
  const db = getDatabase();
  
  db.run('INSERT INTO expenses (department_id, amount, description, date) VALUES (?, ?, ?, ?)',
    [department_id || null, amount, description || null, date],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to create expense' });
      }
      
      const query = `
        SELECT e.*, d.name as department_name 
        FROM expenses e 
        LEFT JOIN departments d ON e.department_id = d.id 
        WHERE e.id = ?
      `;
      
      db.get(query, [this.lastID], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve created expense' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// Update expense
router.put('/:id', authenticateToken, [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('date').isISO8601().withMessage('Valid date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { department_id, amount, description, date } = req.body;
  const db = getDatabase();
  
  db.run('UPDATE expenses SET department_id = ?, amount = ?, description = ?, date = ? WHERE id = ?',
    [department_id || null, amount, description || null, date, id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to update expense' });
      }
      
      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      const query = `
        SELECT e.*, d.name as department_name 
        FROM expenses e 
        LEFT JOIN departments d ON e.department_id = d.id 
        WHERE e.id = ?
      `;
      
      db.get(query, [id], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated expense' });
        }
        res.json(row);
      });
    }
  );
});

// Delete expense
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.run('DELETE FROM expenses WHERE id = ?', [id], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Failed to delete expense' });
    }
    
    if (this.changes === 0) {
      db.close();
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    db.close();
    res.json({ message: 'Expense deleted successfully' });
  });
});

module.exports = router;

