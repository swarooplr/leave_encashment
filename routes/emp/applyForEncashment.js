var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

router.get('/emp/applyForEncashment',onRequest);

function onRequest(request,response){

	var list = [];
	console.log("Got a request for applyForEncashment...");

	if(request.session.username){

		mongoClient.connect("mongodb://localhost:27017/msrmh",function(err,db){

			if(err) response.render("login",{message : "We encountered an Error. Please try again."},null);

			var date = new Date();
			var val = date.getMonth()+1;
			val += " ";
			val += date.getFullYear();
			db.collection('requests').findOne({"_id" : val},function(err,result){
				if(err) response.render("login",{message : "We encountered an Error. Please try again."},null);

				if(result!=null){

					for(var i=0;i<result.requestlist.length;i++){
						if(result.requestlist[i].empId == request.session.username){
							console.log(result.requestlist[i])
							list.push(result.requestlist[i]);
						}
					}
					console.log("......")
					console.log(list.length)
					console.log(list)
					response.render('emp/applyForEncashment',{"list" : list,"obj" : ""},null);
				}else{
					response.render('emp/applyForEncashment',{"list" : list,"obj" : ""},null);
				}
			})


		})

				
	}else{
		response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
	}
	

	console.log(request.session);
	

}
module.exports = router;