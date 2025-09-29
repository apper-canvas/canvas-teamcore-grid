import React from "react";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const StudentTable = ({ 
  students, 
  onStudentClick, 
  onEditStudent, 
  onDeleteStudent,
  sortBy,
  sortDirection,
  onSort 
}) => {
  const headers = [
    { key: "student", label: "Student", sortable: false },
    { key: "email", label: "Email", sortable: true },
    { key: "gradeLevel", label: "Grade Level", sortable: true },
    { key: "dateOfBirth", label: "Date of Birth", sortable: true },
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

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-card">
        <div className="p-8 text-center">
          <ApperIcon name="Users" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
          <p className="text-slate-500">Get started by adding your first student.</p>
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
            {students.map((student) => (
              <tr 
                key={student.Id} 
                className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                onClick={() => onStudentClick(student)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {getInitials(student.first_name_c, student.last_name_c)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {student.first_name_c} {student.last_name_c}
                      </div>
                      {student.Tags && (
                        <div className="text-sm text-slate-500">
                          {student.Tags.split(',')[0]?.trim()}
                          {student.Tags.split(',').length > 1 && (
                            <span className="text-xs text-slate-400 ml-1">
                              +{student.Tags.split(',').length - 1} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{student.email_c}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary">
                    Grade {student.grade_level_c}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {student.date_of_birth_c ? formatDate(student.date_of_birth_c) : 'Not specified'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditStudent(student)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteStudent(student)}
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

export default StudentTable;