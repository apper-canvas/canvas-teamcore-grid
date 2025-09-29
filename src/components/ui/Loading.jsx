import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "default" }) => {
  if (type === "table") {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {Array.from({ length: 8 }).map((_, index) => (
                  <th key={index} className="px-6 py-3">
                    <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 8 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {colIndex === 0 ? (
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-slate-200 rounded-full animate-shimmer"></div>
                          <div className="ml-4 space-y-2">
                            <div className="h-4 bg-slate-200 rounded animate-shimmer w-24"></div>
                            <div className="h-3 bg-slate-200 rounded animate-shimmer w-20"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-200 rounded-lg animate-shimmer"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded animate-shimmer w-24"></div>
                  <div className="h-4 bg-slate-200 rounded animate-shimmer w-16"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-slate-200 rounded animate-shimmer"></div>
                <div className="h-8 w-8 bg-slate-200 rounded animate-shimmer"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
              <div className="h-4 bg-slate-200 rounded animate-shimmer w-3/4"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="h-4 bg-slate-200 rounded animate-shimmer w-20"></div>
              <div className="h-8 bg-slate-200 rounded animate-shimmer w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-600">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;