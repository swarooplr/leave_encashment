var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

router.get('/emp/profile',onRequest);

function onRequest(request,response){

	console.log("Got a request for Employee...");

	if(request.session.username){

		mongoClient.connect("mongodb://localhost:27017/msrmh",function(err,db){

			if(err) response.render("login",{message : "We encountered an Error. Please try again."},null);

			console.log(request.session.username);
			db.collection("empdetails").findOne({"_id" : request.session.username},function(err,result){

				if(err) response.render("login",{message : "We encountered an Error. Please try again."},null);

				console.log(result);
				response.render('emp/profile',{"obj" : result},null);

			})

		});

		
	}else{
		response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
	}
	

	console.log(request.session);
	

}
module.exports = router;