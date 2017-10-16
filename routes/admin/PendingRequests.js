/**
 * Created by swaroop on 7/5/2017.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');




//database connection
var mongoose =require('mongoose');
mongoose.connect('localhost:27017/msrmh');

var Schema = mongoose.Schema;
var details=new Schema({
    empId:String,
    applicationDate:String,
    name:String,
    type:String,
    approved:String,
    department:String,
    noLeavesSurrendered:Number,
    leaveBalance:Number,
    report_id:String

});

var requests =new Schema({
    _id:String,
    requestlist:[details],
    acceptedlist:{}

},{collection:'requests'});

var requestData=mongoose.model('requestData',requests);

/////////////

var requestobj=[];



router.get('/',function (request,respond) {

    if(request.session.admin && request.session.username){


        var currentDate =new Date();
        var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();
        

        


        try{
        requestData.findById(idforrequest).then(function (doc) {
            //var obj={"empId":"MH13","applicationDate":"14 9 2014","type":"SL","name":"swaroop","approved":"pending","department":"Doctor","noLeavesSurrendered":30,"leaveBalance":150};

            try{
                console.log(doc.requestlist);
            doc.requestlist.push(obj);doc.save();
                }catch(err){console.log(err.message)}
            if(doc)
            {  console.log("not first request");

            requestobj=doc.requestlist;
               }
            

            respond.render('admin/admin',{data:requestobj,layout:1},null)
        });}
        catch (err){
            console.log(err);
            respond.render('admin/admin',{data:requestobj,layout:1},null)
        }
    }else{
        respond.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
    }
});


router.post('/change',function (request,respond,next) {

    if(request.session.admin && request.session.username){


        var currentDate =new Date();
        var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();


         try{
         requestData.findById(idforrequest).then(function (doc) {

            if(doc)
            requestobj=doc.requestlist;
           

            if(request.body.layoutid==1)
            {
                
                respond.render('admin/admin',{data:requestobj,layout:1},null);
            }
            else
            {
                
                respond.render('admin/admin',{data:requestobj,layout:2},null)
            }
        });}
        catch(err){
            console.log(err);
            respond.render('admin/admin',{data:requestobj,layout:1},null);
        }

    }else{
        respond.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
    }

});

router.post('/getindividualreport',function (request,respond,next) {
    

    if(request.session.admin && request.session.username){

        var i=0;
        var j=0;
        while(i<=request.body.index)                     //this is done so that we get the correct index of unapproved
        {
            if(requestobj[j].approved=="approved")
            {i++;}
            j++;
        }

        var finalindex=j-1;
       

        var currentDate =new Date();
        var idforrequest=(currentDate.getMonth()+1)+" "+ currentDate.getFullYear();

         try{
             requestData.findById(idforrequest).then(function (doc) {
                 
                 report_id=doc.requestlist[finalindex].report_id;
                 respond.download('./pdfs/'+report_id+'.pdf');
                 

             });
         }catch (err){console.log(err);}

         //respond.send(finalindex);
    }else{
        respond.render('login',{message : "Session Timed Out!! Please Login to continue"},null);
    }
});


module.exports = router;
//old logic
/*
 router.post('/submit',function (request,respond,next) {
 console.log(request.body.index);
 for(var i=0;i<requestobj.length;i++)
 {
 console.log(i+requestobj[i]);
 }

 var i=0;
 var j=0;
 while(i<=request.body.index)                     //this is done so that we get the correct index of unapproved
 {
 if(!requestobj[j].approved)
 {i++;}
 j++;
 }


 var finalindex=j-1;
 console.log("finalindex "+finalindex.toString());
 respond.redirect('/requestprocessing/'+requestobj[finalindex].name+'/'+requestobj[finalindex].empId+'/'+finalindex+'/'+requestobj[finalindex].type+'/'+requestobj[finalindex].applicationDate+'/approve');

 });
 */




/*router.get('/download',function (req,res,nesxt) {
 res.sendfile('pdfs/'+EL_encshment_form.form_details_for_EL.report_id+'.pdf');
 });*/
