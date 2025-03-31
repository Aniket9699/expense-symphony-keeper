
import React, { useState } from "react";
import { useExpense } from "@/context/ExpenseContext";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import DashboardStats from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import CategoryList from "@/components/CategoryList";

const Dashboard: React.FC = () => {
  const { expenses, searchExpenses } = useExpense();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredExpenses = searchQuery ? searchExpenses(searchQuery) : expenses;

  const handleAddExpense = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Expense Symphony Keeper</h1>
          <p className="text-muted-foreground">
            Track and manage your expenses efficiently
          </p>
        </div>
        <Button onClick={handleAddExpense} className="flex items-center gap-2">
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          <ExpenseChart />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All Expenses</h2>
            </div>
            <ExpenseList expenses={expenses} />
          </div>
        </TabsContent>
        <TabsContent value="expenses">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <ExpenseList expenses={filteredExpenses} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>
      </Tabs>

      <ExpenseForm open={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default Dashboard;
