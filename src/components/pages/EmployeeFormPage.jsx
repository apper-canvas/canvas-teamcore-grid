import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import EmployeeForm from "@/components/organisms/EmployeeForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { employeeService } from "@/services/api/employeeService";

const EmployeeFormPage = ({ onMenuClick }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    setLoading(true);
    setError("");
    try {
      const employeeData = await employeeService.getById(id);
      setEmployee(employeeData);
    } catch (err) {
      setError("Employee not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    navigate("/employees");
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header 
          title={isEditing ? "Edit Employee" : "Add Employee"} 
          onMenuClick={onMenuClick} 
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={isEditing ? loadEmployee : undefined} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title={isEditing ? "Edit Employee" : "Add Employee"} 
        onMenuClick={onMenuClick} 
      />

<main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-card">
            <EmployeeForm
              employee={employee}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeFormPage;