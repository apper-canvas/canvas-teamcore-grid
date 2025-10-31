import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { employeeService } from "@/services/api/employeeService";
import { formatDate, formatSalary, formatPhone } from "@/utils/formatters";
import { toast } from "react-toastify";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

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

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        toast.success("Employee deleted successfully");
        navigate("/employees");
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const tabs = [
    { key: "personal", label: "Personal Info", icon: "User" },
    { key: "professional", label: "Professional", icon: "Briefcase" },
    { key: "contact", label: "Contact", icon: "Phone" }
  ];

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
<Header title="Employee Details" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={loadEmployee} />
        </main>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex-1 overflow-hidden">
<Header title="Employee Details" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message="Employee not found" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
<Header title="Employee Details">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/employees/${employee.Id}/edit`)}
          >
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </Header>

<main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Employee Header */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
            <div className="flex items-center space-x-6">
<EmployeeAvatar employee={employee} size="xl" />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {employee.first_name_c} {employee.last_name_c}
                  </h1>
                  <StatusBadge status={employee.status_c} />
                </div>
                <p className="text-lg text-slate-600 mb-1">{employee.role_c}</p>
                <p className="text-slate-500">{employee.department_c}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span>Started {formatDate(employee.start_date_c)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="DollarSign" className="h-4 w-4" />
                    <span>{formatSalary(employee.salary_c)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Full Name</label>
<p className="text-slate-900">{employee.first_name_c} {employee.last_name_c}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Employee ID</label>
                        <p className="text-slate-900">EMP-{String(employee.Id).padStart(4, "0")}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Status</label>
                        <div className="mt-1">
                          <StatusBadge status={employee.status_c} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Professional Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Department</label>
<p className="text-slate-900">{employee.department_c}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Role</label>
                        <p className="text-slate-900">{employee.role_c}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Manager</label>
                        <p className="text-slate-900">{employee.manager_c || "Not assigned"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Start Date</label>
                        <p className="text-slate-900">{formatDate(employee.start_date_c)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Salary</label>
                        <p className="text-slate-900 font-semibold">{formatSalary(employee.salary_c)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Email</label>
<div className="flex items-center space-x-2">
                          <p className="text-slate-900">{employee.email_c}</p>
                          <button
                            onClick={() => window.open(`mailto:${employee.email_c}`)}
                            className="text-primary hover:text-blue-700"
                          >
                            <ApperIcon name="ExternalLink" className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Phone</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-slate-900">{formatPhone(employee.phone_c)}</p>
                          {employee.phone_c && (
                            <button
                              onClick={() => window.open(`tel:${employee.phone_c}`)}
                              className="text-primary hover:text-blue-700"
                            >
                              <ApperIcon name="ExternalLink" className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/employees/${employee.Id}/edit`)}
                className="justify-start"
              >
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit Employee
              </Button>
              <Button
                variant="outline"
onClick={() => window.open(`mailto:${employee.email_c}`)}
                className="justify-start"
              >
                <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/employees")}
                className="justify-start"
              >
                <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDetail;