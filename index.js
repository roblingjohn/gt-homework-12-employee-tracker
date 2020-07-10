var mysql = require("mysql");
var inquirer = require("inquirer");

let departmentsArray = [];

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Godawgs!11",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    askFunction();
});

function askFunction(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                        "Add employee",
                        "Add role",
                        "Add department",
                        "View employees",
                        "View roles",
                        "View departments",
                        "Update roles",
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
            case "Update roles":
                updateRoles();
                break;
            case "Exit":
                exit();
                break;
            default:
                console.log("You should not see this.")
            
        }
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
        connection.query("INSERT INTO departments (name) VALUES (?)", [res.newDepartment], function(err, results) {
            if (err) throw err;
        console.log(`Department added: ${res.newDepartment}`)
        askFunction();
        })
    })
}

function addRole(){
    connection.query("SELECT * FROM departments", (err, data) => {
        departmentsArray = data.map((object) => object.name)
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
        const deptObject = data.filter(object => object.name === res.newRoleDept);
        console.log(deptObject)
        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${res.newRoleName}", "${res.newRoleSalary}", "${deptObject[0].id}");`, function(err, results) {
            if (err) throw err;
        console.log(`Role added: ${res}`)
        askFunction();
        })
    })
})
}

function addEmployee(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of the employee you would like to enter:",
            name: "newEmployeeName"
        }
    ]).then(function(res){
        connection.query(`INSERT INTO roles (name) VALUES ("${res.newEmployeeName}");`, function(err, results) {
            if (err) throw err;
            console.log("Employee added.")
        askFunction();
        })
    })
}

function exit(){
    connection.end();
}