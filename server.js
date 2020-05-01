var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "rootroot",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});
// Initial query
function start(){
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View all Employees",
            "View all Roles",
            "View all Departments",
            "View all Employees by Department",
            "Add Employee",
            "Add Department",
            "Add Roles",
            "Remove Employee",
            "Remove Roles",
            "Remove Departments",
            "Update Employee Role",
            "Update Employee Manager",
            "View the total utilized budget of a department",
            "Exit"
        ]
    }).then(function(answer){
        switch (answer.action) {
            case "View all Employees":
                allEmployees();
            break;

            case "View all Roles":
                allRoles();
            break;

            case "View all Departments":
                allDepartments();
            break;

            case "View all Employees by Department":
                employeesByDepartment();    
            break;
    
            case "Add Employee":
                addEmployee();    
            break;
    
            case "Add Department":
                addDepartment();    
            break;
    
            case "Add Roles":
                addRoles();        
            break;

            case "Remove Employee":
                removeEmployee();
            break;

            case "Remove Roles":
                removeRole();
            break;

            case "Remove Departments":
                removeDepartments();
            break;

            case "Update Employee Role":
                updateEmployeeRole();    
            break;

            case "Update Employee Manager":
                updateEmployeeManager();
            break;
    
            case "View the total utilized budget of a department":
                totalUtilizedBudget();    
            break;

            case "Exit":
                exitProcessing();    
            break;
        }
    })
}

// function to display all Employees details
function allEmployees(){
    connection.query("SELECT employee.id,employee.first_name,employee.last_name,employee.manager_id,roleTable.title,roleTable.salary,department.departmentname FROM ((employee INNER JOIN roleTable ON employee.role_id = roleTable.id) INNER JOIN department ON department.id = roleTable.department_id)",function(err,res){
        if (err) throw err;
        console.log("All Employees");
        console.table(res);
        start();
    })
}

// function to display all Roles
function allRoles(){
    connection.query("SELECT * FROM roleTable", function(err, res) {
        if (err) throw err;
        console.log("All Roles");
        console.table(res);
        start();
    });
}

//function to display all Departments
function allDepartments(){
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.log("All Departments");
        console.table(res);
        start();
    });
}

// function to display Employees by Department
function employeesByDepartment(){
    connection.query("SELECT departmentname FROM department",function(err,res){
        inquirer.prompt([
            {
                type: "rawlist",
                message: "Select the department",
                name: "deptName",
                choices: function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].departmentname);
                }
                    return choiceArray;
                }
            }
        ]).then(function(data){ 
            connection.query("SELECT id FROM department WHERE ?",{departmentname: data.deptName},function(err,response){
                empByDept(response)
            })
        })
    })

}
function empByDept(response){
    connection.query("SELECT employee.first_name,employee.last_name,employee.role_id,department.departmentname FROM ((employee INNER JOIN roleTable ON employee.role_id = roleTable.id) LEFT JOIN department ON department.id = roleTable.department_id) WHERE department.?",{id: response[0].id},function(err,res){    
        if (err) throw err;
        console.log("Employees by Department");
        console.table(res);
        start();
    })
}

// function to add employee
function addEmployee(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is employee's first name?",
            name: "firstname"
        },
        {
            type: "input",
            message: "What is employee's last name?",
            name: "lastname"
        },
    ]).then(function(answer){
        getRoleNames(answer);    
    })
}
function getRoleNames(data){
    connection.query("SELECT title FROM roleTable",function(err,results){
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawlist",
                message: "What is employee's role?",
                name: "employeeRole",
                choices:function(){
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].title);
                    }
                    return choiceArray;
                }
            }
        ]).then(function(answer){
            connection.query("SELECT id FROM roleTable WHERE ?", {title: answer.employeeRole},function(err,res){
                getManagerNames(data,res)
            })  
        })
    })
}
function getManagerNames(data,answer){
    connection.query("SELECT first_name,last_name FROM employee",function(err,results){
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawlist",
                message: "Who is employee's manager(first name)?",
                name: "managerName",
                choices:function(){
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].first_name);
                    }
                    return choiceArray;
                }
            }
        ]).then(function(newdata){
            connection.query("SELECT id FROM employee WHERE ?", {first_name: newdata.managerName},function(err,res){
                createEmployee(data,answer,res)  
            })
        })
    })
}
function createEmployee(data,answer,res){
    connection.query("INSERT INTO employee SET ?",
    {
        first_name: data.firstname,
        last_name:data.lastname,
        role_id:answer[0].id,
        manager_id:res[0].id
    },function(err) {
        if (err) throw err;
        console.log("Added Employee Successfully");
        start();
      })
}

//function to add Department
function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the Department name?"
        }
    ]).then(function(results){
        connection.query("INSERT INTO department SET ?",
        {
            departmentname: results.name
        },
        function(err){
            if (err) throw err;
            console.log("Added Department Successfully");
            start();
        })
    })
}

//function to add Role
function addRoles(){
    inquirer.prompt([
        {
            name: "roleTitle",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "roleSalary",
            type: "input",
            message: "What is the salary?"
        }    
    ]).then(function(res){
        departName(res);
    })
}
function departName(res){
    connection.query("SELECT * FROM department",function(err,results){  
        if (err) throw err;
        inquirer.prompt([
            {
                name: "deptname",
                type: "rawlist",
                message: "What is the Department name?",
                choices: function(){
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].departmentname);
                }
                    return choiceArray;
                }
            }
        ]).then(function(data){
            connection.query("SELECT id FROM department WHERE ?", {departmentname: data.deptname},function(err,response){
                insertRole(res,response)
            })
        })
    })
}
function insertRole(res,response){
    connection.query("INSERT INTO roleTable SET ?",
        {
            title: res.roleTitle,
            salary: res.roleSalary,
            department_id: response[0].id
        },function(err) {
            if (err) throw err;
            console.log("Added Role Successfully");
            start();
        }
    ) 
}

// function to remove Employee
function removeEmployee(){
    connection.query("SELECT first_name FROM employee",function(err,results){
        inquirer.prompt([
            {
            name: "employeeName",
            type: "rawlist",
            message: "Which employee you want to remove?",
            choices:function(){
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].first_name);
                }
                return choiceArray;
            }
            }
        ]).then(function(data){
            connection.query("DELETE FROM employee WHERE ?", {first_name: data.employeeName},function(err){
                if(err) throw err;
                console.log("Removed Employee Successfully");
                start();
            })
        })
    })  
}

// function to remove Role
function removeRole(){
    connection.query("SELECT title FROM roleTable",function(err,results){
        inquirer.prompt([
            {
            name: "roleName",
            type: "rawlist",
            message: "Which role you want to remove?",
            choices:function(){
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].title);
                }
                return choiceArray;
            }
            }
        ]).then(function(data){
            connection.query("DELETE FROM roleTable WHERE ?", {title: data.roleName},function(err){
                if(err) throw err;
                console.log("Removed Role Successfully");
                start();
            })
        })
    })  
}

// function to remove Department
function removeDepartments(){
    connection.query("SELECT departmentname FROM department",function(err,results){
        inquirer.prompt([
            {
            name: "deptname",
            type: "rawlist",
            message: "Which department you want to remove?",
            choices:function(){
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].departmentname);
                }
                return choiceArray;
            }
            }
        ]).then(function(data){
            connection.query("DELETE FROM department WHERE ?", {departmentname: data.deptname},function(err){
                if(err) throw err;
                console.log("Removed Department Successfully");
                start();
            })
        })
    })
}

// function to update Employee Role
function updateEmployeeRole(){
    connection.query("SELECT first_name FROM employee", function(err,res){
        inquirer.prompt([
            {
                name: "employeeName",
                type: "rawlist",
                message: "Which employee you want to update role?",
                choices:function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;
            }
            }
        ]).then(function(data){
            roleUpdate(data) 
        })
    })
}
function roleUpdate(data){
    connection.query("SELECT title FROM roleTable",function(err,res){
        inquirer.prompt([
            {
                name: "newRole",
                type: "rawlist",
                message: "What is the new role for the employee?",
                choices:function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].title);
                    }
                    return choiceArray;
            }
            }
        ]).then(function(response){
            connection.query("SELECT id FROM roleTable WHERE ?", {title: response.newRole},function(err,res){
                updateRolefunction(data,res);
            })
        })
    })
}
function updateRolefunction(data,res){
    connection.query("UPDATE employee SET ? WHERE ?",
    [
        {
            role_id: res[0].id
        },
        {
            first_name: data.employeeName
        }
    ], function(err){
        if(err) throw err;
        console.log("Updated Employee Role Successfully");
        start();
    })
}

// function to update Employee Manager
function updateEmployeeManager(){
    connection.query("SELECT first_name FROM employee", function(err,res){
        inquirer.prompt([
            {
                name: "employeeName",
                type: "rawlist",
                message: "Which employee you want to update manager?",
                choices:function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;
            }
            }
        ]).then(function(data){
            managerUpdate(data) 
        })
    })
}
function managerUpdate(data){
    connection.query("SELECT first_name FROM employee", function(err,res){
        inquirer.prompt([
            {
                name: "managerName",
                type: "rawlist",
                message: "What is the new managers name?",
                choices:function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;
            }
            }
        ]).then(function(response){
            connection.query("SELECT id FROM employee WHERE ?",{first_name: response.managerName},function(err,answer){
                updateManagerFunction(data,answer)
            })
        })
    })
}
function updateManagerFunction(data,answer){
    connection.query("UPDATE employee SET ? WHERE ?",
    [
        {
            manager_id: answer[0].id
        },
        {
            first_name: data.employeeName
        }
    ], function(err){
        if(err) throw err;
        console.log("Updated Employee manager Successfully");
        start();
    })
}

//function to find total utilized budget in a department
function totalUtilizedBudget(){
    connection.query("SELECT departmentname FROM department",function(err,res){
        inquirer.prompt([
            {
                type: "rawlist",
                message: "Select the department",
                name: "deptName",
                choices: function(){
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].departmentname);
                }
                    return choiceArray;
                }
            }
        ]).then(function(data){
            connection.query("SELECT id FROM department WHERE ?",{departmentname: data.deptName},function(err,response){
                budget(response)
            })
        })
    })

}
function budget(response){
    connection.query("SELECT SUM(salary) FROM (SELECT employee.first_name,employee.last_name,employee.role_id,roleTable.salary,department.departmentname FROM ((employee INNER JOIN roleTable ON employee.role_id = roleTable.id) LEFT JOIN department ON department.id = roleTable.department_id) WHERE department.?) AS newTable",{id: response[0].id},function(err,res){
        console.log("Total Utilized Budget in the department is: ", res[0]["SUM(salary)"]);   
    })
    start();
}

// function to exit
function exitProcessing(){
    connection.end();
}