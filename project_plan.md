# Hospital Financial Management System - Project Plan

## Project Overview
A comprehensive web application for managing hospital financial operations with real-time tracking, patient billing, and department budgeting.

## Technology Stack
- **Frontend**: React.js with Bootstrap for responsive UI
- **Backend**: Express.js with Node.js
- **Database**: SQLite
- **Authentication**: JWT-based authentication with bcrypt password hashing

## Database Schema

### Users Table
- id (PRIMARY KEY)
- username (UNIQUE)
- password (hashed with bcrypt)
- role (admin/user)

### Departments Table
- id (PRIMARY KEY)
- name
- budget

### Patients Table
- id (PRIMARY KEY)
- name
- admission_date
- discharge_date

### Transactions Table
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY)
- amount
- type (payment/charge)
- date

### Expenses Table
- id (PRIMARY KEY)
- department_id (FOREIGN KEY)
- amount
- date
- description

## Application Pages

1. **Login & Registration** - Secure authentication
2. **Dashboard** - Admin/User specific views with financial overview
3. **Patient Profile** - Detailed patient information and billing
4. **Add/Edit Transaction** - Financial transaction management
5. **Department Budget** - Budget allocation and tracking
6. **Expense Summary** - Reports and analytics

## Key Features
- Full CRUD operations for all entities
- Role-based access control
- Real-time financial tracking
- Responsive design with Bootstrap
- Dynamic routing
- Secure authentication with JWT
- Data validation and error handling

## Project Structure
```
hospital-finance-app/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── database/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── public/
```

