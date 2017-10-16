var express = require('express');
var pdfmake = require('pdfmake');
var fs = require('fs');

var form_details_for_EL = {
    report_id:'ELjan232017',
    name:'Yolos',
    Application_date:"25 july 2017",
    designation:'Manager',
    department:'Billing',
    empid:'m0016',
    //hr details
    Serial_no:1,
    EL_at_credit:150,
    Date_of_previous_encashment:'11 jun 2015',
    Basic_pay_date:'23 july 2017',
    Basic_pay:18850,
    Da_allowance_rate:20.40,
    Date_of_receipt:'jun 24 2017',
    payment_in_words:'2 rupees',
    Total_Salary:0,
    Dearness_allowance : 0,

    leave_surrender_count:30,
    EL_surrendered:30,
    EL_Balance : 0
};

//form_details_for_EL.EL_Balance = form_details_for_EL.EL_at_credit - form_details_for_EL.EL_surrendered;

var fonts = {
    Roboto: {
        normal: './src/fonts/Roboto-Regular.ttf',
        bold: './src/fonts/Roboto-Medium.ttf',
        italics: './src/fonts/Roboto-Italic.ttf',
        bolditalics: './src/fonts/Roboto-MediumItalic.ttf'
    }
};

createform = function()
{
    var dd = {
        content: [
            {	image: './src/logo.png',
                alignment : 'left',
                width: 150,
                height: 60

            },
            {text: 'Human Resources Department', style: 'header',alignment:'center',fontSize:'10'},

            {
                style: 'tableExample',
                table: {
                    widths:['*'],
                    body: [
                        [	{text: 'Application for Earned leave Encahment ',alignment:'center',fontSize:'14'}]

                    ]
                }
            },

            {
                style:'tableExample',
                table: {
                    widths:['*','*','*'],
                    body: [
                        [	{text: ' Name : '+ form_details_for_EL.name,fontSize:'10',colSpan:2},{},{text:'Date : '+form_details_for_EL.Application_date,fontSize:'10'}],
                        [	{text: ' Designation : '+form_details_for_EL.designation,fontSize:'10'},{text: ' Department : '+form_details_for_EL.department,fontSize:'10'},{text:'Staff No. : '+form_details_for_EL.empid,fontSize:'10'}]
                    ]
                }
            },

            {text: 'Earned leave surrendered '+form_details_for_EL.EL_surrendered+' days.I declare that i will not avail EL in the month of encashement\n\n\n\n',alignment:'left',fontSize:'12'},

            {text: 'Signature of employee            .',alignment:'right',fontSize:'8'},

            {
                style:'tableExample',
                table: {
                    widths:['*','*'],
                    body: [
                        [   {text: 'For use by H.R Department ',alignment:'center',fontSize:'12',colSpan:2},{}],
                        [	{text: ' No. of Days EL at Credit : '+form_details_for_EL.EL_at_credit,fontSize:'10'},{text:'Serial no. : '+form_details_for_EL.Serial_no,fontSize:'10'}],
                        [	{text: ' No. of days EL Surrendered: '+form_details_for_EL.EL_surrendered,fontSize:'10'},{text: ' Date of Receipt : '+form_details_for_EL.Date_of_receipt,fontSize:'10'}],
                        [	{text: ' No. of Days Balance: '+form_details_for_EL.EL_Balance,fontSize:'10'},{text:'Date of previous encashment : '+form_details_for_EL.Date_of_previous_encashment,fontSize:'10'}],
                        [	{text: ' Base pay as on: '+form_details_for_EL.Basic_pay_date+' Rs.'+form_details_for_EL.Basic_pay,fontSize:'10'},{text: 'Passed for payment of Rs.: '+form_details_for_EL.Total_Salary,fontSize:'10'}],
                        [	{text: ' Dearness allowance :'+form_details_for_EL.Da_allowance_rate+'% ='+' Rs.'+form_details_for_EL.Dearness_allowance,fontSize:'10'},{text:'In words: '+form_details_for_EL.payment_in_words,fontSize:'10',rowSpan:2}],
                        [	{text: ' Total: Rs.'+form_details_for_EL.Total_Salary,fontSize:'10'}]
                    ]
                }
            },
            {text: '\nCertificates', style: 'header',alignment:'center',fontSize:'14'},
            {text: '\n1. Certified that the employees has not enscahed earned leave during the financial year upto this date.',fontSize:'10'},
            {text: '\n2.Certified that the leaves encashed above has been debited to his EL account and entered in Service.',fontSize:'10'},
            {text: '\n3.Cerfitied that the amount encashed has been added to his taxable salary income.',fontSize:'10'},

            {text: '\n\n\nHR Assistant',fontSize:'10'},

            {
                style:'tableExample',
                table: {
                    widths:['*','*'],
                    body: [
                        [	{text: ' H R Assistant',fontSize:'10'},{text:'For use by Finance department: ',fontSize:'10'}],
                        [	{text: '.       Recommended                    Approved\n\n\n\n\n\n\n\n\n',fontSize:'10',rowSpan:4},{text: ' Paid via Cheque no. : ',fontSize:'10'}],
                        [	{text: ''},{text:'Date: ',fontSize:'10'}],
                        [	{text: ''},{text: 'Rs.: ',fontSize:'10'}],
                        [	{text: ''},{text:'Drawn on Canara Bank/Vijaya Bank',fontSize:'10'}],
                        [	{text: 'HR Manager             Sr. Vice President             President',fontSize:'10'},{text:'for Rs.',fontSize:'10'}]
                    ]
                }
            }

        ]
    };
    return dd;

};

function generate_EL_report(formdata){


    form_details_for_EL = formdata;
    //console.log(form_details_for_EL);
     var data  = createform();

    var PdfPrinter = require('../../src/printer.js');
    var printer = new PdfPrinter(fonts);
    var now = new Date();
    var pdfDoc = printer.createPdfKitDocument(data);
    var filepath = 'pdfs/'+form_details_for_EL.report_id+'.pdf';
    fs.closeSync(fs.openSync(filepath, 'w'));
    pdfDoc.pipe(fs.createWriteStream(filepath));
    pdfDoc.end();
}

module.exports.generate_EL_report = generate_EL_report;
//module.exports.form_details_for_EL = form_details_for_EL;