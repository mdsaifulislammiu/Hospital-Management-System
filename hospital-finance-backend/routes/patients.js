const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all patients
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM patients ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.close();
    res.json(rows);
  });
});

// Get patient by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      db.close();
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    db.close();
    res.json(row);
  });
});

// Create new patient
router.post('/', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('admission_date').isISO8601().withMessage('Valid admission date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, admission_date, discharge_date, phone, address } = req.body;
  const db = getDatabase();
  
  db.run('INSERT INTO patients (name, admission_date, discharge_date, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, admission_date, discharge_date || null, phone || null, address || null],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to create patient' });
      }
      
      db.get('SELECT * FROM patients WHERE id = ?', [this.lastID], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve created patient' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// Update patient
router.put('/:id', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('admission_date').isISO8601().withMessage('Valid admission date is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, admission_date, discharge_date, phone, address } = req.body;
  const db = getDatabase();
  
  db.run('UPDATE patients SET name = ?, admission_date = ?, discharge_date = ?, phone = ?, address = ? WHERE id = ?',
    [name, admission_date, discharge_date || null, phone || null, address || null, id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to update patient' });
      }
      
      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      db.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
        db.close();
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated patient' });
        }
        res.json(row);
      });
    }
  );
});

// Delete patient
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.run('DELETE FROM patients WHERE id = ?', [id], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: 'Failed to delete patient' });
    }
    
    if (this.changes === 0) {
      db.close();
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    db.close();
    res.json({ message: 'Patient deleted successfully' });
  });
});

module.exports = router;

