import React, { useEffect, useState } from "react";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import FormField from "@/components/molecules/FormField";

const EmployeeForm = ({ employee, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    department_c: "",
    role_c: "",
    start_date_c: "",
    status_c: "active",
    salary_c: "",
    manager_c: "",
    avatar_c: ""
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on_leave", label: "On Leave" },
    { value: "pending", label: "Pending" }
  ];

  useEffect(() => {
    if (employee) {
setFormData({
        first_name_c: employee.first_name_c || "",
        last_name_c: employee.last_name_c || "",
        email_c: employee.email_c || "",
        phone_c: employee.phone_c || "",
        department_c: employee.department_c || "",
        role_c: employee.role_c || "",
        start_date_c: employee.start_date_c ? employee.start_date_c.split('T')[0] : "",
        status_c: employee.status_c || "active",
        salary_c: employee.salary_c || "",
        manager_c: employee.manager_c || "",
        avatar_c: employee.avatar_c || ""
      });
    }
  }, [employee]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptData, empData] = await Promise.all([
          departmentService.getAll(),
          employeeService.getAll()
        ]);
        setDepartments(deptData);
        setEmployees(empData.filter(emp => emp.Id !== employee?.Id));
      } catch (error) {
        toast.error("Failed to load form data");
      }
    };
    loadData();
  }, [employee?.Id]);

  const validateForm = () => {
    const newErrors = {};

if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email_c)) newErrors.email_c = "Email is invalid";
    if (!formData.department_c) newErrors.department_c = "Department is required";
    if (!formData.role_c.trim()) newErrors.role_c = "Role is required";
    if (!formData.start_date_c) newErrors.start_date_c = "Start date is required";
    if (!formData.salary_c || formData.salary_c <= 0) newErrors.salary_c = "Valid salary is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
const employeeData = {
        ...formData,
        salary_c: Number(formData.salary_c)
      };

      if (employee) {
        await employeeService.update(employee.Id, employeeData);
        toast.success("Employee updated successfully");
      } else {
        await employeeService.create(employeeData);
        toast.success("Employee created successfully");
      }
      
      onSave();
    } catch (error) {
      toast.error(employee ? "Failed to update employee" : "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

const departmentOptions = departments.map(dept => ({
    value: dept.name_c,
    label: dept.name_c
  }));

  const managerOptions = employees
    .filter(emp => emp.department_c === formData.department_c)
    .map(emp => ({
      value: `${emp.first_name_c} ${emp.last_name_c}`,
      label: `${emp.first_name_c} ${emp.last_name_c}`
    }));

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
    <div className="flex items-center space-x-4 mb-6">
        <EmployeeAvatar employee={formData} size="lg" />
        <div>
            <h2 className="text-2xl font-bold text-slate-900">
                {employee ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="text-slate-500">
                {employee ? "Update employee information" : "Create a new employee record"}
            </p>
        </div>
    </div>
<form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label="First Name"
                    name="first_name_c"
                    value={formData.first_name_c}
                    onChange={handleChange}
                    error={errors.first_name_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Last Name"
                    name="last_name_c"
                    value={formData.last_name_c}
                    onChange={handleChange}
                    error={errors.last_name_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Email"
                    name="email_c"
                    type="email"
                    value={formData.email_c}
                    onChange={handleChange}
                    error={errors.email_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Phone"
                    name="phone_c"
                    type="tel"
                    value={formData.phone_c}
                    onChange={handleChange}
                    error={errors.phone_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Department"
                    name="department_c"
                    type="select"
                    value={formData.department_c}
                    onChange={handleChange}
                    options={departmentOptions}
                    error={errors.department_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Role"
                    name="role_c"
                    value={formData.role_c}
                    onChange={handleChange}
                    error={errors.role_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Start Date"
                    name="start_date_c"
                    type="date"
                    value={formData.start_date_c}
                    onChange={handleChange}
                    error={errors.start_date_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Status"
                    name="status_c"
                    type="select"
                    value={formData.status_c}
                    onChange={handleChange}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "on_leave", label: "On Leave" },
                      { value: "pending", label: "Pending" }
                    ]}
                    error={errors.status_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Salary"
                    name="salary_c"
                    type="number"
                    value={formData.salary_c}
                    onChange={handleChange}
                    error={errors.salary_c}
                  />
                </div>
                <div>
                  <FormField
                    label="Manager"
                    name="manager_c"
                    type="select"
                    value={formData.manager_c}
                    onChange={handleChange}
                    options={managerOptions}
                    error={errors.manager_c}
                  />
                </div>
            </div>
        </div>
        {/* Action Buttons - Sticky Footer */}
        <div className="flex-shrink-0 flex items-center justify-end space-x-3 pt-6 border-t border-slate-200 mt-6 bg-white">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                Cancel
            </Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : employee ? "Update Employee" : "Create Employee"}
            </Button>
        </div>
    </form>
</div>
  );
};

export default EmployeeForm;