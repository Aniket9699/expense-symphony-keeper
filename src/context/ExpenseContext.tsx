import React, { createContext, useContext, useEffect, useState } from "react";
import { ExpenseType, CategoryType, MonthlyTotalType } from "@/types/expense";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import api from "@/services/api";

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
  loading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

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

const defaultCategories: CategoryType[] = [
  { id: "1", name: "Food", color: "#FF5733" },
  { id: "2", name: "Transportation", color: "#33FF57" },
  { id: "3", name: "Shopping", color: "#3357FF" },
  { id: "4", name: "Entertainment", color: "#F033FF" },
  { id: "5", name: "Bills", color: "#FF9933" },
  { id: "6", name: "Other", color: "#33FFF9" },
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const categoryResponse = await api.get('/categories');
        let fetchedCategories = categoryResponse.data;
        
        if (!fetchedCategories || fetchedCategories.length === 0) {
          fetchedCategories = defaultCategories;
          try {
            await Promise.all(
              defaultCategories.map(category => 
                api.post('/categories', { name: category.name, color: category.color })
              )
            );
          } catch (err) {
            console.error("Error creating default categories:", err);
          }
        }
        
        setCategories(fetchedCategories);
        
        const expenseResponse = await api.get('/expenses');
        let fetchedExpenses = expenseResponse.data;
        
        if (!fetchedExpenses || fetchedExpenses.length === 0) {
          fetchedExpenses = sampleExpenses;
          try {
            await Promise.all(
              sampleExpenses.map(expense => 
                api.post('/expenses', { 
                  amount: expense.amount,
                  description: expense.description,
                  date: expense.date,
                  categoryId: expense.categoryId
                })
              )
            );
            fetchedExpenses = (await api.get('/expenses')).data;
          } catch (err) {
            console.error("Error creating sample expenses:", err);
          }
        }
        
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching data:", error);
        
        setCategories(defaultCategories);
        setExpenses(sampleExpenses);
        
        toast({
          title: "Connection Error",
          description: "Using local data. Check your backend connection.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const addExpense = async (expense: Omit<ExpenseType, "id">) => {
    try {
      const response = await api.post('/expenses', expense);
      const newExpense = response.data;
      setExpenses([...expenses, newExpense]);
      toast({
        title: "Expense added",
        description: `$${expense.amount.toFixed(2)} for ${expense.description}`,
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error adding expense",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const updateExpense = async (id: string, updatedExpense: Partial<ExpenseType>) => {
    try {
      const response = await api.put(`/expenses/${id}`, updatedExpense);
      const updated = response.data;
      setExpenses(
        expenses.map((expense) =>
          expense.id === id ? { ...expense, ...updated } : expense
        )
      );
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error updating expense",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense.id !== id));
      toast({
        title: "Expense deleted",
        description: "Your expense has been deleted successfully",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error deleting expense",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const addCategory = async (category: Omit<CategoryType, "id">) => {
    try {
      const response = await api.post('/categories', category);
      const newCategory = response.data;
      setCategories([...categories, newCategory]);
      toast({
        title: "Category added",
        description: `New category "${category.name}" has been added`,
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error adding category",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id: string, updatedCategory: Partial<CategoryType>) => {
    try {
      const response = await api.put(`/categories/${id}`, updatedCategory);
      const updated = response.data;
      setCategories(
        categories.map((category) =>
          category.id === id ? { ...category, ...updated } : category
        )
      );
      toast({
        title: "Category updated",
        description: "Your category has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error updating category",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      toast({
        title: "Category deleted",
        description: "Your category has been deleted successfully",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error deleting category",
        description: "This category may still be in use by some expenses",
        variant: "destructive",
      });
    }
  };

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
        loading,
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
