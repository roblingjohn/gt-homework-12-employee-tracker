const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

let departmentsArray = [];
let rolesArray = [];
let employeeArray = []

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Godawgs!11",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("-------------------------------------------")
    console.log("| Welcome to the Employee Tracker System! |")
    console.log("-------------------------------------------")
    askFunction();
});

function askFunction(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                        "View employees",
                        "View roles",
                        "View departments",
                        "Add employee",
                        "Add role",
                        "Add department",
                        "Update role",
                        "Update manager",
                        "Delete employee",
                        "Delete role",
                        "Delete department",
                        "Exit"
                        ],
            name: "functionType"
        },
    ]).then (function(res){
        switch(res.functionType) {
            case "Add employee":
                addEmployee();
                break;
            case "Add role":
                addRole();
                break;
            case "Add department":
                addDepartment();
                break;
            case "View employees":
                viewEmployees();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "Update role":
                updateRoles();
                break;
            case "Update manager":
                updateManager();
                break;
            case "Delete employee":
                deleteEmployee();
                break;
            case "Delete role":
                deleteRole();
                break;
            case "Delete department":
                deleteDepartment();
                break;
            case "Exit":
                exit();
                break;
            default:
                console.log("You should not see this.");
                askFunction();
            
        }
    })
}

function addEmployee(){
    connection.query("SELECT * FROM employees", (err, data) => {
        employeeArray = data.map((object) => `${object.first_name} ${object.last_name}`);
        employeeArray.unshift("None");
        const employeeData = data;
    connection.query("SELECT * FROM roles", (err, data) => {
        rolesArray = data.map((object) => object.title)
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the employee FIRST NAME:",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please enter the employee LAST NAME:",
            name: "lastName"
        },
        {
            type: "list",
            message: "Please choose the employee ROLE:",
            choices: rolesArray,
            name: "newEmployeeRole"
        },
        {
            type: "list",
            message: "Please assign the employee's MANAGER, if any:",
            choices: employeeArray,
            name: "manager"
        }
    ]).then(function(res){
        const roleObject = data.filter(object => object.title === res.newEmployeeRole);
        const managerObject = employeeData.filter(object => `${object.first_name} ${object.last_name}` === res.manager);
        let managerID;
        if(res.manager === "None"){
            managerID = 0
        }
        else{
            managerID = managerObject[0].id;
        }
        connection.query("INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id) VALUES (?, ?, ?, ?, ?)", [res.firstName, res.lastName, roleObject[0].id, roleObject[0].department_id, managerID], function(err, results) {
            if (err) throw err;
            console.log("Employee added.")
        askFunction();
        })
    })
})
})
}

function addRole(){
    connection.query("SELECT * FROM departments", (err, data) => {
        departmentsArray = data.map((object) => object.department)
    console.log(departmentsArray)
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the title of the role you would like to enter:",
            name: "newRoleName"
        },
        {
            type: "input",
            message: "Please enter the salary of the role you would like to enter:",
            name: "newRoleSalary"
        },
        {
            type: "list",
            message: "Please choose the department to which this role belongs:",
            choices: departmentsArray,
            name: "newRoleDept"
        }
    ]).then(function(res){
        const deptObject = data.filter(object => object.department === res.newRoleDept);
        console.log(deptObject)
        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [res.newRoleName, res.newRoleSalary, deptObject[0].id], function(err, results) {
            if (err) throw err;
        console.log(`Role added: ${res}`)
        askFunction();
        })
    })
})
}

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of the department you would like to enter:",
            name: "newDepartment"
        }
    ]).then(function(res){
        connection.query("INSERT INTO departments (department) VALUES (?)", [res.newDepartment], function(err, results) {
            if (err) throw err;
        console.log(`Department added: ${res.newDepartment}`)
        askFunction();
        })
    })
}

function viewEmployees(){
    connection.query("SELECT employees.id, employees.first_name, employees.last_name, title, departments.department, salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees INNER JOIN roles on (role_id = roles.id) INNER JOIN departments on (roles.department_id = departments.id) LEFT JOIN employees m ON m.id = employees.manager_id;", (err, data) => {
        console.table(data)
    askFunction();
    })
}

function viewRoles(){
    connection.query("SELECT roles.id, title, salary, departments.department FROM roles INNER JOIN departments on (department_id = departments.id) ORDER BY roles.id;", (err, data) => {
        console.table(data)
    askFunction();
    })
}

function viewDepartments(){
    connection.query("SELECT * FROM departments ORDER BY departments.id", (err, data) => {
        console.table(data)
        askFunction();
    })
}

function updateRoles(){
    connection.query("SELECT * FROM roles", (err, data) => {
        rolesArray = data.map((object) => object.title);
        const rolesData = data;
        connection.query("SELECT * FROM employees", (err, data) => {
            employeeArray = data.map((object) => `${object.first_name} ${object.last_name}`);
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeeArray,
                    name: "employeeToChangeRole"
                },
                {
                    type: "list",
                    message: "Which role would you like to give this employee?",
                    choices: rolesArray,
                    name: "newRole"
                },
            ]).then(function(res){
                const userUpdateObject = data.filter(object => `${object.first_name} ${object.last_name}` === res.employeeToChangeRole);
                const newRole = rolesData.filter(object => object.title === res.newRole);
                console.log(rolesData)
                // console.log(res.newRole)
                connection.query("UPDATE employees SET role_id = ? WHERE first_name=? AND last_name=?", [newRole[0].id, userUpdateObject[0].first_name, userUpdateObject[0].last_name], function(err, results) {
                    if (err) throw err;
                console.log(`Department added: ${res.newDepartment}`)
                askFunction();
            })
        })
    })
})
}

function updateManager(){
        connection.query("SELECT * FROM employees", (err, data) => {
            employeeArray = data.map((object) => `${object.first_name} ${object.last_name}`);
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee would you like to give a new manager?",
                    choices: employeeArray,
                    name: "employeeToChangeManager"
                },
                {
                    type: "list",
                    message: "Who would you like the new manager to be?",
                    choices: employeeArray,
                    name: "newManager"
                },
            ]).then(function(res){
                const userUpdateManager = data.filter(object => `${object.first_name} ${object.last_name}` === res.employeeToChangeManager);
                const newManager = data.filter(object => `${object.first_name} ${object.last_name}` === res.newManager);
                // console.log(res.newRole)
                connection.query("UPDATE employees SET manager_id = ? WHERE first_name=? AND last_name=?", [newManager[0].id, userUpdateManager[0].first_name, userUpdateManager[0].last_name], function(err, results) {
                    if (err) throw err;
                console.log(`Department added: ${res.newDepartment}`)
                askFunction();
            })
        })
    })
}

function deleteEmployee(){
    console.log("WARNING: You have selected to delete an employee. Please be certain of your actions before you continue.")
    connection.query("SELECT * FROM employees", (err, data) => {
        employeeArray = data.map((object) => `${object.first_name} ${object.last_name}`);
        employeeArray.unshift("CANCEL");
        inquirer.prompt([
            {
                type: "list",
                message: "Select employee to DELETE:",
                choices: employeeArray,
                name: "employeeToDelete"
            },
            {
                type: "confirm",
                message: "CONFIRM DELETION:",
                name: "confirm"
            },
        ]).then(function(res){
            if(res.confirm === false || res.employeeToDelete === "CANCEL"){
                console.log("Deletion cancelled.")
                askFunction();
            }
            else {
            const employeeToDelete = data.filter(object => `${object.first_name} ${object.last_name}` === res.employeeToDelete);
            connection.query("DELETE FROM employees WHERE id = ?", [employeeToDelete[0].id], function(err, results) {
                if (err) throw err;
            console.log(`${employeeToDelete[0].first_name} ${employeeToDelete[0].last_name} has been deleted.`)
            })
            askFunction();
        }
    })
})
}

function deleteRole(){
    console.log("WARNING: You have selected to delete a role. Please be certain of your actions before you continue.")
    connection.query("SELECT * FROM roles", (err, data) => {
        rolesArray = data.map((object) => object.title);
        rolesArray.unshift("CANCEL");
        inquirer.prompt([
            {
                type: "list",
                message: "Select role to DELETE:",
                choices: rolesArray,
                name: "roleToDelete"
            },
            {
                type: "confirm",
                message: "CONFIRM DELETION:",
                name: "confirm"
            },
        ]).then(function(res){
            if(res.confirm === false || res.roleToDelete === "CANCEL"){
                console.log("Deletion cancelled.")
                askFunction();
            }
            else {
            const roleToDelete = data.filter(object => object.title === res.roleToDelete);
            connection.query("DELETE FROM roles WHERE id = ?", [roleToDelete[0].id], function(err, results) {
                if (err) throw err;
            console.log(`${roleToDelete.title} has been deleted.`);
            askFunction();
            })
        }
    })
})
}

function deleteDepartment(){
    console.log("WARNING: You have selected to delete an entire department. Please be extremely certain of your actions before you continue.")
    connection.query("SELECT * FROM departments", (err, data) => {
        departmentsArray = data.map((object) => object.department);
        departmentsArray.unshift("CANCEL");
        inquirer.prompt([
            {
                type: "list",
                message: "Select department to DELETE:",
                choices: departmentsArray,
                name: "deptToDelete"
            },
            {
                type: "confirm",
                message: "CONFIRM DELETION:",
                name: "confirm"
            },
        ]).then(function(res){
            if(res.confirm === false || res.deptToDelete === "CANCEL"){
                console.log("Deletion cancelled.")
                askFunction();
            }
            else {
            const deptToDelete = data.filter(object => object.department === res.deptToDelete);
            connection.query("DELETE FROM departments WHERE id = ?", [deptToDelete[0].id], function(err, results) {
                if (err) throw err;
            console.log(`Department has been deleted.`);
            askFunction();
            })
        }
    })
})
}


function exit(){
    console.log("-------------------------------------------")
    console.log("|                Goodbye!                 |")
    console.log("-------------------------------------------")
    connection.end();
}

