import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StatsCards from "@/components/organisms/StatsCards";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import { formatDate } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, employeesData, departmentsData] = await Promise.all([
        employeeService.getStats(),
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setStats(statsData);
      setDepartments(departmentsData);
      
      // Get 5 most recent employees
const sorted = employeesData.sort((a, b) => new Date(b.start_date_c) - new Date(a.start_date_c));
      setRecentEmployees(sorted.slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Chart data for department distribution
  const chartOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false }
    },
    colors: ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316"],
    legend: {
      position: "bottom",
      horizontalAlign: "center"
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: "bottom" }
      }
    }]
  };

const chartSeries = departments.map(dept => dept.employee_count_c);
  const chartLabels = departments.map(dept => dept.name_c);
  if (loading) return <Loading />;

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="flex-1 overflow-hidden">
<Header title="Dashboard">
        <Button onClick={() => navigate("/employees/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <StatsCards stats={{
            totalEmployees: stats.totalEmployees || 0,
            activeEmployees: stats.activeEmployees || 0,
            totalDepartments: stats.totalDepartments || 0,
            onLeave: stats.onLeave || 0
          }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution Chart */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Department Distribution
              </h3>
              {departments.length > 0 ? (
                <Chart
                  options={{
                    ...chartOptions,
                    labels: chartLabels
                  }}
                  series={chartSeries}
                  type="donut"
                  height={280}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <p>No department data available</p>
                </div>
              )}
            </div>

            {/* Recent Employees */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Employees
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/employees")}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <div
key={employee.Id}
                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 -mx-3 px-3 rounded-lg transition-colors duration-150"
                    onClick={() => navigate(`/employees/${employee.Id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <EmployeeAvatar employee={employee} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {employee.first_name_c} {employee.last_name_c}
                        </p>
                        <p className="text-xs text-slate-500">
                          {employee.role_c} • {employee.department_c}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={employee.status_c} />
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Started</p>
                        <p className="text-xs font-medium text-slate-700">
                          {formatDate(employee.start_date_c)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {recentEmployees.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <ApperIcon name="Users" className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p>No recent employees</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/employees/new")}
                className="justify-start"
              >
                <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/departments")}
                className="justify-start"
              >
                <ApperIcon name="Building2" className="h-4 w-4 mr-2" />
                Manage Departments
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/reports")}
                className="justify-start"
              >
                <ApperIcon name="FileBarChart" className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/employees")}
                className="justify-start"
              >
                <ApperIcon name="Search" className="h-4 w-4 mr-2" />
                Search Employees
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;