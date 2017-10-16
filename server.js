var express = require('express');
var http = require('http');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');




var login = require('./routes/login');
var validate = require('./routes/validate');
var logout = require('./routes/logout');

var admin = require('./routes/admin/PendingRequests');
var generateReports = require('./routes/admin/generateReports');
var upload = require('./routes/admin/upload');
var processupload = require('./routes/admin/processupload');
var report = require('./routes/admin/report');
var RequestProcessing=require('./routes/admin/RequestProcessing');



var profile = require('./routes/emp/profile');
var applyForEncashment = require('./routes/emp/applyForEncashment');
var verifyEncashment  = require('./routes/emp/verifyEncashment');

var app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(3000);
console.log("Server is running....");

var session = require('express-session');
app.use(session({secret : "BlackPearl", resave : true, saveUninitialized : true}));

app.get('/',login);
app.get('/login/',login);
app.post('/validate',validate);
app.get('/logout',logout);


//app.post('/admin/admin/change',admin)
app.use('/admin/admin',admin);
app.get('/admin/generateReports',generateReports);
app.get('/admin/upload',upload);
app.post('/admin/processupload',processupload);
app.post('/admin/report',report);
app.use('/requestprocessing',RequestProcessing);



app.get('/emp/profile',profile);
app.get('/emp/applyForEncashment',applyForEncashment);
app.get('/emp/verifyEncashment/:type',verifyEncashment);
