
import React from "react";
import { Outlet } from "react-router-dom";
import { ExpenseProvider } from "@/context/ExpenseContext";

const Layout: React.FC = () => {
  return (
    <ExpenseProvider>
      <main className="min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </ExpenseProvider>
  );
};

export default Layout;
