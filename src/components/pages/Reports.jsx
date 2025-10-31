import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import { formatDate, formatSalary } from "@/utils/formatters";
import Chart from "react-apexcharts";

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [empData, deptData, statsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        employeeService.getStats()
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const reports = [
    { key: "overview", label: "Overview", icon: "BarChart3" },
    { key: "departments", label: "Departments", icon: "Building2" },
    { key: "salary", label: "Salary Analysis", icon: "DollarSign" },
    { key: "status", label: "Employee Status", icon: "Users" }
  ];

  // Chart configurations
  const departmentChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#2563eb"],
xaxis: { categories: departments.map(dept => dept.name_c) },
    yaxis: { title: { text: "Number of Employees" } },
    title: { text: "Employees by Department", align: "center" }
  };

  const departmentChartSeries = [{
    name: "Employees",
    data: departments.map(dept => dept.employee_count_c)
  }];

  const statusChartOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    colors: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"],
    labels: ["Active", "Inactive", "On Leave", "Pending"],
    title: { text: "Employee Status Distribution", align: "center" }
  };

  const statusCounts = {
active: employees.filter(emp => emp.status_c === "active").length,
    inactive: employees.filter(emp => emp.status_c === "inactive").length,
    on_leave: employees.filter(emp => emp.status_c === "on_leave").length,
    pending: employees.filter(emp => emp.status_c === "pending").length
  };

  const statusChartSeries = [
    statusCounts.active,
    statusCounts.inactive,
    statusCounts.on_leave,
    statusCounts.pending
  ];

  const salaryRanges = [
    { label: "Under $50K", min: 0, max: 50000 },
    { label: "$50K - $75K", min: 50000, max: 75000 },
    { label: "$75K - $100K", min: 75000, max: 100000 },
    { label: "$100K - $125K", min: 100000, max: 125000 },
    { label: "Over $125K", min: 125000, max: Infinity }
  ];

  const salaryDistribution = salaryRanges.map(range => ({
...range,
    count: employees.filter(emp => emp.salary_c >= range.min && emp.salary_c < range.max).length
  }));

  const salaryChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#06b6d4"],
    xaxis: { categories: salaryDistribution.map(range => range.label) },
    yaxis: { title: { text: "Number of Employees" } },
    title: { text: "Salary Distribution", align: "center" }
  };

  const salaryChartSeries = [{
    name: "Employees",
    data: salaryDistribution.map(range => range.count)
  }];

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
<Header title="Reports" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={loadData} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
<Header title="Reports">
        <Button onClick={() => window.print()}>
          <ApperIcon name="Printer" className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Report Navigation */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6">
                {reports.map((report) => (
                  <button
                    key={report.key}
                    onClick={() => setSelectedReport(report.key)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedReport === report.key
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <ApperIcon name={report.icon} className="h-4 w-4" />
                    <span>{report.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {selectedReport === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {stats.totalEmployees}
                      </div>
                      <div className="text-sm text-slate-600">Total Employees</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {stats.activeEmployees}
                      </div>
                      <div className="text-sm text-slate-600">Active Employees</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {stats.totalDepartments}
                      </div>
                      <div className="text-sm text-slate-600">Departments</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {stats.onLeave}
                      </div>
                      <div className="text-sm text-slate-600">On Leave</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-6">
                      <Chart
                        options={departmentChartOptions}
                        series={departmentChartSeries}
                        type="bar"
                        height={300}
                      />
                    </div>
                    <div className="bg-slate-50 rounded-lg p-6">
                      <Chart
                        options={statusChartOptions}
                        series={statusChartSeries}
                        type="donut"
                        height={300}
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === "departments" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <Chart
                      options={departmentChartOptions}
                      series={departmentChartSeries}
                      type="bar"
                      height={400}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map((dept) => (
<div key={dept.Id} className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 mb-2">{dept.name_c}</h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p>Manager: {dept.manager_c || "Not assigned"}</p>
                          <p>Employees: {dept.employee_count_c}</p>
                          <p className="text-xs">{dept.description_c}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReport === "salary" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <Chart
                      options={salaryChartOptions}
                      series={salaryChartSeries}
                      type="bar"
                      height={400}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
{formatSalary(employees.reduce((sum, emp) => sum + emp.salary_c, 0) / employees.length)}
                      </div>
                      <div className="text-sm text-slate-600">Average Salary</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {formatSalary(Math.max(...employees.map(emp => emp.salary_c)))}
                      </div>
                      <div className="text-sm text-slate-600">Highest Salary</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {formatSalary(Math.min(...employees.map(emp => emp.salary_c)))}
                      </div>
                      <div className="text-sm text-slate-600">Lowest Salary</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === "status" && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <Chart
                      options={statusChartOptions}
                      series={statusChartSeries}
                      type="donut"
                      height={400}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {statusCounts.active}
                      </div>
                      <Badge variant="success" className="text-xs">Active</Badge>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {statusCounts.inactive}
                      </div>
                      <Badge variant="error" className="text-xs">Inactive</Badge>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {statusCounts.on_leave}
                      </div>
                      <Badge variant="warning" className="text-xs">On Leave</Badge>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {statusCounts.pending}
                      </div>
                      <Badge variant="info" className="text-xs">Pending</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;