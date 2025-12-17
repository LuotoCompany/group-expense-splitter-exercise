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
