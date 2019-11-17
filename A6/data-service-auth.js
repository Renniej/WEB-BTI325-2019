var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var exports = module.exports = {};

var userSchema = new Schema = new Schema({

    "userName"     : {"type" : String,
                      "unique" : true },

    "password"     : String,

    "email"        : String,

    "loginHistory" : [{  "dateTime" : Date,
                        "userAgent" : String
                      }]

});

let User = mongoose.model("User", userSchema);


var initialize = function(){

    return new Promise(function(resolve, reject){

        let db = mongoose.createConnection("/mongodb+srv://Rennie:123@senecaweb-dojoo.mongodb.net/test?retryWrites=true&w=majority"); //connect to database

        db.on('error', function(err){ //Check for connection error
            reject("Database connection error");
        })

        db.once('open', function(){ //Check for connection success

            //if sucessful then add Users????
            db.model("Users", User);
            resolve("Database connection Successful");

        })

    })
  

};

exports.registerUser = function(userData){

    let errMsgs = [];
    let newUser;

    return new Promise(function(resolve,reject){

        //Do validation check of userData params

        //Password Validation
        if (!!userData.password){ //Checks for null, undefined, 0, 000, "", False (Got from stackoverflow : https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript)
                errMsgs.push("Password 1 cannot be empty or only white spaces!");
        }

        if (!!userData.password2){ //Checks for null, undefined, 0, 000, "", False (Got from stackoverflow : https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript)
            errMsgs.push("Password 2 cannot be empty or only white spaces!");
        }

        if (userData.password != userData.password2){
            errMsgs.push("Passwords must match!")
        }

        //Username Validation
        if (!!userData.userName){ //Checks for null, undefined, 0, 000, "", False (Got from stackoverflow : https://stackoverflow.com/questions/154059/how-to-check-empty-undefined-null-string-in-javascript)
                errMsgs.push("Username cannot be empty or only white spaces!");
        }
        

        //User creation :)
        if (errMsgs.length > 0){
            reject(errMsgs);
        }
        else{

            newUser = new User(userData);
            newUser.save(function(err, user){

                if (err){

                    if (err.code === 11000){ //if the username is already taken :)
                        errMsgs.push("Username is taken;");
                        reject(errMsgs);
                    }
                    else{
                        errMsgs.push("There was an error creating the user : " + userData.userName);
                        reject(errMsgs);
                    }

                }
                else
                    resolve();

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
                else{ //Update login history

                    //"loginHistory" : [{  "dateTime" : Date,
                    //"userAgent" : String
                 // }]
                    user.loginHistory.push({dataTime : new Date().toString(), userAgent : userData.userAgent});
                    user.updateOne({userName : user.userName}, {$set : {} } )

                    resolve();
                }


            }
            else
                reject( userData.userName + " was not found in the database ):");


        }).catch(function(err){


                reject("There was an error vertifying the user : " + err);

        });

    })

  


}