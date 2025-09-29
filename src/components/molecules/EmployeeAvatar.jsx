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

const initials = getInitials(employee?.first_name_c, employee?.last_name_c);

  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium",
      sizes[size],
      className
    )}>
{employee?.avatar_c ? (
        <img
          src={employee.avatar_c}
          alt={`${employee.first_name_c} ${employee.last_name_c}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default EmployeeAvatar;