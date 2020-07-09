var mysql = require("mysql");
var inquirer = require("inquirer");

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
            choices: ["Add item", "View item", "Update item", "Exit"],
            name: "functionType"
        },
    ]).then (function(res){
        if (res.functionType === "Add item") {
            inquirer.prompt([
                {
                    type: "list",
                    message: "What would you like to add?",
                    choices: ["Department", "Role", "Employee"],
                    name: "addType"
                }
            ]).then(function(res){
                if (res.addType === "Department"){
                    addDepartment();
                }
                else if (res.addType === "Role"){
                    addRole();
                }
                else if (res.addType === "Employee"){
                    addEmployee();
                }
            })
        }
        else if (res.functionType === "Exit"){
            exit()
        }
    })
}

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the name of the department you would like to enter:",
            name: "newRole"
        }
    ]).then(function(res){
        connection.query(`INSERT INTO departments (name) VALUES ("${res.newDepartment}");`, function(err, results) {
            if (err) throw err;
        console.log("Department added.")
        askFunction();
        })
    })
}

function addRole(){
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
            message: "Please choose the department to which this employee belongs:",
            choices: [0],
            name: "newRoleDept"
        }
    ]).then(function(res){
        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${res.newRoleName}", "${res.newRoleSalary}", "${res.newRoleDept}");`, function(err, results) {
            if (err) throw err;
        console.log("Role added")
        askFunction();
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