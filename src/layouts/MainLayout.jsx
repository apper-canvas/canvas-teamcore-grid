import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "./Root";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { logout } = useAuth();

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header with logout button */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuClick}
                className="mr-3 lg:hidden"
              >
                <ApperIcon name="Menu" className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  TeamCore
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Welcome,</span>
                  <span className="text-sm font-medium text-slate-900">
                    {user.firstName || user.name || user.emailAddress}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area with outlet context */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet context={{ sidebarOpen, setSidebarOpen, handleMenuClick, handleSidebarClose }} />
        </main>
      </div>
    </div>
  );
}