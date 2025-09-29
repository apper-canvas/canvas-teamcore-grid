import React, { useEffect, useState } from "react";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const StudentForm = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    date_of_birth_c: "",
    grade_level_c: "",
    Tags: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.first_name_c || "",
        last_name_c: student.last_name_c || "",
        email_c: student.email_c || "",
        date_of_birth_c: student.date_of_birth_c ? student.date_of_birth_c.split('T')[0] : "",
        grade_level_c: student.grade_level_c || "",
        Tags: student.Tags || ""
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email_c)) newErrors.email_c = "Email is invalid";
    if (!formData.grade_level_c || formData.grade_level_c < 1 || formData.grade_level_c > 12) {
      newErrors.grade_level_c = "Valid grade level (1-12) is required";
    }

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
      const studentData = {
        ...formData,
        grade_level_c: Number(formData.grade_level_c)
      };

      if (student) {
        await studentService.update(student.Id, studentData);
        toast.success("Student updated successfully");
      } else {
        await studentService.create(studentData);
        toast.success("Student created successfully");
      }
      
      onSave();
    } catch (error) {
      toast.error(student ? "Failed to update student" : "Failed to create student");
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

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-lg font-medium text-white">
            {getInitials(formData.first_name_c, formData.last_name_c)}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <p className="text-slate-500">
            {student ? "Update student information" : "Create a new student record"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="First Name"
                name="first_name_c"
                value={formData.first_name_c}
                onChange={handleChange}
                error={errors.first_name_c}
                required
              />
            </div>
            <div>
              <FormField
                label="Last Name"
                name="last_name_c"
                value={formData.last_name_c}
                onChange={handleChange}
                error={errors.last_name_c}
                required
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
                required
              />
            </div>
            <div>
              <FormField
                label="Date of Birth"
                name="date_of_birth_c"
                type="date"
                value={formData.date_of_birth_c}
                onChange={handleChange}
                error={errors.date_of_birth_c}
              />
            </div>
            <div>
              <FormField
                label="Grade Level"
                name="grade_level_c"
                type="number"
                min="1"
                max="12"
                value={formData.grade_level_c}
                onChange={handleChange}
                error={errors.grade_level_c}
                required
              />
            </div>
            <div>
              <FormField
                label="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleChange}
                error={errors.Tags}
                placeholder="Comma-separated tags"
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
            {loading ? "Saving..." : student ? "Update Student" : "Create Student"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;