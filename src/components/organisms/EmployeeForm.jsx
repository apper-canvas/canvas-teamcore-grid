import React, { useEffect, useState } from "react";
import { employeeService } from "@/services/api/employeeService";
import { departmentService } from "@/services/api/departmentService";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import EmployeeAvatar from "@/components/molecules/EmployeeAvatar";
import FormField from "@/components/molecules/FormField";

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    startDate: "",
    status: "active",
    salary: "",
    manager: "",
    avatar: ""
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
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        role: employee.role || "",
        startDate: employee.startDate ? employee.startDate.split('T')[0] : "",
        status: employee.status || "active",
        salary: employee.salary || "",
        manager: employee.manager || "",
        avatar: employee.avatar || ""
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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.salary || formData.salary <= 0) newErrors.salary = "Valid salary is required";

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
        salary: Number(formData.salary)
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
    value: dept.name,
    label: dept.name
  }));

  const managerOptions = employees
    .filter(emp => emp.department === formData.department)
    .map(emp => ({
      value: `${emp.firstName} ${emp.lastName}`,
      label: `${emp.firstName} ${emp.lastName}`
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
<form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required />
            <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required />
            <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required />
            <FormField
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone} />
            <FormField
                label="Department"
                type="select"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departmentOptions}
                error={errors.department}
                required />
            <FormField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                required />
            <FormField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
                required />
            <FormField
                label="Status"
                type="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                error={errors.status}
                required />
            <FormField
                label="Salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                error={errors.salary}
                required />
            <FormField
                label="Manager"
                type="select"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                options={managerOptions}
                error={errors.manager} />
        </div>
    </form>
    {/* Action Buttons */}
    <div
        className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel
                      </Button>
        <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : employee ? "Update Employee" : "Create Employee"}
        </Button>
    </div>
</div>
  );
};

export default EmployeeForm;