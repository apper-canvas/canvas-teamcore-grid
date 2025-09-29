import React from "react";
import { formatDate, formatSalary } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import StatusBadge from "@/components/molecules/StatusBadge";

const EmployeeTable = ({ 
  employees, 
  onEmployeeClick, 
  onEditEmployee, 
  onDeleteEmployee,
  sortBy,
  sortDirection,
  onSort 
}) => {
  const headers = [
    { key: "employee", label: "Employee", sortable: false },
    { key: "email", label: "Email", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "startDate", label: "Start Date", sortable: true },
    { key: "salary", label: "Salary", sortable: true },
    { key: "actions", label: "Actions", sortable: false }
  ];

  const handleSort = (key) => {
    if (sortBy === key) {
      onSort(key, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return <ApperIcon name="ChevronsUpDown" className="h-4 w-4 text-slate-400" />;
    }
    return sortDirection === "asc" 
      ? <ApperIcon name="ChevronUp" className="h-4 w-4 text-primary" />
      : <ApperIcon name="ChevronDown" className="h-4 w-4 text-primary" />;
  };

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-card">
        <div className="p-8 text-center">
          <ApperIcon name="Users" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No employees found</h3>
          <p className="text-slate-500">Get started by adding your first employee.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider",
                    header.sortable && "cursor-pointer hover:bg-slate-100 select-none"
                  )}
                  onClick={header.sortable ? () => handleSort(header.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header.label}</span>
                    {header.sortable && <SortIcon column={header.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {employees.map((employee) => (
              <tr 
                key={employee.Id} 
                className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                onClick={() => onEmployeeClick(employee)}
              >
<td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <EmployeeAvatar employee={employee} size="sm" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {employee.first_name_c} {employee.last_name_c}
                      </div>
                      <div className="text-sm text-slate-500">{employee.phone_c}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{employee.email_c}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{employee.department_c}</div>
                </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{employee.role_c}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={employee.status_c} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{formatDate(employee.start_date_c)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{formatSalary(employee.salary_c)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEmployee(employee)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEmployee(employee)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;