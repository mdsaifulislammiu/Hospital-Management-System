import { authService } from './authService';

class ApiService {
  constructor() {
    this.api = authService.api;
  }

  // Dashboard endpoints
  async getDashboardSummary() {
    const response = await this.api.get('/dashboard/summary');
    return response.data;
  }

  async getRecentTransactions() {
    const response = await this.api.get('/dashboard/recent-transactions');
    return response.data;
  }

  async getRecentExpenses() {
    const response = await this.api.get('/dashboard/recent-expenses');
    return response.data;
  }

  async getDepartmentBudgets() {
    const response = await this.api.get('/dashboard/department-budgets');
    return response.data;
  }

  async getMonthlyRevenue() {
    const response = await this.api.get('/dashboard/monthly-revenue');
    return response.data;
  }

  async getMonthlyExpenses() {
    const response = await this.api.get('/dashboard/monthly-expenses');
    return response.data;
  }

  // Patients endpoints
  async getPatients() {
    const response = await this.api.get('/patients');
    return response.data;
  }

  async getPatient(id) {
    const response = await this.api.get(`/patients/${id}`);
    return response.data;
  }

  async createPatient(patientData) {
    const response = await this.api.post('/patients', patientData);
    return response.data;
  }

  async updatePatient(id, patientData) {
    const response = await this.api.put(`/patients/${id}`, patientData);
    return response.data;
  }

  async deletePatient(id) {
    const response = await this.api.delete(`/patients/${id}`);
    return response.data;
  }

  // Transactions endpoints
  async getTransactions() {
    const response = await this.api.get('/transactions');
    return response.data;
  }

  async getTransaction(id) {
    const response = await this.api.get(`/transactions/${id}`);
    return response.data;
  }

  async getPatientTransactions(patientId) {
    const response = await this.api.get(`/transactions/patient/${patientId}`);
    return response.data;
  }

  async createTransaction(transactionData) {
    const response = await this.api.post('/transactions', transactionData);
    return response.data;
  }

  async updateTransaction(id, transactionData) {
    const response = await this.api.put(`/transactions/${id}`, transactionData);
    return response.data;
  }

  async deleteTransaction(id) {
    const response = await this.api.delete(`/transactions/${id}`);
    return response.data;
  }

  // Departments endpoints
  async getDepartments() {
    const response = await this.api.get('/departments');
    return response.data;
  }

  async getDepartment(id) {
    const response = await this.api.get(`/departments/${id}`);
    return response.data;
  }

  async getDepartmentSummary(id) {
    const response = await this.api.get(`/departments/${id}/summary`);
    return response.data;
  }

  async createDepartment(departmentData) {
    const response = await this.api.post('/departments', departmentData);
    return response.data;
  }

  async updateDepartment(id, departmentData) {
    const response = await this.api.put(`/departments/${id}`, departmentData);
    return response.data;
  }

  async deleteDepartment(id) {
    const response = await this.api.delete(`/departments/${id}`);
    return response.data;
  }

  // Expenses endpoints
  async getExpenses() {
    const response = await this.api.get('/expenses');
    return response.data;
  }

  async getExpense(id) {
    const response = await this.api.get(`/expenses/${id}`);
    return response.data;
  }

  async getDepartmentExpenses(departmentId) {
    const response = await this.api.get(`/expenses/department/${departmentId}`);
    return response.data;
  }

  async createExpense(expenseData) {
    const response = await this.api.post('/expenses', expenseData);
    return response.data;
  }

  async updateExpense(id, expenseData) {
    const response = await this.api.put(`/expenses/${id}`, expenseData);
    return response.data;
  }

  async deleteExpense(id) {
    const response = await this.api.delete(`/expenses/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();

