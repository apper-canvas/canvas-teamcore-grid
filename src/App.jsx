import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import "@/index.css";
import ApperIcon from "@/components/ApperIcon";
import Reports from "@/components/pages/Reports";
import Dashboard from "@/components/pages/Dashboard";
import Departments from "@/components/pages/Departments";
import EmployeeDetail from "@/components/pages/EmployeeDetail";
import EmployeeFormPage from "@/components/pages/EmployeeFormPage";
import EmployeeList from "@/components/pages/EmployeeList";
import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organisms/Sidebar";

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const user = userState?.user;

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);// No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-full w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  // If authenticated, render the main app
  if (isAuthenticated) {
    return (
      <AuthContext.Provider value={authMethods}>
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
                    onClick={authMethods.logout}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="LogOut" className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
            <Routes>
              <Route 
                path="/" 
                element={<Dashboard onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/employees" 
                element={<EmployeeList onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/employees/new" 
                element={<EmployeeFormPage onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/employees/:id" 
                element={<EmployeeDetail onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/employees/:id/edit" 
                element={<EmployeeFormPage onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/departments" 
                element={<Departments onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/reports" 
                element={<Reports onMenuClick={handleMenuClick} />} 
              />
            </Routes>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Not authenticated, render auth routes
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;