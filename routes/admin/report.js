var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

var bodyparser = require('body-parser');
router.use(bodyparser.urlencoded({ extended: false }));

var json2xls = require('json2xls');
router.use(json2xls.middleware);

var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

router.post('/admin/report',onRequest);

function onRequest(request,response){

    console.log("Got a request for Financial Report...");


    if(request.session.admin && request.session.username){

        mongoClient.connect("mongodb://localhost:27017/msrmh",function(err,db){

            if(err) response.render("login",{message : "We encountered an Error. Please try again."+err},null);;

            var str = request.body.date;
            var dateArr = str.split(" ");

            var fname = ""
            db.collection('reports').findOne({"_id" : parseInt(dateArr[1])},function(er,result){
                if(er) response.render("login",{message : "We encountered an Error. Please try again."+err},null);;


                console.log(request.body.type)
                switch(request.body.type){
                    case 'EL' : key = "el"+dateArr[0] ;
                        fname += "Report_EL_"+dateArr[0]+"_"+dateArr[1]+"_";
                        break;
                    case 'SL' : key = "sl" ;
                        fname += "Report_SL_"+dateArr[0]+"_"+dateArr[1]+"_";
                        break;
                    case 'CL' : key = "cl" ;
                        fname += "Report_CL_"+dateArr[0]+"_"+dateArr[1]+"_";
                        break;
                }
                console.log(result);
                var jsonArr = [];


                for(var i=0;i<result[key].length;i++){
                    var obj = {};
                    var leaveType;
                    var noOfLeavesSurrendered;

                    if(request.body.format == '1'){
                        fname += "Format-1"
                        switch(request.body.type){
                            case 'EL' : leaveType = "Earned Leave";
                                noOfLeavesSurrendered = result[key][i].elSurrendered;
                                break;
                            case 'CL' : leaveType = "Casual Leave Annual";
                                noOfLeavesSurrendered = result[key][i].clSurrendered;
                                break;
                            case 'SL' : leaveType = "Sick Leave Annual";
                                noOfLeavesSurrendered = result[key][i].slSurrendered;
                                break;
                        }
                        obj["SlNo"] = result[key][i].serialNumber;
                        obj.StaffNo = result[key][i].empId;
                        obj.Name = result[key][i].name;
                        obj.Department = result[key][i].department;
                        obj.TypeOfLeave = leaveType;
                        obj.NumberOfLeavesSurrendered = noOfLeavesSurrendered;
                        obj.TotalAmount = result[key][i].total;
                    }else{
                        fname += "Format-2"
                        switch(request.body.type){
                            case 'EL' : leaveType = "Earned Leave";
                                noOfLeavesSurrendered = result[key][i].elSurrendered;
                                break;
                            case 'CL' : leaveType = "Casual Leave Annual";
                                noOfLeavesSurrendered = result[key][i].elSurrendered;
                                break;
                            case 'SL' : leaveType = "Sick Leave Annual";
                                noOfLeavesSurrendered = result[key][i].elSurrendered;
                                break;
                        }
                        obj["Employee No"] = result[key][i].empId;
                        obj["Leavetypecategory"] = leaveType
                        obj["Fromdate"] = result[key][i].dateOfApplication;
                        var dateStr = ""
                        var tmp = result[key][i].dateOfApplication.split(" ");
                        dateStr += tmp[0]+"-"+months[parseInt(tmp[1])-1]+"-"+tmp[2];
                        obj["todate"] = dateStr
                        obj["days"] = dateStr;
                        obj["Leave transaction type"] = "Encashed";
                    }
                    jsonArr.push(obj);
                }

                if(result[key].length == 0){
                    var obj={};
                    if(request.body.format == '1'){
                        fname += "Format-1"
                        obj["SlNo"] = ""
                        obj.StaffNo = ""
                        obj.Name = ""
                        obj.Department = ""
                        obj.TypeOfLeave = ""
                        obj.NumberOfLeavesSurrendered = ""
                        obj.TotalAmount = ""
                    }
                    else{
                        fname += "Format-2"
                        obj["Employee No"] = ""
                        obj["Leavetypecategory"] = ""
                        obj["Fromdate"] = ""
                        obj["todate"] =""
                        obj["days"] = ""
                        obj["Leave transaction type"] = ""
                    }
                    jsonArr.push(obj);
                }

                console.log("............... JsonArr ..............")
                console.log(jsonArr)
                response.xls(fname+".xlsx",jsonArr);
                //response.redirect('/admin/generateReports',null,null);

            })

        })

    }else{
        response.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
    }


    console.log(request.session);


}
module.exports = router;