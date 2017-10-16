/**
 * Created by Roopak on 7/8/2017.
 */

var express = require('express');
var pdfmake = require('pdfmake');
var fs = require('fs');

var form_details_for_sl_cl = {
    report_id:'sl',
    Application_type:'SL',
    Application_date:'25 jun 2017',
    emp_id:'m1390d',
    emp_name:'lolz',
    Balance_leave : 22,
    LOP : 0,
    year : 2017
};

var fonts = {
    Roboto: {
        normal: './src/fonts/Roboto-Regular.ttf',
        bold: './src/fonts/Roboto-Medium.ttf',
        italics: './src/fonts/Roboto-Italic.ttf',
        bolditalics: './src/fonts/Roboto-MediumItalic.ttf'
    }
};

createform11 = function () {
    var dd1 = {
        content: [
            {	image: './src/logo.png',
                alignment : 'left',
                width: 150,
                height: 60

            },
            {text: '\nHuman Resources Department', style: 'header',alignment:'center',fontSize:'14',bold:true},
            {text: 'Date : '+form_details_for_sl_cl.Application_date, style: 'header',alignment:'right',fontSize:'12'},
            {text: 'To,\nHR Manager\nHR Department\n\nSir/Madam,',fontSize:'12'},
            {text: '\nSub: '+form_details_for_sl_cl.Application_type+' Encashment for the year '+form_details_for_sl_cl.year, style: 'header',alignment:'center',fontSize:'14',bold:true},
            {text: '\nWith reference to the above subject,I surrender my Leave as below.Kindly arrange to encash for the same.\n',fontSize:'12'},

            {
                style:'tableExample',
                table: {
                    widths:['*','*','*'],
                    body: [
                        [	{text: 'Staff No.',fontSize:'12'},{text: 'Employee Name',fontSize:'12'},{text:'Number of '+form_details_for_sl_cl.Application_type+' surrendered',fontSize:'12'}],
                        [	{text: form_details_for_sl_cl.emp_id,fontSize:'12'},{text: form_details_for_sl_cl.emp_name,fontSize:'12'},{text:'5 Leave surrendered',fontSize:'12'}],
                    ]
                }
            },

            {text: '\nNote:\n Eligibility Criteria:Maximum of 5 days CL/5 days SL un-utilised during the year 2016 are eligible for Surrendering.',fontSize:'10'},

            {text: '\n\n\n\n\nEmployee Signature', style: 'header',alignment:'left',fontSize:'10',bold:true},

            {text: '\nFor use of HR department : ', style: 'header',alignment:'left',fontSize:'12',bold:true},

            {text: '\n 1. '+form_details_for_sl_cl.Balance_leave+' Balance leave as on 31-12-'+form_details_for_sl_cl.year,alignment:'left',fontSize:'12'},

            {text: '\n 2. No. on LOP(s) during the previous year('+form_details_for_sl_cl.year+')  :'+form_details_for_sl_cl.LOP+'\n\n',alignment:'left',fontSize:'12'},

            {text: '\nChecked by \n HR Assistant\n',alignment:'left',fontSize:'12'},

            {text: '\nApproval from\n ',alignment:'center',fontSize:'12',bold:true},

            {text: '\n\n\n\n\n.                              HR Manager',alignment:'left',fontSize:'12'},

            {text: 'President                              .',alignment:'right',fontSize:'12'}

        ]
    };
    return dd1;
};



function generate_CL_SL_report(formdata){
    form_details_for_sl_cl = formdata;
    //console.log(form_details_for_sl_cl);
    //console.log("here22"+form_details_for_sl_cl);
    var data  = createform11();

    var PdfPrinter = require('../../src/printer.js');
    var printer = new PdfPrinter(fonts);

    var pdfDoc = printer.createPdfKitDocument(data);
    var filepath = 'pdfs/'+form_details_for_sl_cl.report_id+'.pdf';
    fs.closeSync(fs.openSync(filepath, 'w'));
    pdfDoc.pipe(fs.createWriteStream(filepath));
    pdfDoc.end();

}

module.exports.generate_SL_CL_report = generate_CL_SL_report;
//module.exports.form_details_for_sl_cl = form_details_for_sl_cl;