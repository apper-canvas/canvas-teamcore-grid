import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: "Users",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      label: "Active Employees",
      value: stats.activeEmployees,
      icon: "UserCheck",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      label: "Departments",
      value: stats.totalDepartments,
      icon: "Building2",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      label: "On Leave",
      value: stats.onLeave,
      icon: "Calendar",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-lg border border-slate-200 shadow-card p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center">
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
              item.bgColor
            )}>
              <ApperIcon 
                name={item.icon} 
                className={cn("h-6 w-6", item.textColor)} 
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-600">{item.label}</p>
              <p className={cn(
                "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                item.color
              )}>
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;