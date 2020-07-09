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
    PRIMARY KEY (id)

);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);
