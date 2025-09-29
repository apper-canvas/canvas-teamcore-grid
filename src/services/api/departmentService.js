import { toast } from "react-toastify";

class DepartmentService {
  constructor() {
    // Initialize ApperClient
    this.tableName = 'department_c';
    console.log(`DepartmentService initialized for table: ${this.tableName}`);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "employee_count_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "manager_c"}},
          {"field": {"Name": "employee_count_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Department not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.message || error);
      throw error;
    }
  }

  async create(departmentData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const sanitizedData = {
        Name: departmentData.name_c,
        name_c: departmentData.name_c,
        description_c: departmentData.description_c,
        manager_c: departmentData.manager_c,
        employee_count_c: Number(departmentData.employee_count_c) || 0
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
          console.info(`apper_info: An error was received in this function: departmentService.create. The response body is: ${JSON.stringify(failed)}.`);
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
      console.info(`apper_info: An error was received in this function: departmentService.create. The error is: ${error.message}`);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields
      const sanitizedData = {
        Id: parseInt(id),
        Name: departmentData.name_c,
        name_c: departmentData.name_c,
        description_c: departmentData.description_c,
        manager_c: departmentData.manager_c,
        employee_count_c: Number(departmentData.employee_count_c)
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
          console.info(`apper_info: An error was received in this function: departmentService.update. The response body is: ${JSON.stringify(failed)}.`);
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
      console.info(`apper_info: An error was received in this function: departmentService.update. The error is: ${error.message}`);
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
          console.info(`apper_info: An error was received in this function: departmentService.delete. The response body is: ${JSON.stringify(failed)}.`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.info(`apper_info: An error was received in this function: departmentService.delete. The error is: ${error.message}`);
      throw error;
    }
  }

  async updateEmployeeCount(departmentName, count) {
    try {
      // Get all departments to find the one with matching name_c
      const departments = await this.getAll();
      const department = departments.find(dept => dept.name_c === departmentName);
      
      if (department) {
        await this.update(department.Id, {
          ...department,
          employee_count_c: count
        });
        return department;
      }
      return null;
    } catch (error) {
      console.error("Error updating employee count:", error?.message || error);
      throw error;
    }
  }
}

const departmentServiceInstance = new DepartmentService();
export { departmentServiceInstance as departmentService };
export const departmentService = new DepartmentService();