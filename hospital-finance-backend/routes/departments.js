const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all departments
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM departments ORDER BY name', (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Get department by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.get('SELECT * FROM departments WHERE id = ?', [id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      db.close();
      return res.status(404).json({ error: 'Department not found' });
    }
    
    db.close();
    res.json(row);
  });
});

// Get department with expenses summary
router.get('/:id/summary', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  const query = `
    SELECT 
      d.*,
      COALESCE(SUM(e.amount), 0) as total_expenses,
      (d.budget - COALESCE(SUM(e.amount), 0)) as remaining_budget
    FROM departments d
    LEFT JOIN expenses e ON d.id = e.department_id
    WHERE d.id = ?
    GROUP BY d.id
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      db.close();
      return res.status(404).json({ error: 'Department not found' });
    }
    
    db.close();
    res.json(row);
  });
});

// Create new department
router.post('/', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, budget } = req.body;
  const db = getDatabase();
  
  db.run('INSERT INTO departments (name, budget) VALUES (?, ?)',
    [name, budget],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to create department' });
      }
      
      db.get('SELECT * FROM departments WHERE id = ?', [this.lastID], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve created department' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// Update department
router.put('/:id', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, budget } = req.body;
  const db = getDatabase();
  
  db.run('UPDATE departments SET name = ?, budget = ? WHERE id = ?',
    [name, budget, id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to update department' });
      }
      
      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Department not found' });
      }
      
      db.get('SELECT * FROM departments WHERE id = ?', [id], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated department' });
        }
        res.json(row);
      });
    }
  );
});

// Delete department
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.run('DELETE FROM departments WHERE id = ?', [id], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Failed to delete department' });
    }
    
    if (this.changes === 0) {
      db.close();
      return res.status(404).json({ error: 'Department not found' });
    }
    
    db.close();
    res.json({ message: 'Department deleted successfully' });
  });
});

module.exports = router;

