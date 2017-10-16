var express = require('express');
var router = express.Router();

router.get('/',onRequest);
router.get('/login',onRequest);


function onRequest(request,response){

	console.log("Got a request for login...");
	response.render('login',{message : ""},null);
}
module.exports = router;