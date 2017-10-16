/**
 * Created by swaroop on 7/5/2017.
 */
var express = require('express');
var fs=require('fs');
var router = express.Router();
var open=require('open');

var EL_encshment_form=require('../encashment_modules/EL_encashment_form');
var Cl_SL_encashment_form=require('../encashment_modules/Cl_Sl_encashment_form');
var ReporDataFiling=require('../encashment_modules/ReportDataFiling');

var mongoose =require('mongoose');
mongoose.connect('localhost:27017/msrmh');


var empName;
var empId;
var typeofleave;
var slnumber;
var dateofapp;
var department;
var noLeavesSurrendered;

var total="*total";
var daa="daa*";
var basepay="basepay*";


//to be filled using personal info
var designation;
var atcredit;
var balance;
var  previousEncashmet;
//

var currentdate;



/////
var Schema = mongoose.Schema;

var details=new Schema({
    empId:String,
    applicationDate:String,
    name:String,
    type:String,
    approved:String,
    department:String,
    noLeavesSurrendered:Number,
    report_id:String
});



var requests =new Schema({
    _id:String,
    requestlist:[details],


},{collection:'requests'});

var requestData=mongoose.model('requestData1',requests);

var empdetails=new Schema({
    _id:String,
    name:String,
    department:String,
    designation:String,
    permanant:Boolean,
    leaveDetails:{}

},{collection:'empdetails'});
var empdetailsdata=mongoose.model('empdetailsdata1',empdetails);
/////



/* GET users listing. */
router.get('/:slno/:daa/:basepay/:approved', function(req, respond, next) {

    slnumber=req.params.slno;

    if(req.params.approved=='rejected')
    {
        var currentDate =new Date();
        var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();

        console.log(req.params.approved+slnumber);
        requestData.findById(idforrequest).then(function (doc) {

            try{
            console.log(idforrequest);
            doc.requestlist[slnumber].approved="rejected";
            doc.save();

            respond.redirect('/admin/admin',null,null);}catch (err){console.log(err)}

        })




        return;
    }


    slnumber=req.params.slno;
    daa=req.params.daa;
    basepay=req.params.basepay;
    total=parseInt(basepay)*(parseInt(daa)/100)+parseInt(basepay);
    total=parseInt(total); //write correct logic

    var currentDate =new Date();
    var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();


    try{
        requestData.findById(idforrequest).then(function (doc) {

            requestobj=doc.requestlist;
            console.log(doc.requestlist.length);

            empName=doc.requestlist[slnumber].name;
            empId=doc.requestlist[slnumber].empId;
            typeofleave=doc.requestlist[slnumber].type;
            dateofapp=doc.requestlist[slnumber].applicationDate;
            department=doc.requestlist[slnumber].department;
            noLeavesSurrendered=doc.requestlist[slnumber].noLeavesSurrendered;

            console.log("info "+typeofleave+" "+daa+"  "+basepay);


            /////****************************

            var currentDate =new Date();
            var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();
            console.log("idofrequest"+idforrequest);
            var fileforreport = typeofleave+empId+idforrequest+empName;

            requestData.findById(idforrequest).then(function (doc) {

                try{

                    doc.requestlist[slnumber].approved="approved";
                    doc.requestlist[slnumber].report_id= fileforreport;

                    doc.save();
                    console.log(doc.requestlist[slnumber]);

                    /*****/
                    //get personal data and assign to following variables

                    //atcredit=150;
                    //balance=120;
                    //previousEncashmet="12 02 2015";
                    //designation="Head nurse";

                    empdetailsdata.findById(empId).then(function (doc) {

                        designation=doc.designation;
                        console.log(designation);
                        console.log(doc);

                        if(typeofleave=='SL')
                        {
                            atcredit=doc.leaveDetails.sl.balance;
                            previousEncashmet=doc.leaveDetails.sl.previousEncashment;
                            balance=atcredit-5;
                            designation=doc.designation;

                            var leaveDetails={
                                sl:{ balance: balance, previousEncashment : dateofapp },
                                cl:{ balance: doc.leaveDetails.cl.balance, previousEncashment : doc.leaveDetails.cl.previousEncashment },
                                el:{ balance: doc.leaveDetails.el.balance, previousEncashment : doc.leaveDetails.el.previousEncashment}
                            }

                            doc.leaveDetails=leaveDetails;
                            doc.save();
                        }
                        else if(typeofleave=='CL')
                        {
                            atcredit=doc.leaveDetails.cl.balance;
                            previousEncashmet=doc.leaveDetails.cl.previousEncashment;
                            balance=atcredit-5;
                            designation=doc.designation;

                            var leaveDetails={
                                sl:{ balance: doc.leaveDetails.sl.balance, previousEncashment : doc.leaveDetails.sl.previousEncashment },
                                cl:{ balance: balance, previousEncashment : dateofapp },
                                el:{ balance: doc.leaveDetails.el.balance, previousEncashment : doc.leaveDetails.el.previousEncashment}
                            }

                            doc.leaveDetails=leaveDetails;
                            doc.save();
                        }
                        else if(typeofleave=='EL')
                        {
                            atcredit=doc.leaveDetails.el.balance;
                            previousEncashmet=doc.leaveDetails.el.previousEncashment;
                            balance=atcredit-30;
                            designation=doc.designation;
                           // doc.leaveDetails.el.balance=balance;
                           // doc.leaveDetails.el.previousEncashment=dateofapp;
                           // doc.save();

                            var leaveDetails={
                                sl:{ balance: doc.leaveDetails.sl.balance, previousEncashment : doc.leaveDetails.sl.previousEncashment },
                                cl:{ balance: doc.leaveDetails.cl.balance, previousEncashment : doc.leaveDetails.cl.previousEncashment },
                                el:{ balance: balance, previousEncashment : dateofapp}
                            }

                            doc.leaveDetails=leaveDetails;
                            doc.save();


                        }

                        ReporDataFiling.writereportdetails(empId,empName,fileforreport,department,designation,dateofapp,slnumber,currentdate,atcredit,noLeavesSurrendered,balance,previousEncashmet,basepay,daa,total,typeofleave);

                        if(typeofleave=='SL') {
                            var id = createpdf_cl_sl(fileforreport,'SL');
                            //respond.redirect('/requestprocessing/download/'+id);
                            setTimeout(function (){
                                respond.download('./pdfs/'+id+'.pdf');




                            },1000);



                        }
                        else if(typeofleave=='CL'){
                            var id = createpdf_cl_sl(fileforreport,'CL');
                            respond.redirect('/requestprocessing/download/'+id);


                        }
                        else
                        {
                            var id = createpdfel(fileforreport);
                            respond.redirect('/requestprocessing/download/'+id);


                        }

                    });




                    /******/

                    // writereportdetails(empId,name,report_id,department,designation,dateofApplication,serialNumber,dateOfReceipt,AtCredit,Surrendered,Balance,previousEncashmet,basicPay,daa,total,type)

                }

                catch(err){"errorloading"+console.log(err.message)

                }

            });


            ////*********************


        });}
    catch(err){console.log(err);}

});

router.get('/download/:reportid',function (req,res,next) {

    setTimeout(function (){
        res.download('./pdfs/'+req.params.reportid+'.pdf');


    },1000);

},function (req,res) {
   return res.send("try to redirect");

});






function createpdfel(idforrequest)
{
    var currentdate = new Date();

    var details={};
    details.report_id=idforrequest ;
    details.name = empName;
    details.Application_date=dateofapp;

    details.empid=empId;
    //hr details
    details.Application_date = dateofapp
    details.Serial_no = slnumber;
    details.EL_at_credit = atcredit;

    details.Basic_pay_date = currentdate.getDate()+"/"+(currentdate.getMonth()+1)+"/"+currentdate.getFullYear();
    details.Basic_pay = basepay;
    details.Da_allowance_rate = daa;
    details.Date_of_receipt = currentdate.getDate()+"/"+(currentdate.getMonth()+1)+"/"+currentdate.getFullYear();
    details.Total_Salary = parseInt(total);
    details.Dearness_allowance = parseInt(basepay)*daa/100;
    details.payment_in_words = inWords(parseInt(total));

    details.EL_at_credit = atcredit;
    details.EL_surrendered = noLeavesSurrendered;
    details.EL_Balance = balance;
    details.Date_of_previous_encashment = previousEncashmet;
    details.designation=designation;
    details.department=department;




    function inWords (num) {

        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    }


    EL_encshment_form.generate_EL_report(details);


    return details.report_id;

}

function createpdf_cl_sl(idforrequest,leavetype)
{
    var currentdate = new Date();

    var details={};
    details.report_id= idforrequest ;
    details.emp_name = empName;
    details.Application_date=dateofapp;

    details.emp_id=empId;
    details.Application_type = leavetype;

    details.Balance_leave = balance;

    details.LOP  =  0;
    details.year = currentdate.getFullYear();
    //console.log(details);


    Cl_SL_encashment_form.generate_SL_CL_report(details);



    return details.report_id;



}






module.exports = router;


//old logic

/*router.post('/submitpay',function (req,res,next) {
    console.log("daa"+req.body.field1);
    console.log("basepay"+req.body.field2);
    daa=req.body.field1;
    basepay=req.body.field2;

    total=parseInt(basepay)+parseInt(basepay);

    res.redirect('/requestprocessing/'+empName+'/'+empId+'/'+slnumber+'/'+typeofleave+'/'+dateofapp+'/paysubmited');
});*/


/*router.post('/requestapproved',function (req,respond,next) {

    //genrate report

    var currentDate =new Date();
    var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();
    console.log("idofrequest"+idforrequest);
    var fileforreport = typeofleave+empId+idforrequest+empName;

    requestData.findById(idforrequest).then(function (doc) {

        try{

            doc.requestlist[slnumber].approved=true;
            doc.requestlist[slnumber].report_id= fileforreport;

            doc.save();
            console.log(doc.requestlist[slnumber]);


            if(typeofleave=='SL') {  //wrong logic
                var id = createpdf_cl_sl(fileforreport,'SL');
                respond.redirect('/requestprocessing/download/'+id);

            }
            else if(typeofleave=='CL'){
                var id = createpdf_cl_sl(fileforreport,'CL');
                respond.redirect('/requestprocessing/download/'+id);
            }
            else
            {
                var id = createpdfel(fileforreport);
                respond.redirect('/requestprocessing/download/'+id);
            }

        }

        catch(err){"errorloading"+console.log(err.message)

        }
        // respond.redirect('/requestprocessing/'+empName+'/'+empId+'/'+slnumber+'/'+typeofleave+'/approved');   //do not redirect
    });

});*/
