var express = require('express');
var formidable = require('formidable');

var router = express.Router();

router.post('/admin/processupload',onRequest);

var empid;
var password;
var admin=false;
var name;
var department;
var designation;
var permanant=true;
var clbalance;
var clpreviousechashment;
var slbalance;
var slpreviousechashment;
var elbalance;
var elpreviousechashment;
var lop;


var mongoose =require('mongoose');
mongoose.connect('localhost:27017/msrmh');

var Schema=mongoose.Schema;

var userlogin=new Schema({
    _id:String,
    password:String,
    admin:Boolean
},{collection:'userlogin'});

var userlogindata=mongoose.model('userlogindata',userlogin);

var eachleavedetails=new Schema({

});

var empdetails=new Schema({
    _id:String,
    name:String,
    department:String,
    designation:String,
    permanant:Boolean,
    leaveDetails:{}

},{collection:'empdetails'});
var empdetailsdata=mongoose.model('empdetailsdata',empdetails);




function onRequest(request,res) {

    console.log("Got a request for Processing...");
    if (request.session.admin && request.session.username) {
        var form = new formidable.IncomingForm();

        form.parse(request);
        form.on('fileBegin', function (name, file){
            file.path = './uploads/' + file.name;
            process();
            res.render('admin/upload',{alertreq:true},null);

        });
    }
}

function process(){
    const csvFilePath='./uploads/empdetails.csv';
    const csv=require('csvtojson')
    csv()
        .fromFile(csvFilePath)
        .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
            //console.log(jsonArrayObj);// write to data base here


           writetodatabase(jsonArrayObj);


        })

}

function writetodatabase(data)
{
    var i;
    var emp;
    for(i=0;i<data.length;i++)
    {

        (function() {
            emp = data[i];

            var empid = emp.id;
            var password = emp.password;
            var admin = false;
            var name = emp.name;
            var department = emp.department;
            var designation = emp.designation;
            var permanant = true;
            var clbalance = emp.clbalance;
            var clpreviousechashment = emp.clpreviousencashment;
            var slbalance = emp.slbalance;
            var slpreviousechashment = emp.slpreviousencashment;
            var elbalance = emp.elbalance;
            var elpreviousechashment = emp.elpreviousencashment;
            var lop = emp.lop;

            console.log(emp);

            try {

                userlogindata.findById(empid).then(function (doc) {

                    if (doc) {
                        console.log(password);
                        doc.password = password;
                        doc.save();

                    }
                    else {
                        var x = new userlogindata({_id: empid, password: password, admin: admin});
                        x.save();

                    }


                });


                //var x=new userlogindata({_id:empid,password:password,admin:admin});
                //x.save();

                
                empdetailsdata.findById(empid).then(function (doc) {

                    if(doc)
                    {

                        if(password)
                        doc.password=password;
                       
                        if(name)
                        doc.name=name;
                        
                        if(department)
                        doc.department=department;
                        
                        if(designation)
                        doc.designation=designation;

                        if(lop)
                            doc.lop=lop;
                        


                        if(elpreviousechashment && slbalance && clbalance && elbalance)
                        {var leaveDetails={
                            sl:{ balance: slbalance, previousEncashment : slpreviousechashment },
                            cl:{ balance: clbalance, previousEncashment : clpreviousechashment },
                            el:{ balance: elbalance, previousEncashment : elpreviousechashment }

                        }
                        doc.leaveDetails=leaveDetails;}
                        else if(slbalance && clbalance && elbalance)
                        {
                            console.log(doc.leaveDetails.el.balance);
                            var leaveDetails={
                                sl:{ balance: slbalance, previousEncashment : doc.leaveDetails.sl.previousEncashment },
                                cl:{ balance: clbalance, previousEncashment : doc.leaveDetails.cl.previousEncashment },
                                el:{ balance: elbalance, previousEncashment : doc.leaveDetails.el.previousEncashment }
                            }
                            doc.leaveDetails=leaveDetails;
                        }


                        
                        doc.save();
                        
                        
                    }
                    else{
                    var leaveDetails={
                        sl:{ balance: slbalance, previousEncashment : slpreviousechashment },
                        cl:{ balance: clbalance, previousEncashment : clpreviousechashment },
                        el:{ balance: elbalance, previousEncashment : elpreviousechashment }
                    }

                    var y=new empdetailsdata({ _id : empid, name : name, department : department, designation : designation, permanant : permanant, leaveDetails : leaveDetails,lop:lop});
                    y.save(function (err) {
                        if(err)
                            console.log(err);
                        else
                            console.log("succces");
                    });}
                })

                 


            } catch (err) {
                console.log(err);
            }

        })();
    }



}

/* csv format ----------
file name: empdetails

 id ,name,designation,department,status,LOP,SL,EL,CL,Last
 emp1,jan,billing,accounts,permanent,5,10,30,10,11/12/2017
 emp2,feb,nursing,accounts,permanent,10,20,40,20,11/13/2017
 emp3,mar,billing,accounts,permanent,15,30,50,30,11/14/2017
 emp4,apr,nursing,accounts,permanent,20,40,60,40,11/15/2017
 emp5,may,billing,accounts,permanent,25,50,70,50,11/16/2017
 emp6,jun,nursing,accounts,permanent,30,60,80,60,11/17/2017
 emp7,jul,billing,accounts,permanent,35,70,90,70,11/18/2017
 emp8,aug,nursing,accounts,permanent,40,80,100,80,11/19/2017
 emp9,sep,billing,accounts,permanent,45,90,110,90,11/20/2017
 emp10,oct,nursing,accounts,permanent,50,100,120,100,11/21/2017
 emp11,nov,billing,accounts,permanent,55,110,130,110,11/22/2017
 emp12,dec,nursing,accounts,permanent,60,120,140,120,11/23/2017

 */

module.exports = router;
