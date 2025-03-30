
import React from "react";
import { useExpense } from "@/context/ExpenseContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, subMonths } from "date-fns";
import { Loader2 } from "lucide-react";

const DashboardStats: React.FC = () => {
  const { expenses, getTotalByMonth, getCategoryById, loading } = useExpense();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted/50 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate current month expenses
  const currentMonth = format(new Date(), "yyyy-MM");
  const currentMonthTotal = getTotalByMonth(currentMonth);

  // Calculate previous month expenses
  const previousMonth = format(subMonths(new Date(), 1), "yyyy-MM");
  const previousMonthTotal = getTotalByMonth(previousMonth);

  // Calculate month-over-month change
  const monthlyChange =
    previousMonthTotal !== 0
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
      : 0;

  // Get most expensive category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.categoryId] = (acc[expense.categoryId] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  let mostExpensiveCategoryId = "";
  let highestAmount = 0;

  Object.entries(categoryTotals).forEach(([categoryId, total]) => {
    if (total > highestAmount) {
      highestAmount = total;
      mostExpensiveCategoryId = categoryId;
    }
  });

  const biggestCategory = getCategoryById(mostExpensiveCategoryId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Current Month Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${currentMonthTotal.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(), "MMMM yyyy")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Month-over-Month Change
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              monthlyChange > 0
                ? "text-red-500"
                : monthlyChange < 0
                ? "text-green-500"
                : ""
            }`}
          >
            {monthlyChange > 0 ? "+" : ""}
            {monthlyChange.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">From last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Biggest Expense Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {biggestCategory ? biggestCategory.name : "None"}
          </div>
          <p className="text-xs text-muted-foreground">
            ${highestAmount.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
