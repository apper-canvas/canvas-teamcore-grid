import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DepartmentCard = ({ 
  department, 
  onEdit, 
  onDelete, 
  onViewEmployees 
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Building2" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{department.name}</h3>
            <Badge variant="info" className="mt-1">
              {department.employeeCount} employees
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(department)}
            className="text-slate-400 hover:text-slate-600"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(department)}
            className="text-slate-400 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
{department.description_c}
      </p>

      {department.manager_c && (
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="User" className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600">Manager: {department.manager_c}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <ApperIcon name="Users" className="h-4 w-4" />
          <span>{department.employee_count_c} team members</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewEmployees(department)}
        >
          View Team
        </Button>
      </div>
    </div>
  );
};

export default DepartmentCard;