# Hospital Financial Management System

A comprehensive web application for managing hospital financial operations, built with React.js frontend and Express.js backend with SQLite database.

## 🚀 Live Demo

The application is deployed and accessible at:
**https://5000-i1rh22m649j6k2lk9abfr-ca019609.manus.computer**

### Demo Credentials
- **Username:** admin
- **Password:** admin123

## 📋 Features

### Core Functionality
- **User Authentication** - Secure login/registration with JWT tokens
- **Dashboard** - Real-time financial overview with charts and analytics
- **Patient Management** - Full CRUD operations for patient records
- **Transaction Management** - Track payments and charges
- **Department Management** - Budget allocation and tracking
- **Expense Management** - Department-wise expense tracking

### Technical Features
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Data** - Live updates and synchronization
- **Role-based Access** - Admin and user roles with different permissions
- **Data Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error management
- **Security** - Password hashing, JWT authentication, CORS protection

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Recharts** - Data visualization
- **Lucide Icons** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
hospital-finance-system/
├── hospital-finance-app/          # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── contexts/              # React contexts
│   │   ├── services/              # API services
│   │   └── utils/                 # Utility functions
│   ├── public/                    # Static assets
│   └── package.json               # Frontend dependencies
│
├── hospital-finance-backend/      # Express Backend
│   ├── routes/                    # API routes
│   ├── database/                  # Database setup
│   ├── middleware/                # Custom middleware
│   ├── public/                    # Built frontend files
│   └── package.json               # Backend dependencies
│
└── README.md                      # This file
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd hospital-finance-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd hospital-finance-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```
   The frontend will run on http://localhost:5173

### Database
The SQLite database is automatically created and initialized with sample data when the backend starts for the first time.

## 📊 Database Schema

### Users Table
- id (PRIMARY KEY)
- username (UNIQUE)
- password (hashed)
- role (admin/user)
- created_at

### Patients Table
- id (PRIMARY KEY)
- name
- admission_date
- discharge_date
- phone
- address
- created_at

### Departments Table
- id (PRIMARY KEY)
- name
- budget
- created_at

### Transactions Table
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY)
- amount
- type (payment/charge)
- description
- date
- created_at

### Expenses Table
- id (PRIMARY KEY)
- department_id (FOREIGN KEY)
- amount
- description
- date
- created_at

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard
- `GET /api/dashboard/summary` - Financial summary
- `GET /api/dashboard/recent-transactions` - Recent transactions
- `GET /api/dashboard/recent-expenses` - Recent expenses
- `GET /api/dashboard/department-budgets` - Department budget overview

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Stateless authentication
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation with express-validator
- **Role-based Access** - Admin and user role permissions

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI/UX Features

- **Modern Design** - Clean and professional interface
- **Dark/Light Mode** - Automatic theme detection
- **Interactive Charts** - Real-time data visualization
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation feedback

## 📈 Key Metrics Dashboard

The dashboard provides insights into:
- Total patients and active admissions
- Revenue vs expenses analysis
- Department budget utilization
- Monthly financial trends
- Recent transaction activity

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Frontend Configuration
The frontend automatically connects to the backend API. For production deployment, update the API base URL in the frontend configuration.

## 📝 License

This project is developed as part of the CSE 414 - Internet and Web Programming course.

## 👥 Support

For any questions or issues, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for efficient hospital financial management**

