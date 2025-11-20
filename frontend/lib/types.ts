export interface Person {
  id: string;
  name: string;
  createdAt?: Date;
}

export interface Split {
  personId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string;
  splits: Split[];
  date: Date;
  receiptImage?: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: Date;
  createdAt?: Date;
}

export interface Balance {
  fromId: string;
  toId: string;
  amount: number;
}
