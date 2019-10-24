const fs = require('fs'); //used for file reading :3
const data_folder = "./data/";

var employees;
var departments;
var exports = module.exports = {};

exports.initialize = function(){

    return new Promise(function(resolve, reject){

        fs.readFile(data_folder + "employees.json", function(err, data){

            if (err) reject(err)

            else{
            employees = JSON.parse(data);
            console.log("Employees file sucessfully opened and parsed");      
            
                fs.readFile(data_folder + "departments.json", function(err, data){
        
                    if (err) reject(err)
                    else
                    departments = JSON.parse(data);
                    console.log("Departments file sucessfully opened and parsed");
                    resolve("ALL FILES SUCCESFULLY READ");
                })
            }

        })
    
    
      


    })
  

}

 exports.getAllEmployees = function(){


        return new Promise(function(resolve , reject){

            if (employees.length != 0)
            resolve(employees);
            else
            reject("It seems we have no employees ):");

        })

}

exports.getManagers = function(){
    
    var Managers = [];

    return new Promise(function(resolve, reject){


     if (employees.length != 0)
        for (let i = 0; i < employees.length; i++){
            if (employees[i].isManager == true)
            Managers.push(employees[i])
        }
    else {
        reject("Employees array is empty... sorry pal");

   
    }
    if (Managers.length != 0){

        resolve(Managers);

    }
    else{
        reject("No managers exist... ")
    }



    })


}

exports.getDepartments = function(){


    return new Promise(function(resolve , reject){

        if (departments.length != 0)
        resolve(departments);
        else
        reject("WE HAVE NO DEPARTMENTS!");

    })

}
