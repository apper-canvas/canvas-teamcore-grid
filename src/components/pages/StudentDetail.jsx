import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { formatDate } from "@/utils/formatters";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  const loadStudent = async () => {
    setLoading(true);
    setError("");
    try {
      const studentData = await studentService.getById(id);
      setStudent(studentData);
    } catch (err) {
      setError("Student not found");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/students/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name_c} ${student.last_name_c}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success("Student deleted successfully");
        navigate("/students");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

const handleBack = () => {
    navigate("/students");
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header title="Student Details" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={loadStudent} />
        </main>
      </div>
    );
  }

if (!student) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header title="Student Details" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message="Student not found" onRetry={loadStudent} />
        </main>
      </div>
    );
  }

return (
    <div className="flex-1 overflow-hidden">
      <Header title="Student Details">
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleBack}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <Button variant="secondary" onClick={handleEdit}>
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {student.first_name_c?.[0]}{student.last_name_c?.[0]}
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    {student.first_name_c} {student.last_name_c}
                  </h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center">
                      <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                      {student.email_c}
                    </span>
                    <span className="flex items-center">
                      <ApperIcon name="GraduationCap" className="h-4 w-4 mr-2" />
                      Grade {student.grade_level_c}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <ApperIcon name="User" className="h-5 w-5 mr-2 text-slate-600" />
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">First Name</label>
                        <p className="text-slate-900 font-medium">{student.first_name_c}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Last Name</label>
                        <p className="text-slate-900 font-medium">{student.last_name_c}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Email</label>
                        <p className="text-slate-900 font-medium">{student.email_c}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                        <p className="text-slate-900 font-medium">
                          {student.date_of_birth_c ? formatDate(student.date_of_birth_c) : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <ApperIcon name="BookOpen" className="h-5 w-5 mr-2 text-slate-600" />
                      Academic Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Grade Level</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-base">
                            Grade {student.grade_level_c}
                          </Badge>
                        </div>
                      </div>
                      {student.Tags && (
                        <div>
                          <label className="text-sm font-medium text-slate-600">Tags</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {student.Tags.split(',').map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDetail;