import React from "react";
import { getInitials } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const EmployeeAvatar = ({ 
  employee, 
  size = "md", 
  className 
}) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-xl",
    xl: "h-24 w-24 text-2xl"
  };

  const initials = getInitials(employee?.firstName, employee?.lastName);

  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium",
      sizes[size],
      className
    )}>
      {employee?.avatar ? (
        <img
          src={employee.avatar}
          alt={`${employee.firstName} ${employee.lastName}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default EmployeeAvatar;