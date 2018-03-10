# leave_encashment
# MSRMH
Leave Encashment WebApp


Database Structure(MongoDB) :

1. userlogin : { "_id" : "admin",
                 "password" : "password123",
                 "admin" : true
               }
               
               db.userlogin.insert({"_id" : "admin","password" : "password123", "admin" : true })
               db.userlogin.insert({"_id" : "emp1","password" : "password", "admin" : true })
               db.userlogin.insert({"_id" : "emp2" , "password" : "password", "admin" : false })
               
               
2. empdetails : { "_id" : "emp1",
                  "name" : "sagar",
                  "department" : "Accounts",
                  "designation" : "Accountant",
                  "permanant" : true,
                  "leaveDetails" : { "cl" : { "balance" : 3,
                                              "previousEncashment" : "15 1 2014"
                                            },
                                     "sl" : { "balance" : 7,
                                              "previousEncashment" : "16 1 2014" 
                                            },
                                     "el" : { "balance" : 120,
                                              "previousEncashment" : "20 6 2015"
                                            },
                                    "lop" : 0 
                                   } 
                  }
                  
                  db.empdetails.insert({"_id" : "emp1","name" : "sagar" ,"department" : "Accounts" , "designation" : "Accountant" , "permanant" : true ,"leaveDetails" : {"cl" : {"balance" : 3 , "previousEncashment" : "15 1 2014" },"sl" : {"balance" : 7 , "previousEncashment" : "16 1 2014" },"el" : {"balance" : 120 , "previousEncashment" : "20 6 2015" }, "lop" : 0 }})
                  db.empdetails.save({"_id" : "emp2","name" : "swaroop" ,"department" : "Nursing" , "designation" : "Trainee Nurse" , "permanant" : true ,"leaveDetails" : {"cl" : {"balance" : 3 , "previousEncashment" : "15 1 2014" },"sl" : {"balance" : 7 , "previousEncashment" : "16 1 2014" },"el" : {"balance" : 120 , "previousEncashment" : "20 6 2015" }, "lop" : 0 }})


3. requests : { "_id" : "7 2017" ,
                requestlist : []
              }
              
              db.requests.save({"_id" : "7 2017" , requestlist : []})
              db.requests.save({"_id" : "8 2017" , requestlist : []})
              db.requests.save({"_id" : "9 2017" , requestlist : []})

4. reports : {"_id" : 2017 , "sl" : [], "cl" : [], "el01" : [{"empId" : "emp1", "name" : "sagar", "designation" : "Acountant",      "department" : "Accounts" , "dateOfApplication" : "7 01 2017" , "serialNumber" : 01 , "dateOfReceipt" : "9 01 2017", "leaveAtCredit" : 120 , "leaveSurrendered" : 30, "leaveBalance" : 90, "previousEncashment" : "20 01 2014" , "basicPay" : 1000, "daa" : 5, "total" : 1050,},{"empId" : "emp2", "name" : "sugam", "designation" : "TraineeNurse", "department" : "Nursing" , "dateOfApplication" : "5 01 2017" , "serialNumber" : 02 , "dateOfReceipt" : "15 01 2017", "leaveAtCredit" : 150 , "leaveSurrendered" : 30, "leaveBalance" : 120, "previousEncashment" : "28 01 2014" , "basicPay" : 1000, "daa" : 10, "total" : 1100,}]})

             db.reports.save({"_id" : 2017 , "sl" : [], "cl" : [], "el01" : [{"empId" : "emp1", "name" : "sagar", "designation" : "Acountant", "department" : "Accounts" , "dateOfApplication" : "7 01 2017" , "serialNumber" : 01 , "dateOfReceipt" : "9 01 2017", "leaveAtCredit" : 120 , "leaveSurrendered" : 30, "leaveBalance" : 90, "previousEncashment" : "20 01 2014" , "basicPay" : 1000, "daa" : 5, "total" : 1050,},{"empId" : "emp2", "name" : "sugam", "designation" : "TraineeNurse", "department" : "Nursing" , "dateOfApplication" : "5 01 2017" , "serialNumber" : 02 , "dateOfReceipt" : "15 01 2017", "leaveAtCredit" : 150 , "leaveSurrendered" : 30, "leaveBalance" : 120, "previousEncashment" : "28 01 2014" , "basicPay" : 1000, "daa" : 10, "total" : 1100,}]})

5.msrmh:{ "_id" : "daa", "daaPassword" : "da#change", "daa" : 22 }

       db.msrmh.insert({ "_id" : "daa", "da#change" : "abc", "daa" : 22 })

