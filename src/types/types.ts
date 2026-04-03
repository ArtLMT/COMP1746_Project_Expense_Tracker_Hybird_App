/**
 * Firestore data model interfaces.
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  manager: string;
  status: 'Active' | 'Completed' | 'On Hold';
  budget: number;
}

export interface Expense {
  id: string;
  projectId: string;
  date: string;
  amount: number;
  currency: string;
  type: string;
  paymentMethod: string;
  claimant: string;
  status: 'Paid' | 'Pending' | 'Reimbursed';
}
