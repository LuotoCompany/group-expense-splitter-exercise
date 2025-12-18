export interface Person {
  id: number;
  name: string;
  createdAt?: Date;
}

export interface Split {
  personId: number;
  amount: number;
}

export interface Expense {
  id: number;
  description: string;
  totalAmount: number;
  paidBy: number;
  splits: Split[];
  date: Date;
  receiptImage?: string;
}

export interface Settlement {
  id: number;
  from: number;
  to: number;
  amount: number;
  date: Date;
  createdAt?: Date;
}

export interface Balance {
  fromId: number;
  toId: number;
  amount: number;
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SettlementActionResult {
  success: boolean;
  settlement?: Settlement;
  error?: string;
}

export interface DeleteSettlementResult {
  success: boolean;
  error?: string;
}

export interface AddSettlementInput {
  fromPersonId: string | number;
  toPersonId: string | number;
  amount: number;
  date?: string | Date;
}

export interface AddExpensePayload {
  description: string;
  totalAmount: number;
  paidBy: number;
  splits: Array<{ personId: number; amount: number }>;
  date?: Date;
}
