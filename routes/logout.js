var express = require('express');
var router = express.Router();

router.get('/logout',onRequest);


function onRequest(request,response){

	console.log("Got a request for logout...");
	request.session.username = null;
	request.session.password = null;
	request.session.admin = null;
	response.render('login',{message : ""},null);
}
module.exports = router;