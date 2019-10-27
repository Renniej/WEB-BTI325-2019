const fs = require('fs'); //used for file reading :3
const data_folder = "./data/";

var employees;
var departments;


var exports = module.exports = {};

const Sequelize = require('sequelize');

var sequelize = new Sequelize('dau2md2t2cqd1k', 'ioqpywblpyuzac', '6cf200773d20b91692e0ee471793d64b6f7c1de26e85fcca844db73bd6c99812', {
    host: 'ec2-54-235-163-246.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {ssl: true}});

 sequelize.authenticate().then(()=>console.log('Connection success.')).catch((err)=>console.log("Unable to connect to DB.", err));

 var Employee = sequelize.define('Employee',{

    empNum : {
        
        type: Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true    },
    
    firstName          : Sequelize.STRING,
    lastName           : Sequelize.STRING,
    email              : Sequelize.STRING,
    SSN                : Sequelize.STRING,
    addressStreet      : Sequelize.STRING,
    addressCity        : Sequelize.STRING,
    addressState       : Sequelize.STRING,
    addressPostal      : Sequelize.STRING,
    maritalStatus      : Sequelize.STRING,
    isManager          : Sequelize.BOOLEAN,
    employeeManagerNum : Sequelize.INTEGER,
    status             : Sequelize.STRING,
    department         : Sequelize.INTEGER,
    hireDate           : Sequelize.STRING

 });


 var Department = sequelize.define('Department', {


    departmentId : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    departmentName : Sequelize.STRING

 })

exports.initialize = function(){

    return new Promise(function(resolve, reject){

            sequelize.sync().then(function(){
                console.log("Initialize function was able to sync with database ;3")
                    resolve();

           

            }).catch(function(err){

                reject("Unable to sync data from Initialize :" + err)
            }) 
            
        })
    
    
      


    }

  



 exports.getAllEmployees = function(){


        return new Promise(function(resolve , reject){

            sequelize.sync().then(function(){

                Employee.findAll({order: ['empNum']}).then(function(array_of_emps){

                        resolve(array_of_emps);
                }).catch(function(err){

                    reject("No results or error : " + err)

                })


            }).catch(function(err){
                reject("Sync Error in getAllEmployees ):");
            })
 

        })

}
//test

exports.getEmployees = function(query){

    var condition;
   
    if (query.status !== undefined){

       condition = {status : query.status}
        
    }
    else if(query.department !== undefined){

        condition = {department : query.department};
      
    }
    else if(query.manager !== undefined){

        condition = {hasManager : query.manager};
  
    }
    else if(query.num !== undefined){

        condition = {empNum : query.num }


    }
    

    return new Promise(function(resolve,reject){

            sequelize.sync().then(function(){

                Employee.findAll({where : condition, order : ['empNum']}).then(function(array_of_emps){

                        resolve(array_of_emps);

                }).catch(function(err){
                        reject("No results found for : " +  condition)
                })



            })
          
      
    })


}


exports.getManagers = function(){
    
    var Managers = [];

    return new Promise(function(resolve, reject){

        sequelize.sync().then(function(){

            Employee.findAll({where : {isManager : true}, order : ['empNum']}).then(function(array_of_mangers){

                resolve(array_of_mangers);

            }).catch(function(err){
                reject("No Managers exist or error: " + err)
            })


        }).catch(function(err){

            reject("Something went wrong with sync in getManagers function :" + err )

        })
        



    })


}

exports.getDepartments = function(){


    return new Promise(function(resolve , reject){

        sequelize.sync().then(function(){

            Department.findAll({order : ['departmentId']}).then(function(array_of_depts){

                   //console.log(array_of_depts);
                    resolve(array_of_depts);

            }).catch(function(err){
                        reject("No results found or Error : " + err)
            })



        }).catch(function(err){
            reject("Error with sync in getDepartments ):")
        })
    })

}

exports.addEmployee = function(data){

    return new Promise(function(resolve, reject){

        console.log("add Employee Called");

       


        sequelize.sync().then(function(){

            setAttributesToNull(data); //set emp_array attributes to null if they're empty

            Employee.create({
                //empNum: data.employeeNum,
                firstName : data.firstName,
                lastName : data.lastName,
                email : data.email,
                SSN : data.SSN,
                addressStreet : data.addressStreet,
                addressState: data.addressState,
                addressPostal : data.addressPostal,
                maritalStatus : data.maritalStatus ,
                isManager : data.isManager === null ? false : true,
                employeeManagerNum : data.employeeManagerNum,
                status : data.status,
                department : data.department,
                hireDate : data.hireDate

            }).then(function(newEmp){
                    console.log(newEmp);
                    resolve(newEmp);

            }).catch(function(err){
                reject("Something went wrong with adding a new employe : " + err )
            })

        }).catch(function(error){

            reject("Something went wrong with sync in addEmployee function : " + err)
        })



    })
   
}


 var setAttributesToNull = function(obj){


    console.log(obj);
    for(attribute in obj){

        console.log(attribute);
        if ( (attribute === undefined )  || (attribute == '') || !(attribute)){
            attribute = null
        }  
    }

    

    if (!obj.employeeManagerNum){ //Idk why I need this....
        //console.log("EMPLOYEEMANAGER UNDEFINED ------------------------------")
        obj.employeeManagerNum = null;
    }

    
 }

exports.updateEmployee = function(data){
   
    

    return new Promise(function(resolve, reject){


     sequelize.sync().then(function(){

        setAttributesToNull(data); //set emp_array attributes to null if they're empty

        Employee.update({

            firstName : data.firstName,
            lastName : data.lastName,
            email : data.email,
            SSN : data.SSN,
            addressStreet : data.addressStreet,
            addressState: data.addressState,
            addressPostal : data.addressPostal,
            maritalStatus : data.maritalStatus ,
            isManager : data.isManager === null ? false : true,
            employeeManagerNum : data.employeeManagerNum === undefined ? null : data.employeeManagerNum,
            status : data.status,
            department : data.department,
            hireDate : data.hireDate

        }, {where : {empNum : data.employeeNum}}).then(function(){
            resolve();
        }).catch(function(err){
            reject("Update Employee Function Error : " + err);
        })


     }).catch(function(err){
         reject("Sync error in updateEmployee Function : " + err);
     })
            

        

    })
}



exports.deleteEmployeeByNum = function(data){

        return new Promise(function(resolve, reject){

            sequelize.sync().then(function(){

                Employee.destroy({where : {empNum : data.employeeNum}}).then(function(){
                    resolve();
                }).catch(function(err){
                    reject("Err with delete emp : " + err);
                })


            }).catch(function(err){

                reject("Issue with Sync in  deleteEmpy : " + err)
            })

        })

}


exports.addDepartment = function(data){


    return new Promise(function(resolve, reject){
        
        sequelize.sync().then(function(){

            setAttributesToNull(data);

            Department.create({

                departmentName : data.departmentName

            }).then(function(dept_obj){

                resolve();

            }).catch(function(err){


                reject("Error with Dept Create : " + err);

            })


        }).catch(function(err){
            reject("ERROR : " +  err)
        })
    })
}


exports.updateDepartment = function(data){
    

    return new Promise(function(resolve, reject){

        sequelize.sync().then(function(){

            setAttributesToNull(data);
            console.log(data);
            Department.update({
    
                departmentName : data.departmentName
    
            }, {where : {departmentId : data.departmentId}}).then(function(){
                resolve()
            }).catch(function(err){
                reject("ERROR : " + err);
            })
    
        }).catch(function(err){
    
            reject("Error in update Department Sync : " + err);
        })


    })
    

}


exports.getDepartmentById = function(data){


    return new Promise(function(resolve, reject){

        sequelize.sync().then(function(){

            Department.findAll({where : {departmentId : data.departmentId}}).then(function(dept_obj){

                    resolve(dept_obj[0]);

            }).catch(function(err){

                reject("Error with findAll depts : " + err);

            })

        }).catch(function(err){

            reject("ERROR with sync in getDeptById : " + err);
        })

    })




}
