INSERT INTO departments (department)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2), ("Software Engineer", 80000, 2),  ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Accountant", 125000, 3), ("Lawyer", 90000, 4), ("Paralegal", 45000, 4);

INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id)
VALUES ("Brett", "Bretterson", 1, 2, 0), ("Ollie", "Tabooger", 2, 2, 1), ("Amanda", "Huggenkiss", 3, 1, 0), ("Bob", "Smith", 4, 3, 3), ("Dewey", "Cheatham", 5, 3, 0), ("Everrett", "McGill", 6, 4, 0), ("Persephone", "Malachi-Constantinople", 7, 4, 6);
SELECT * FROM employees ORDER BY employees.id;
;