import { toast } from "react-toastify";

class EmployeeService {
  constructor() {
    // Initialize ApperClient
    this.tableName = 'employee_c';
    console.log(`EmployeeService initialized for table: ${this.tableName}`);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Employee not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error?.message || error);
      throw error;
    }
  }

  async create(employeeData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const sanitizedData = {
        Name: `${employeeData.first_name_c || ''} ${employeeData.last_name_c || ''}`.trim(),
        first_name_c: employeeData.first_name_c,
        last_name_c: employeeData.last_name_c,
        email_c: employeeData.email_c,
        phone_c: employeeData.phone_c,
        department_c: employeeData.department_c,
        role_c: employeeData.role_c,
        start_date_c: employeeData.start_date_c,
        status_c: employeeData.status_c,
        salary_c: Number(employeeData.salary_c),
        manager_c: employeeData.manager_c,
        avatar_c: employeeData.avatar_c
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
          console.info(`apper_info: An error was received in this function: employeeService.create. The response body is: ${JSON.stringify(failed)}.`);
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
      console.info(`apper_info: An error was received in this function: employeeService.create. The error is: ${error.message}`);
      throw error;
    }
  }

  async update(id, employeeData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: `${employeeData.first_name_c || ''} ${employeeData.last_name_c || ''}`.trim(),
        first_name_c: employeeData.first_name_c,
        last_name_c: employeeData.last_name_c,
        email_c: employeeData.email_c,
        phone_c: employeeData.phone_c,
        department_c: employeeData.department_c,
        role_c: employeeData.role_c,
        start_date_c: employeeData.start_date_c,
        status_c: employeeData.status_c,
        salary_c: Number(employeeData.salary_c),
        manager_c: employeeData.manager_c,
        avatar_c: employeeData.avatar_c
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
          console.info(`apper_info: An error was received in this function: employeeService.update. The response body is: ${JSON.stringify(failed)}.`);
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
      console.info(`apper_info: An error was received in this function: employeeService.update. The error is: ${error.message}`);
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
          console.info(`apper_info: An error was received in this function: employeeService.delete. The response body is: ${JSON.stringify(failed)}.`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: employeeService.delete. The error is: ${error.message}`);
      throw error;
    }
  }

  async getByDepartment(department) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "avatar_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "avatar_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "first_name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "last_name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "department_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "role_c", "operator": "Contains", "values": [query]}], "operator": ""}
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
      console.error("Error searching employees:", error?.message || error);
      throw error;
    }
  }

  async getStats() {
    try {
      const employees = await this.getAll();
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status_c === "active").length;
      const onLeave = employees.filter(emp => emp.status_c === "on_leave").length;
      const departments = [...new Set(employees.map(emp => emp.department_c))];
      
      return {
        totalEmployees,
        activeEmployees,
        onLeave,
        totalDepartments: departments.length,
        departments: departments.map(dept => ({
          name: dept,
          count: employees.filter(emp => emp.department_c === dept).length
        }))
      };
    } catch (error) {
      console.error("Error getting employee stats:", error?.message || error);
      throw error;
    }
  }
}

// Create and export singleton instance to ensure state persistence
const employeeServiceInstance = new EmployeeService();
export { employeeServiceInstance as employeeService };