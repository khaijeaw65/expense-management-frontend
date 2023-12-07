export interface Expense {
  id: number,
  userId: number,
  userFullName: string,
  typeId: number,
  type: string,
  amount: number,
  detail: string,
  date: string,
};

export interface MonthlySummary {
  date: string,
  income: number,
  expense: number,
}

export interface YearlySummary {
  year: string;
  summary: {
    month: string,
    income: number,
    expense: number,
  }[]
}