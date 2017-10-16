var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
//var mysql = require('mysql');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

router.use(bodyparser.urlencoded({ extended: false }));
router.post('/validate',function(request,response){
	console.log("Got a request for validate....");
	

//
	
	var login = false;
	var isAdmin = false;


	try{
		mongoClient.connect("mongodb://localhost:27017/msrmh",function(err,db){

			if(err) response.render("login",{message : "We encountered an Error. Please try again."},null);

			db.collection("userlogin").findOne({"_id" : request.body.username },function(err,result){
				if(err) response.render("login",{message : "We encountered an Error. Please try again."},null);

				if(!result){
					response.render("login",{message : "Invalid username. Please try again."},null);
				}
				else{

					if(result.password === request.body.password){
						login=true;
						isAdmin = result.admin;
						
					}

					if(login){
						request.session.username=request.body.username;
						request.session.password=request.body.password;
						request.session.admin=false;
						if(request.body.admin == "true"){
							if(isAdmin){
								request.session.admin=true;
								response.redirect(303,"/admin/admin");	
							}
							else{
								response.render("login",{message : "Sorry, You Dont have admin privilage."},null);
							}
						}
						else
							response.redirect(303,"/emp/profile");
					}
					else
						response.render("login",{message : "Invalid username or password. Please try again."},null);
				}
				
				console.log(result);
				
			})


		})
	}
	catch(e){
		response.render("login",{message : "We encountered an Error. Please try again."},null);
	}

	



//

/*
	var con = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'mysql',
		database : 'leaveEncashment'
	});

	var login = false;
	var isAdmin = false;
console.log(request.body);

	con.connect(function(err){
		if(err)
			throw err;
		console.log("connected to database");

		var q = "Select * from users where username like ? ";
		con.query(q,[request.body.username],function(err,result,fields){
			if(err)
				throw err;
			
			if(!result.length){
				response.render("login",{message : "Invalid username. Please try again."},null);
			}
			else{
				console.log(result[0].username)
				if(result[0].password === request.body.password){
					login=true;
					isAdmin = result[0].admin;
					
				}
			


				if(login){
					request.session.username=request.body.username;
					request.session.password=request.body.password;
					request.session.admin=false;

					if(request.body.admin){
						if(isAdmin){
							request.session.admin=true;
							response.redirect(303,"admin/admin");	
						}
						else{
							response.render("login",{message : "Sorry, You Dont have admin privilage."},null);
						}
					}
					else
						response.redirect(303,"emp/emp");
				}
				else
					response.render("login",{message : "Invalid username or password. Please try again."},null);
			}

		})

	
	})

*/


});

module.exports = router;