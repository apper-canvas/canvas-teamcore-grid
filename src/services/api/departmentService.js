import departmentsData from "@/services/mockData/departments.json";

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.departments];
  }

  async getById(id) {
    await this.delay();
    const department = this.departments.find(dept => dept.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  }

  async create(departmentData) {
    await this.delay();
    const maxId = Math.max(...this.departments.map(dept => dept.Id), 0);
    const newDepartment = {
      Id: maxId + 1,
      employeeCount: 0,
      ...departmentData
    };
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await this.delay();
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    this.departments[index] = { ...this.departments[index], ...departmentData };
    return { ...this.departments[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.departments.findIndex(dept => dept.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    const deletedDepartment = this.departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }

  async updateEmployeeCount(departmentName, count) {
    await this.delay();
    const department = this.departments.find(dept => dept.name === departmentName);
    if (department) {
      department.employeeCount = count;
    }
    return department;
  }
}

export const departmentService = new DepartmentService();