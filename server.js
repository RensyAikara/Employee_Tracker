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
            "View all Employees by Manager",
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

            case "View all Employees by Manager":
                employeesByManager();
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

function allEmployees(){
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function allRoles(){
    connection.query("SELECT * FROM roleTable", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function allDepartments(){
    connection.query("SELECT * FROM roleTable", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// function employeesByDepartment(){

// }

// function employeesByManager(){

// }

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
        start();
      })
}

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
            start();
        })
    })
}

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
            start();
        }
    ) 
}

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
                start();
            })
        })
    })  
}

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
                start();
            })
        })
    })  
}

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
                start();
            })
        })
    })
}

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
        start();
    })
}

function updateEmployeeManager(){

}

// function totalUtilizedBudget(){

// }

function exitProcessing(){
    connection.end();
}