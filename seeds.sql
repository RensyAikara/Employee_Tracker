INSERT INTO department (departmentname) VALUES ('HR');
INSERT INTO department (departmentname) VALUES ('IT');
INSERT INTO department (departmentname) VALUES ('Product Development');
INSERT INTO department (departmentname) VALUES ('Accounts and Finance');
INSERT INTO department (departmentname) VALUES ('Sales');

INSERT INTO roleTable (title,salary,department_id) VALUES ('Sales Development Rep', 100000, 5);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Assistant HR Manager.', 100000, 1);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Product Manager', 200000, 3);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Sales Manager', 150000, 5);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Applications Specialist​', 90000, 1);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Technical Architect', 110000, 3);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Business Analyst', 80000, 2);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Network Administrator', 90000, 2);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Financial Accountant', 150000, 4);
INSERT INTO roleTable (title,salary,department_id) VALUES ('Accounts Clerk', 150000, 4);

INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Olivia','Charlotte',1,2);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Ava','Iabella',4,NULL);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Sophia','Mia',2,NULL);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Melissa','Pedro',6,5);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Cory','Ken',3,NULL);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Lucas','Chase',7,5);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Tiffany','Leo',8,3);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Amelia','Kyle',9,3);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Sam','Erik',10,2);
INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Nina','Isaac',5,5);
