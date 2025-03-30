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
import { Loader2 } from "lucide-react";

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
  dark: "#2C2C2C",
  text: "#FFFFFF",
  gridLines: "rgba(255, 255, 255, 0.1)"
};

const ExpenseChart: React.FC = () => {
  const {
    expenses,
    categories,
    getMonthlyTotals,
    getExpensesByCategory,
    loading
  } = useExpense();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted/20 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke={COLORS.gridLines} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthFormatter}
                    stroke={COLORS.text}
                  />
                  <YAxis stroke={COLORS.text} />
                  <Tooltip
                    formatter={(value: ValueType) => [formatValue(value), "Amount"]}
                    labelFormatter={monthFormatter}
                    contentStyle={{ backgroundColor: COLORS.dark, borderColor: COLORS.secondary, color: COLORS.text }}
                  />
                  <Bar dataKey="amount" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No data available</p>
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
                    contentStyle={{ backgroundColor: COLORS.dark, borderColor: COLORS.secondary, color: COLORS.text }}
                  />
                  <Legend 
                    formatter={(value, entry) => (
                      <span style={{ color: COLORS.text }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
