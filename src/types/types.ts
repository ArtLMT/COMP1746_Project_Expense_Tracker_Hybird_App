export interface SyncMetadata {
  isDeleted: boolean;
  updated_at: number;
}

export interface Project extends SyncMetadata {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  manager: string;
  status: 'Active' | 'Completed' | 'On Hold';
  budget: number;
}

export interface Expense extends SyncMetadata {
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

