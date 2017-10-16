var express = require('express');
var router = express.Router();

router.get('/admin/admin',onRequest);

function onRequest(request,response){

	console.log("Got a request for Admin...");

	if(request.session.admin && request.session.username){
		response.render('admin/admin',null,null);
	}else{
		response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
	}
	

	console.log(request.session);
	

}
module.exports = router;