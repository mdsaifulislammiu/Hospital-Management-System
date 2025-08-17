const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all transactions
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  const query = `
    SELECT t.*, p.name as patient_name 
    FROM transactions t 
    LEFT JOIN patients p ON t.patient_id = p.id 
    ORDER BY t.date DESC, t.created_at DESC
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

// Get transaction by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  const query = `
    SELECT t.*, p.name as patient_name 
    FROM transactions t 
    LEFT JOIN patients p ON t.patient_id = p.id 
    WHERE t.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      db.close();
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    db.close();
    res.json(row);
  });
});

// Get transactions by patient ID
router.get('/patient/:patientId', authenticateToken, (req, res) => {
  const { patientId } = req.params;
  const db = getDatabase();
  
  db.all('SELECT * FROM transactions WHERE patient_id = ? ORDER BY date DESC', [patientId], (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Create new transaction
router.post('/', authenticateToken, [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['payment', 'charge']).withMessage('Type must be payment or charge'),
  body('date').isISO8601().withMessage('Valid date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { patient_id, amount, type, description, date } = req.body;
  const db = getDatabase();
  
  db.run('INSERT INTO transactions (patient_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?)',
    [patient_id || null, amount, type, description || null, date],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to create transaction' });
      }
      
      const query = `
        SELECT t.*, p.name as patient_name 
        FROM transactions t 
        LEFT JOIN patients p ON t.patient_id = p.id 
        WHERE t.id = ?
      `;
      
      db.get(query, [this.lastID], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve created transaction' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// Update transaction
router.put('/:id', authenticateToken, [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['payment', 'charge']).withMessage('Type must be payment or charge'),
  body('date').isISO8601().withMessage('Valid date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { patient_id, amount, type, description, date } = req.body;
  const db = getDatabase();
  
  db.run('UPDATE transactions SET patient_id = ?, amount = ?, type = ?, description = ?, date = ? WHERE id = ?',
    [patient_id || null, amount, type, description || null, date, id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to update transaction' });
      }
      
      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      const query = `
        SELECT t.*, p.name as patient_name 
        FROM transactions t 
        LEFT JOIN patients p ON t.patient_id = p.id 
        WHERE t.id = ?
      `;
      
      db.get(query, [id], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated transaction' });
        }
        res.json(row);
      });
    }
  );
});

// Delete transaction
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }
    
    if (this.changes === 0) {
      db.close();
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    db.close();
    res.json({ message: 'Transaction deleted successfully' });
  });
});

module.exports = router;

