import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const studentsData = await studentService.getAll();
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.first_name_c.toLowerCase().includes(query) ||
        student.last_name_c.toLowerCase().includes(query) ||
        student.email_c.toLowerCase().includes(query) ||
        (student.Tags && student.Tags.toLowerCase().includes(query))
      );
    }

    // Apply grade filter
    if (gradeFilter) {
      filtered = filtered.filter(student => student.grade_level_c === Number(gradeFilter));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      // Map sort keys to field names
      if (sortBy === "firstName") {
        aVal = a.first_name_c;
        bVal = b.first_name_c;
      } else if (sortBy === "lastName") {
        aVal = a.last_name_c;
        bVal = b.last_name_c;
      } else if (sortBy === "email") {
        aVal = a.email_c;
        bVal = b.email_c;
      } else if (sortBy === "gradeLevel") {
        aVal = Number(a.grade_level_c) || 0;
        bVal = Number(b.grade_level_c) || 0;
      } else if (sortBy === "dateOfBirth") {
        aVal = new Date(a.date_of_birth_c);
        bVal = new Date(b.date_of_birth_c);
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }
      
      if (sortBy !== "gradeLevel" && sortBy !== "dateOfBirth") {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredStudents(filtered);
  }, [students, searchQuery, gradeFilter, sortBy, sortDirection]);

  const handleStudentClick = (student) => {
    navigate(`/students/${student.Id}`);
  };

  const handleEditStudent = (student) => {
    navigate(`/students/${student.Id}/edit`);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.first_name_c} ${student.last_name_c}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success("Student deleted successfully");
        loadData();
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setGradeFilter("");
  };

  // Generate grade options from students
  const gradeOptions = [...new Set(students.map(s => s.grade_level_c))]
    .filter(grade => grade != null)
    .sort((a, b) => a - b)
    .map(grade => ({ value: grade.toString(), label: `Grade ${grade}` }));

  if (loading) return <Loading type="table" />;

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
<Header title="Students" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Error message={error} onRetry={loadData} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
<Header title="Students">
        <Button onClick={() => navigate("/students/new")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <SearchBar
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                />
              </div>
              
              <div>
                <Select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="">All Grades</option>
                  {gradeOptions.map(grade => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {(searchQuery || gradeFilter) && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">
                    Showing {filteredStudents.length} of {students.length} students
                  </span>
                  {searchQuery && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {gradeFilter && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Grade: {gradeFilter}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Student Table */}
          {filteredStudents.length === 0 ? (
            <Empty
              title="No students found"
              description={searchQuery || gradeFilter ? 
                "Try adjusting your filters or search terms." : 
                "Get started by adding your first student."
              }
              icon="Users"
              actionLabel={!(searchQuery || gradeFilter) ? "Add Student" : undefined}
              onAction={!(searchQuery || gradeFilter) ? () => navigate("/students/new") : undefined}
            />
          ) : (
            <StudentTable
              students={filteredStudents}
              onStudentClick={handleStudentClick}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentList;