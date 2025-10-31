import React from "react";
import { useOutletContext } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, children }) => {
  const { handleMenuClick } = useOutletContext();
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
<Button
            variant="ghost"
            size="sm"
            onClick={handleMenuClick}
            className="mr-3 lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;