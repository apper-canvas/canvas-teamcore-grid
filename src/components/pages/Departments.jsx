import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import DepartmentCard from "@/components/organisms/DepartmentCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { departmentService } from "@/services/api/departmentService";
import { employeeService } from "@/services/api/employeeService";
import { toast } from "react-toastify";

const Departments = ({ onMenuClick }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const [deptData, empData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      // Update employee counts for each department
      const updatedDepartments = deptData.map(dept => ({
        ...dept,
        employeeCount: empData.filter(emp => emp.department === dept.name).length
      }));
      
      setDepartments(updatedDepartments);
    } catch (err) {
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleEditDepartment = (department) => {
    toast.info("Department editing feature coming soon!");
  };

  const handleDeleteDepartment = async (department) => {
    if (department.employeeCount > 0) {
      toast.error("Cannot delete department with employees. Please reassign employees first.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      try {
        await departmentService.delete(department.Id);
        toast.success("Department deleted successfully");
        loadDepartments();
      } catch (error) {
        toast.error("Failed to delete department");
      }
    }
  };

  const handleViewEmployees = (department) => {
    navigate(`/employees?department=${encodeURIComponent(department.name)}`);
  };

  if (loading) return <Loading type="cards" />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header title="Departments" onMenuClick={onMenuClick} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={loadDepartments} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Departments" onMenuClick={onMenuClick}>
        <Button onClick={() => toast.info("Add department feature coming soon!")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {departments.length === 0 ? (
            <Empty
              title="No departments found"
              description="Get started by creating your first department to organize your employees."
              icon="Building2"
              actionLabel="Add Department"
              onAction={() => toast.info("Add department feature coming soon!")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department) => (
                <DepartmentCard
                  key={department.Id}
                  department={department}
                  onEdit={handleEditDepartment}
                  onDelete={handleDeleteDepartment}
                  onViewEmployees={handleViewEmployees}
                />
              ))}
            </div>
          )}

          {departments.length > 0 && (
            <div className="mt-8 bg-white rounded-lg border border-slate-200 shadow-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {departments.length}
                  </div>
                  <div className="text-sm text-slate-600">Total Departments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
                  </div>
                  <div className="text-sm text-slate-600">Total Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-1">
                    {Math.round(departments.reduce((sum, dept) => sum + dept.employeeCount, 0) / departments.length) || 0}
                  </div>
                  <div className="text-sm text-slate-600">Avg per Department</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Departments;