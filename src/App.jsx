import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import EmployeeList from "@/components/pages/EmployeeList";
import EmployeeDetail from "@/components/pages/EmployeeDetail";
import EmployeeFormPage from "@/components/pages/EmployeeFormPage";
import Departments from "@/components/pages/Departments";
import Reports from "@/components/pages/Reports";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;