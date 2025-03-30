
import React from "react";
import { useExpense } from "@/context/ExpenseContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  TooltipProps,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

const monthFormatter = (month: string) => {
  try {
    return format(parseISO(`${month}-01`), "MMM yyyy");
  } catch {
    return month;
  }
};

// Helper function to format values that might be strings or numbers
const formatValue = (value: ValueType): string => {
  if (typeof value === 'number') {
    return `$${value.toFixed(2)}`;
  }
  return `$${value}`;
};

// Color palette constants
const COLORS = {
  primary: "#F7374F",
  secondary: "#88304E",
  accent: "#522546",
  dark: "#2C2C2C"
};

const ExpenseChart: React.FC = () => {
  const {
    expenses,
    categories,
    getMonthlyTotals,
    getExpensesByCategory,
  } = useExpense();

  // Get data for monthly chart
  const monthlyData = getMonthlyTotals();

  // Get data for category chart
  const categoryData = categories.map((category) => {
    const categoryExpenses = getExpensesByCategory(category.id);
    const total = categoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return {
      name: category.name,
      value: total,
      color: category.color,
    };
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Your expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthFormatter}
                    stroke={COLORS.dark}
                  />
                  <YAxis stroke={COLORS.dark} />
                  <Tooltip
                    formatter={(value: ValueType) => [formatValue(value), "Amount"]}
                    labelFormatter={monthFormatter}
                    contentStyle={{ backgroundColor: "#fff", borderColor: COLORS.secondary }}
                  />
                  <Bar dataKey="amount" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>How your money is distributed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {totalExpenses > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill={COLORS.secondary}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: ValueType) => [formatValue(value), "Amount"]}
                    contentStyle={{ backgroundColor: "#fff", borderColor: COLORS.secondary }}
                  />
                  <Legend 
                    formatter={(value, entry) => (
                      <span style={{ color: COLORS.dark }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
