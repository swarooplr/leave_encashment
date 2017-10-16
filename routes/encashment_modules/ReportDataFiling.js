/**
 * Created by swaroop on 7/14/2017.
 */

var mongoose =require('mongoose');
mongoose.connect('localhost:27017/msrmh');
var Schema = mongoose.Schema;

var eachReportDetailsEL=new Schema({
    empId:String,
    name:String,
    department:String,
    report_id:String,
    designation:String,
    dateOfApplication:String,
    serialNumber:Number,
    dateOfReceipt:String,
    elAtCredit:Number,
    elSurrendered:Number,
    elBalance:Number,
    previousEncashment:String,
    basicPay:Number,
    daa:Number,
    total:Number
});

var eachReportDetailsSL=new Schema({
    empId:String,
    name:String,
    department:String,
    report_id:String,
    designation:String,
    dateOfApplication:String,
    serialNumber:Number,
    dateOfReceipt:String,
    slAtCredit:Number,
    slSurrendered:Number,
    slBalance:Number,
    previousEncashment:String,
    basicPay:Number,
    daa:Number,
    total:Number
});

var eachReportDetailsCL=new Schema({
    empId:String,
    name:String,
    department:String,
    report_id:String,
    designation:String,
    dateOfApplication:String,
    serialNumber:Number,
    dateOfReceipt:String,
    clAtCredit:Number,
    clSurrendered:Number,
    clBalance:Number,
    previousEncashment:String,
    basicPay:Number,
    daa:Number,
    total:Number
});


var allreports=new Schema({
    _id:Number,
    sl:[eachReportDetailsSL],
    cl:[eachReportDetailsCL],
    el01:[eachReportDetailsEL],
    el02:[eachReportDetailsEL],
    el03:[eachReportDetailsEL],
    el04:[eachReportDetailsEL],
    el05:[eachReportDetailsEL],
    el06:[eachReportDetailsEL],
    el07:[eachReportDetailsEL],
    el08:[eachReportDetailsEL],
    el09:[eachReportDetailsEL],
    el10:[eachReportDetailsEL],
    el11:[eachReportDetailsEL],
    el12:[eachReportDetailsEL],

},{collection:'reports'});

var reportdata=mongoose.model('reportdata',allreports);

function writereportdetails(empId,name,report_id,department,designation,dateofApplication,serialNumber,dateOfReceipt,AtCredit,Surrendered,Balance,previousEncashmet,basicPay,daa,total,type)
{

    var report={};

    report.empId=empId;
    report.name=name;
    report.report_id=report_id;
    report.department=department;
    report.designation=designation;
    report.dateOfApplication=dateofApplication;
    report.serialNumber=serialNumber;
    report.dateOfReceipt=dateOfReceipt;
    report.previousEncashment=previousEncashmet;
    report.basicPay=basicPay;
    report.daa=daa;
    report.total=total;

    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;

    if(month<9)
    var key="el"+"0"+month;
    else
        var key ="el"+month;

    console.log(key);

    if(type=='SL')
    {
        report.slAtCredit=AtCredit;
        report.slSurrendered=Surrendered;
        report.slBalance=Balance;

        reportdata.findById(year).then(function (doc) {
             doc["sl"].push(report);
             doc.save();
            console.log(doc);
        });


    }
    else if(type=='CL')
    {
        report.clAtCredit=AtCredit;
        report.clSurrendered=Surrendered;
        report.clBalance=Balance;

        reportdata.findById(year).then(function (doc) {
            doc["cl"].push(report);
            doc.save();
            console.log(doc);
        });

    }
    else if(type=='EL')
    {
        report.elAtCredit=AtCredit;
        report.elSurrendered=Surrendered;
        report.elBalance=Balance;

        reportdata.findById(year).then(function (doc) {
            doc[key].push(report);
            doc.save();
            console.log(doc);
        });

    }



}

module.exports.writereportdetails = writereportdetails;