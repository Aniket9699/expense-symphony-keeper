
import React, { createContext, useContext, useEffect, useState } from "react";
import { ExpenseType, CategoryType, MonthlyTotalType } from "@/types/expense";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface ExpenseContextType {
  expenses: ExpenseType[];
  categories: CategoryType[];
  addExpense: (expense: Omit<ExpenseType, "id">) => void;
  updateExpense: (id: string, expense: Partial<ExpenseType>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<CategoryType, "id">) => void;
  updateCategory: (id: string, category: Partial<CategoryType>) => void;
  deleteCategory: (id: string) => void;
  getExpensesByCategory: (categoryId: string) => ExpenseType[];
  getExpensesByMonth: (month: string) => ExpenseType[];
  getTotalByMonth: (month: string) => number;
  getMonthlyTotals: () => MonthlyTotalType[];
  getMonthlyTotalsByCategory: (categoryId: string) => MonthlyTotalType[];
  searchExpenses: (query: string) => ExpenseType[];
  getCategoryById: (id: string) => CategoryType | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Default categories
const defaultCategories: CategoryType[] = [
  { id: "1", name: "Food", color: "#FF5733" },
  { id: "2", name: "Transportation", color: "#33FF57" },
  { id: "3", name: "Shopping", color: "#3357FF" },
  { id: "4", name: "Entertainment", color: "#F033FF" },
  { id: "5", name: "Bills", color: "#FF9933" },
  { id: "6", name: "Other", color: "#33FFF9" },
];

// Sample expenses for demo
const sampleExpenses: ExpenseType[] = [
  {
    id: "1",
    amount: 25.5,
    description: "Groceries",
    date: "2023-11-15",
    categoryId: "1",
  },
  {
    id: "2",
    amount: 40,
    description: "Gas",
    date: "2023-11-10",
    categoryId: "2",
  },
  {
    id: "3",
    amount: 120,
    description: "New shoes",
    date: "2023-11-05",
    categoryId: "3",
  },
  {
    id: "4",
    amount: 60,
    description: "Movie night",
    date: "2023-11-20",
    categoryId: "4",
  },
  {
    id: "5",
    amount: 100,
    description: "Electricity bill",
    date: "2023-11-01",
    categoryId: "5",
  },
  {
    id: "6",
    amount: 30,
    description: "Book",
    date: "2023-10-25",
    categoryId: "3",
  },
  {
    id: "7",
    amount: 15,
    description: "Coffee",
    date: "2023-10-20",
    categoryId: "1",
  },
  {
    id: "8",
    amount: 50,
    description: "Internet bill",
    date: "2023-10-05",
    categoryId: "5",
  },
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<ExpenseType[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : sampleExpenses;
  });

  const [categories, setCategories] = useState<CategoryType[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  const { toast } = useToast();

  // Save to local storage whenever expenses or categories change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Expense operations
  const addExpense = (expense: Omit<ExpenseType, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([...expenses, newExpense]);
    toast({
      title: "Expense added",
      description: `$${expense.amount.toFixed(2)} for ${expense.description}`,
    });
  };

  const updateExpense = (id: string, updatedExpense: Partial<ExpenseType>) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
    toast({
      title: "Expense updated",
      description: "Your expense has been updated successfully",
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
    toast({
      title: "Expense deleted",
      description: "Your expense has been deleted successfully",
      variant: "destructive",
    });
  };

  // Category operations
  const addCategory = (category: Omit<CategoryType, "id">) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `New category "${category.name}" has been added`,
    });
  };

  const updateCategory = (id: string, updatedCategory: Partial<CategoryType>) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
      )
    );
    toast({
      title: "Category updated",
      description: "Your category has been updated successfully",
    });
  };

  const deleteCategory = (id: string) => {
    // Check if category is in use
    const inUse = expenses.some((expense) => expense.categoryId === id);
    if (inUse) {
      toast({
        title: "Cannot delete category",
        description: "This category is still in use by some expenses",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.filter((category) => category.id !== id));
    toast({
      title: "Category deleted",
      description: "Your category has been deleted successfully",
      variant: "destructive",
    });
  };

  // Utility functions
  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const getExpensesByCategory = (categoryId: string) => {
    return expenses.filter((expense) => expense.categoryId === categoryId);
  };

  const getExpensesByMonth = (month: string) => {
    return expenses.filter((expense) => expense.date.startsWith(month));
  };

  const getTotalByMonth = (month: string) => {
    return getExpensesByMonth(month).reduce(
      (total, expense) => total + expense.amount,
      0
    );
  };

  const getMonthlyTotals = () => {
    const months = new Set<string>();
    expenses.forEach((expense) => {
      const yearMonth = expense.date.substring(0, 7);
      months.add(yearMonth);
    });

    return Array.from(months)
      .sort()
      .map((month) => ({
        month,
        amount: getTotalByMonth(month),
      }));
  };

  const getMonthlyTotalsByCategory = (categoryId: string) => {
    const categoryExpenses = getExpensesByCategory(categoryId);
    const months = new Set<string>();
    categoryExpenses.forEach((expense) => {
      const yearMonth = expense.date.substring(0, 7);
      months.add(yearMonth);
    });

    return Array.from(months)
      .sort()
      .map((month) => ({
        month,
        amount: categoryExpenses
          .filter((expense) => expense.date.startsWith(month))
          .reduce((total, expense) => total + expense.amount, 0),
      }));
  };

  const searchExpenses = (query: string) => {
    if (!query) return expenses;
    
    const lowercaseQuery = query.toLowerCase();
    return expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(lowercaseQuery) ||
        getCategoryById(expense.categoryId)?.name.toLowerCase().includes(lowercaseQuery) ||
        expense.amount.toString().includes(lowercaseQuery) ||
        expense.date.includes(lowercaseQuery)
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        getExpensesByCategory,
        getExpensesByMonth,
        getTotalByMonth,
        getMonthlyTotals,
        getMonthlyTotalsByCategory,
        searchExpenses,
        getCategoryById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }
  return context;
};
