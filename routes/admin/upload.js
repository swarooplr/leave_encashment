var express = require('express');
var formidable = require('formidable');

var router = express.Router();

router.get('/admin/upload',onRequest);

function onRequest(request,response){

    console.log("Got a request for Admin...");

    if(request.session.admin && request.session.username){
        response.render('admin/upload',{alertreq:false},null);

    }else{
        response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
    }


    console.log(request.session);

}

/*

router.post('/admin/upload',function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.parse(req);
    form.on('fileBegin', function (name, file){
        file.path = './uploads/' + file.name;
        process();
        res.end();
    });

});

*/
module.exports = router;