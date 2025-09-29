import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
constructor() {
    // Ensure we always have a fresh copy of the data and maintain state
    if (!this.employees) {
      this.employees = [...employeesData];
    }
    // Verify data integrity on initialization
    console.log(`EmployeeService initialized with ${this.employees.length} employees`);
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async getAll() {
    await this.delay();
    // Ensure we return the current state with all modifications
    const currentEmployees = [...this.employees];
    console.log(`EmployeeService.getAll() returning ${currentEmployees.length} employees`);
    return currentEmployees;
  }

  async getById(id) {
    await this.delay();
    const employee = this.employees.find(emp => emp.Id === parseInt(id));
    if (!employee) {
      throw new Error("Employee not found");
    }
    return { ...employee };
  }

async create(employeeData) {
    await this.delay();
    const maxId = Math.max(...this.employees.map(emp => emp.Id), 0);
    const newEmployee = {
      Id: maxId + 1,
      ...employeeData
    };
    
    // Add to the employees array and verify persistence
    this.employees.push(newEmployee);
    console.log(`EmployeeService.create() added employee with ID ${newEmployee.Id}. Total employees: ${this.employees.length}`);
    
    // Return a copy to prevent external mutations
    return { ...newEmployee };
  }

  async update(id, employeeData) {
    await this.delay();
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    this.employees[index] = { ...this.employees[index], ...employeeData };
    return { ...this.employees[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    const deletedEmployee = this.employees.splice(index, 1)[0];
    return { ...deletedEmployee };
  }

  async getByDepartment(department) {
    await this.delay();
    return this.employees.filter(emp => emp.department === department);
  }

  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.employees.filter(emp => 
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.role.toLowerCase().includes(searchTerm)
    );
  }

  async getStats() {
    await this.delay();
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter(emp => emp.status === "active").length;
    const onLeave = this.employees.filter(emp => emp.status === "on_leave").length;
    const departments = [...new Set(this.employees.map(emp => emp.department))];
    
    return {
      totalEmployees,
      activeEmployees,
      onLeave,
      totalDepartments: departments.length,
      departments: departments.map(dept => ({
        name: dept,
        count: this.employees.filter(emp => emp.department === dept).length
      }))
    };
  }
}

// Create and export singleton instance to ensure state persistence
const employeeServiceInstance = new EmployeeService();
export { employeeServiceInstance as employeeService };