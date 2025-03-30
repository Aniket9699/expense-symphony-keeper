
export type CategoryType = {
  id: string;
  name: string;
  color: string;
};

export type ExpenseType = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
};

export type MonthlyTotalType = {
  month: string;
  amount: number;
};
