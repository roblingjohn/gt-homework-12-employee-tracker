DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2),
    department_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES (departments.id)

);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    department_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES (roles.id),
    FOREIGN KEY (department_id) REFERENCES (departments.id)
);

SELECT * FROM employees;
