import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import { toast } from "react-toastify";

const EmployeeList = ({ onMenuClick }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...employees];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(emp => 
        emp.first_name_c.toLowerCase().includes(query) ||
        emp.last_name_c.toLowerCase().includes(query) ||
        emp.email_c.toLowerCase().includes(query) ||
        emp.department_c.toLowerCase().includes(query) ||
        emp.role_c.toLowerCase().includes(query)
      );
    }

    // Apply department filter
if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department_c === departmentFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status_c === statusFilter);
    }

    // Apply sorting
filtered.sort((a, b) => {
      let aVal, bVal;
      
      // Map old sort keys to new field names
      if (sortBy === "firstName") {
        aVal = a.first_name_c;
        bVal = b.first_name_c;
      } else if (sortBy === "lastName") {
        aVal = a.last_name_c;
        bVal = b.last_name_c;
      } else if (sortBy === "email") {
        aVal = a.email_c;
        bVal = b.email_c;
      } else if (sortBy === "department") {
        aVal = a.department_c;
        bVal = b.department_c;
      } else if (sortBy === "role") {
        aVal = a.role_c;
        bVal = b.role_c;
      } else if (sortBy === "status") {
        aVal = a.status_c;
        bVal = b.status_c;
      } else if (sortBy === "salary") {
        aVal = Number(a.salary_c) || 0;
        bVal = Number(b.salary_c) || 0;
      } else if (sortBy === "startDate") {
        aVal = new Date(a.start_date_c);
        bVal = new Date(b.start_date_c);
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }
      
      if (sortBy !== "salary" && sortBy !== "startDate") {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, departmentFilter, statusFilter, sortBy, sortDirection]);

  const handleEmployeeClick = (employee) => {
    navigate(`/employees/${employee.Id}`);
  };

  const handleEditEmployee = (employee) => {
    navigate(`/employees/${employee.Id}/edit`);
  };

const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.first_name_c} ${employee.last_name_c}?`)) {
      try {
        await employeeService.delete(employee.Id);
        toast.success("Employee deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on_leave", label: "On Leave" },
    { value: "pending", label: "Pending" }
  ];

  if (loading) return <Loading type="table" />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header title="Employees" onMenuClick={onMenuClick} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={loadData} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Employees" onMenuClick={onMenuClick}>
        <Button onClick={() => navigate("/employees/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                />
              </div>
              
              <div>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
{departments.map(dept => (
                    <option key={dept.Id} value={dept.name_c}>
                      {dept.name_c}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {(searchQuery || departmentFilter || statusFilter) && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">
                    Showing {filteredEmployees.length} of {employees.length} employees
                  </span>
                  {searchQuery && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {departmentFilter && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Department: {departmentFilter}
                    </span>
                  )}
                  {statusFilter && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Status: {statusFilter}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

{/* Employee Table */}
          {filteredEmployees.length === 0 ? (
            <Empty
              title="No employees found"
              description={searchQuery || departmentFilter || statusFilter ? 
                "Try adjusting your filters or search terms." : 
                "Get started by adding your first employee."
              }
              icon="Users"
              actionLabel={!(searchQuery || departmentFilter || statusFilter) ? "Add Employee" : undefined}
              onAction={!(searchQuery || departmentFilter || statusFilter) ? () => navigate("/employees/new") : undefined}
            />
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEmployeeClick={handleEmployeeClick}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;