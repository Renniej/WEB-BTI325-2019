var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var exports = module.exports = {};

var userSchema =  new Schema({

    "userName"     : {"type" : String,
                      "unique" : true },

    "password"     : String,

    "email"        : String,

    "loginHistory" : [{  "dateTime" : Date,
                        "userAgent" : String
                      }]

});

let User = mongoose.model("User", userSchema);

function isEmptyOrSpaces(str){ //From stackoverflow: https://stackoverflow.com/questions/10232366/how-to-check-if-a-variable-is-null-or-empty-string-or-all-whitespace-in-javascri
    return str === null || str.match(/^ *$/) !== null;
}

exports.initialize = function(){

    return new Promise(function(resolve, reject){

        let db = mongoose.createConnection("mongodb+srv://Rennie:123@senecaweb-dojoo.mongodb.net/BTI325_A6?retryWrites=true&w=majority"); //connect to database

        db.on('error', function(err){ //Check for connection error
            reject("Mongo DB Database connection error");
        })

        db.once('open', function(){ //Check for connection success

            //if sucessful then add Users????
            db.model("Users", userSchema);
            resolve("Database connection Successful");

        })

    })
  

};

exports.registerUser = function(userData){

    let errMsgs = [];
    let newUser;

    return new Promise(function(resolve,reject){

        //Do validation check of userData params
        console.log("Register User Called");

        console.log(userData);
        //Password Validation
        if (isEmptyOrSpaces(userData.password)){ //Checks for null, undefined, 0, 000, "", False (Got from stackoverflow : https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript)
                errMsgs.push("Password 1 cannot be empty or only white spaces!");
        }

        if (isEmptyOrSpaces(userData.password2)){ //Checks for null, undefined, 0, 000, "", False (Got from stackoverflow : https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript)
            errMsgs.push("Password 2 cannot be empty or only white spaces!");
        }

        if (userData.password != userData.password2){
            errMsgs.push("Passwords must match!")
        }

        //Username Validation
        if (isEmptyOrSpaces(userData.userName)){ //Checks for null, undefined, 0, 000, "", False (Got from stackoverflow : https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript)
                errMsgs.push("Username cannot be empty or only white spaces!");
        }
        

        //User creation :)
        if (errMsgs.length > 0){
            reject(errMsgs);
        }
        else{
              
            console.log("No errors with registration page :)");
            newUser = new User(userData);
            console.log("New user created ");

            newUser.save().then(function(){
                console.log("Calling resolve");
                resolve();
                
            }).catch(function(err){

                console.log ("Error in db save");
                
                if (err){
                    console.log("Error with saving to db");
                    if (err.code === 11000){ //if the username is already taken :)
                        errMsgs.push("Username is taken;");
                        reject(errMsgs);
                    }
                    else{
                        errMsgs.push("There was an error creating the user : " + userData.userName);
                        reject(errMsgs);
                    }

                }
            });


  
        }

    })
}



exports.checkUser = function(userData){

    return new Promise(function(resolve,reject){

        User.findOne({userName : userData.userName}).exec().then(function(user){

            if (user){

                if (user.password != userData.password)
                    reject("Passwords do not match ): ");
                else{ 
                    //Update login history

                    //"loginHistory" : [{  "dateTime" : Date,
                    //"userAgent" : String
                    // }]
                    user.loginHistory.push({dataTime : new Date().toString(), userAgent : userData.userAgent});
                  
                    user.updateOne({userName : user.userName},  { $set: {loginHistory: user.loginHistory}}, 
                        { multi: false}).exec().then(function(){

                            resolve(user);

                        }).catch(function(err){
                                reject("There was an error verifying the user : " + err);
                        })

                    resolve();
                }


            }
            else
                reject( userData.userName + " was not found in the database ):");


        }).catch(function(err){


                reject("Unable to find user : " + userData.userName);

        });

    })

  


}