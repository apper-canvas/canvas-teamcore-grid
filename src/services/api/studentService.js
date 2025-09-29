import { toast } from "react-toastify";

class StudentService {
  constructor() {
    // Initialize ApperClient
    this.tableName = 'students_c';
    console.log(`StudentService initialized for table: ${this.tableName}`);
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "grade_level_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "grade_level_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Student not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.message || error);
      throw error;
    }
  }

  async create(studentData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const sanitizedData = {
        Name: `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
        Tags: studentData.Tags,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        date_of_birth_c: studentData.date_of_birth_c,
        grade_level_c: Number(studentData.grade_level_c)
      };
      
      const params = {
        records: [sanitizedData]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.info(`apper_info: An error was received in this function: studentService.create. The response body is: ${JSON.stringify(failed)}.`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: studentService.create. The error is: ${error.message}`);
      throw error;
    }
  }

  async update(id, studentData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
        Tags: studentData.Tags,
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        date_of_birth_c: studentData.date_of_birth_c,
        grade_level_c: Number(studentData.grade_level_c)
      };
      
      const params = {
        records: [sanitizedData]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.info(`apper_info: An error was received in this function: studentService.update. The response body is: ${JSON.stringify(failed)}.`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: studentService.update. The error is: ${error.message}`);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.info(`apper_info: An error was received in this function: studentService.delete. The response body is: ${JSON.stringify(failed)}.`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: studentService.delete. The error is: ${error.message}`);
      throw error;
    }
  }

  async search(query) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "grade_level_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "first_name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "last_name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "Tags", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching students:", error?.message || error);
      throw error;
    }
  }

  async getStats() {
    try {
      const students = await this.getAll();
      const totalStudents = students.length;
      const gradeGroups = students.reduce((acc, student) => {
        const grade = student.grade_level_c;
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
      }, {});
      
      return {
        totalStudents,
        gradeGroups: Object.entries(gradeGroups).map(([grade, count]) => ({
          grade: Number(grade),
          count
        }))
      };
    } catch (error) {
      console.error("Error getting student stats:", error?.message || error);
      throw error;
    }
  }
}

// Create and export singleton instance to ensure state persistence
const studentServiceInstance = new StudentService();
export { studentServiceInstance as studentService };