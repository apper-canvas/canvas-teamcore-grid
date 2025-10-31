import React from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";

const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const isEditing = !!id;

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

  const handleSave = () => {
    navigate("/students");
  };

  const handleCancel = () => {
    navigate("/students");
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
<Header 
          title={isEditing ? "Edit Student" : "Add Student"} 
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={isEditing ? loadStudent : undefined} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
title={isEditing ? "Edit Student" : "Add Student"} 
      />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-card">
            <StudentForm
              student={student}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentFormPage;