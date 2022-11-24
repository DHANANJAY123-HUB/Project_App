const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminModel = require('../models/adminModel')
const admin = require("firebase-admin");
//const serviceAccount = require("F:/NodeJs/Tamu_Project/tamuadminjsom.json");
//const token = ['dyBiKP6vTjOUgqGDYZS5L8:APA91bG3OSVRAVPZweQcGgxRtnAAfSSBrE-oXvMfq3JNovscVpj-0ftW0Jq4X8GFF31rfUjMDb08mxrLeDkjzPDDCoW7stwwuGoiP0eaSVi1lXrbfLcSG3ZS4s2JbusiqZqcbKwffEPU']

/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tamudatingapp-default-rtdb.firebaseio.com"
});*/
//const mongoosePaginate = require("mongoose-paginate-v2");

/* middleware function to check admin users */
router.use((req, res, next)=>{
  if(req.session.sunm ==undefined || req.session.srole!='admin')
    res.redirect('/login')
     next()   
});

/* GET users listing. */
router.get('/', (req, res, next)=>{
  res.render('home',{'sunm':req.session.sunm});
});

router.get('/dashboard', (req, res,next)=>{
  res.render('dashboard',{'sunm':req.session.sunm});
});

router.get('/block_user', (req, res,next)=>{
 // res.render('block_user',{'sunm':req.session.sunm});
  adminModel.blockDetails(req.body).then((result)=>{
       res.render('block_user',{ 'sunm':req.session.sunm,'list':result});   
      /* res.json({
        result
       }) */
    }).catch((err)=>{
      res.render({message:err.message})
       /*res.json({
        message:err.message
       })*/
    })
});

router.get('/report_user', (req, res,next)=>{
  //res.render('report_user',{'sunm':req.session.sunm});
   adminModel.reportDetails(req.body).then((result)=>{
       res.render('report_user',{ 'sunm':req.session.sunm,'list':result});   
      /* res.json({
        result
       }) */
    }).catch((err)=>{
      res.render({message:err.message})
       /*res.json({
        message:err.message
       })*/
    })
});

router.get('/add_weekly_reward', (req, res,next)=>{
  res.render('add_weekly_reward',{'sunm':req.session.sunm,'output':''});
});

router.get('/add_superlike_list', (req, res,next)=>{
  res.render('add_superlike_list',{'sunm':req.session.sunm,'output':''});
});

router.get('/membership_user', (req, res,next)=>{
  //res.render('membership_user',{'sunm':req.session.sunm});
  adminModel.membershipDetails(req.body).then((result)=>{
       res.render('membership_user',{ 'sunm':req.session.sunm,'list':result});   
      /* res.json({
        result
       }) */
    }).catch((err)=>{
      res.render({message:err.message})
       /*res.json({
        message:err.message
       })*/
    })
});

router.get('/privacy_policy', (req, res,next)=>{
  //res.render('privacy_policy',{'sunm':req.session.sunm});
  adminModel.showPrivacyPolicy(req.params).then((result)=>{
  
        //var new_id = parseInt(req.params.id);
         if(result.length==0){
                //respose = false,
                msg ='_id invalid...'
        
          }else{
                //response = true,
                msg ='user successfully show'
            }
          res.render('privacy_policy',{'sunm':req.session.sunm, 'list':result});
          /*res.json({
            result:response,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
    //console.log(err)
  })
});

router.get('/term_and_condition', (req, res,next)=>{
  res.render('term_and_condition',{'sunm':req.session.sunm});
});

router.get('/add_notification_msg', (req, res,next)=>{
  res.render('add_notification_msg',{'sunm':req.session.sunm,'output':''});
});

router.get('/add_membership_plan', (req, res,next)=>{
  res.render('add_membership_plan',{'sunm':req.session.sunm,'output':''});
});

router.get('/edit_profile', (req, res,next)=>{
  res.render('edit_profile',{'sunm':req.session.sunm});
});

router.get('/add_mood', (req, res,next)=>{
  res.render('add_mood',{'sunm':req.session.sunm,'output':''});
});

router.get('/index', (req, res,next)=>{
  //res.render('index',{'sunm':req.session.sunm});
   adminModel.all(req.body).then((result)=>{
  //Promise.all([p1.catch((error) => error), p2.catch((error) => error)]).then((result)=>{
    //console.log(result[0])
    //console.log(result[1])
    
      
      if(result){
            //response ='true',
            // msg ='record found'
            }else{
             //response = 'false',
             //msg =  'record not found'
           } 
        res.render('index',{'sunm':req.session.sunm,'total_count':result,'membership_count':result,'block_count':result,'report_count':result});
          
          /*res.json({
            result:response,
            msg:msg,
            user_record:result[0],
            membership_record:result[1]
           // block_record:results[2],
           // report_record:results[3]
          })*/

          
    //})
  }).catch((err)=>{
    res.render({message:err.message})
   // console.log(err)
  })
});



router.get('/user_other', (req, res,next)=>{
  //res.render('user_male',{'sunm':req.session.sunm});
  adminModel.otherDetails(req.body).then((result)=>{
       res.render('user_other',{ 'sunm':req.session.sunm,'list':result});   
      /* res.json({
        result
       }) */
    }).catch((err)=>{
      res.render({message:err.message})
       /*res.json({
        message:err.message
       })*/
    })
});

router.get('/user_male', (req, res,next)=>{
  //res.render('user_male',{'sunm':req.session.sunm});
  adminModel.maleDetails(req.body).then((result)=>{
       res.render('user_male',{ 'sunm':req.session.sunm,'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
      res.render({message:err.message})
      /* res.json({
        message:err.message
       })*/
    })
});

router.get('/user_female', (req, res,next)=>{
  //res.render('user_female',{'sunm':req.session.sunm});
   adminModel.femaleDetails(req.body).then((result)=>{
       res.render('user_female',{ 'sunm':req.session.sunm,'list':result});   
       /*res.json({
        result
       })*/ 
    }).catch((err)=>{
       res.render({message:err.message})
       /*res.json({
        message:err.message
       })*/
    })
});




router.get('/notification_msg', (req, res,next)=>{
  //res.render('notification_msg',{'sunm':req.session.sunm});
  adminModel.fetchNotification(req.body).then((result)=>{
      res.render('notification_msg',{'sunm':req.session.sunm,'list':result});   
       /*res.json({
        result
       })*/ 
    }).catch((err)=>{
       res.render({message:err.message});
       /*res.json({
        message:err.message
       })*/
    })
});



router.get('/membership_plan', (req, res,next)=>{
  //res.render('membership_plan',{'sunm':req.session.sunm});
  adminModel.fetchMembership(req.body).then((result)=>{
      res.render('membership_plan',{'sunm':req.session.sunm,'list':result});   
      /* res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
       /*res.json({
        message:err.message
       })*/
    })
});




router.get('/user_list', (req, res,next)=>{

  adminModel.fetchDetails(req.body).then((result)=>{
      res.render('user_list',{'sunm':req.session.sunm,'list':result});   
       /*res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
      /* res.json({
        message:err.message
       })*/
    })
});

router.post('/add_notification_msg', (req, res,next)=>{
  //res.render('add_notification_msg',{'sunm':req.session.sunm});
  adminModel.add_notification_msg(req.body).then((result1)=>{
   
   /*var mobile_no;
   mobile_no = result1[0].mobile_no;
   console.log(mobile_no)
   var token = [mobile_no]
       var payload ={
         notification:{
            title: "New Notification ",
            body: "you received  a new Like."
        }
    };
      var options ={
         priority: "high",
          timeToLive: 60 * 60 *24
       };
       admin.messaging().sendToDevice(token, payload, options)
         .then (function(response) {
        console.log ("Successfully sent message:", response);
    }).catch(function(error) {
        console.log( "Error sending message:", error);
    });*/ 
  
     if(result1){
            result ='true',
             msg ='data add successfully....'
            
       }else{
           result = 'false',
            msg =  'data not registered'
        }    
        res.render('add_notification_msg',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
          */

  }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
  })
});

router.get('/edit_notification_msg/:id', (req, res,next)=>{
  //res.render('edit_mood',{'sunm':req.session.sunm,'output':''});
  adminModel.showNotificationMsg(req.params.id).then((result)=>{
  
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                msg ='_id invalid...'
        
          }else{
                //result = true,
                msg ='user successfully show'
            }
          res.render('edit_notification_msg',{'sunm':req.session.sunm, 'list':result[0]});
          /*res.json({
            //result:result,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
    //console.log(err)
  })
});

router.post('/edit_notification_msg/:id', (req, res,next)=>{
  adminModel.editNotificationMsg(req.body,req.params).then((result1)=>{
  
        var new_id = req.params.id;
         if(result1.length==0){
                //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='data update successfully',
                res.redirect('/admin/notification_msg') 
            }
         res.render('notification_msg',{'sunm':req.session.sunm});
          /*res.json({
            result:result1,
            msg:msg
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
     //console.log(err)
  })
});


router.get('/delete_notification_msg/:id', (req, res,next)=>{
  adminModel.delete_notification_msg(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted',
                res.redirect('/admin/notification_msg') 
            }
          res.render('notification_msg',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.post('/add_membership_plan', (req, res,next)=>{
  //res.render('add_membership_plan',{'sunm':req.session.sunm});
  adminModel.add_membership_plan(req.body).then((result)=>{
  
     if(result)
            result ='true',
             msg ='data add successfully....'
            
       else
           result = 'false',
            msg =  'data not registered'
            
        res.render('add_membership_plan',{'sunm':req.session.sunm,'output':msg});
         /* res.json({
            result:result,
            msg:msg
          })*/
          

  }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
  })
});

router.get('/edit_membership_plan/:id', (req, res,next)=>{
  //res.render('edit_mood',{'sunm':req.session.sunm,'output':''});
  adminModel.showMembershipPlan(req.params.id).then((result)=>{
  
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                msg ='_id invalid...'
        
          }else{
                //result = true,
                msg ='user successfully show'
            }
          res.render('edit_membership_plan',{'sunm':req.session.sunm, 'list':result[0]});
          /*res.json({
            //result:result,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
    //console.log(err)
  })
});

router.post('/edit_membership_plan/:id', (req, res,next)=>{
  adminModel.editMembershipPlan(req.body,req.params).then((result1)=>{
  
        var new_id = req.params.id;
         if(result1.length==0){
                //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='data update successfully',
                res.redirect('/admin/membership_plan') 
            }
         res.render('membership_plan',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result1,
            msg:msg
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
     //console.log(err)
  })
});


router.get('/delete_membership_plan/:id', (req, res,next)=>{
  adminModel.delete_membership_plan(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted',
                res.redirect('/admin/membership_plan') 
            }
          res.render('membership_plan',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});




router.post('/privacy_policy', (req, res,next)=>{
  //res.render('privacy_policy',{'sunm':req.session.sunm});
   adminModel.privacy_policy(req.body,req.params).then((result1)=>{
        var new_id = req.params.id;
     if(result1.length==0){
            //result ='true',
             msg ='invalid id'
            
       }else{
           //result = 'false',
            msg =  'data update successfully'
        }    
        res.render('privacy_policy',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })*/
          

  }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
  })
});

router.post('/term_and_condition', (req, res,next)=>{
  //res.render('term_and_condition',{'sunm':req.session.sunm});
  adminModel.term_and_condition(req.body).then((result)=>{
  
     if(result)
            result ='true',
             msg ='data add successfully....'
            
       else
           result = 'false',
            msg =  'data not registered'
            
       // res.render('register',{'output':msg});
          res.json({
            result:result,
            msg:msg
          })
          

  }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
  })
});


router.get('/delete_user/:id', (req, res,next)=>{
  
  adminModel.deleteUser(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted'
                res.redirect('/admin/user_list') 
            }
          res.render('user_list',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

/*router.get('/my_profile/:id', (req, res,next)=>{
  res.render('my_profile',{'sunm':req.session.sunm});
});*/

router.get('/my_profile/:id', (req, res,next)=>{
  
  adminModel.showUser(req.params).then((result)=>{
    console.log(result)
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                //msg ='_id invalid...'
        
          }else{
               // result = true,
               // msg ='user successfully show'
            }
          res.render('my_profile',{'sunm':req.session.sunm, 'list':result[0]});
         /* res.json({
            //result:result,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
  })
});


//router.get('/total_user_count', (req, res,next)=>{
  //res.render('term_and_condition',{'sunm':req.session.sunm});
 /* adminModel.totalUser(req.body).then((result)=>{

     if(result){*/
            //result ='true',
             //msg ='record found'
           /* }else{*/
          // result = 'false',
            //msg =  'record not found'
           /*} */
       // res.render('index',{'sunm':req.session.sunm,'result':result});
          /*res.json({
            //result:result,
            msg:msg,
            total_record:result
          })*/
          

/*  }).catch((err)=>{
    res.render({message:err.message})*/
    //console.log(err)
 /*})*/
//});

router.get('/block_user_count', (req, res,next)=>{
  //res.render('term_and_condition',{'sunm':req.session.sunm});
  adminModel.blockUser(req.body).then((result)=>{

     if(result){
            //result ='true',
            // msg ='record found'
            
       }else{
           //result = 'false',
           // msg =  'record not found'
          }  
        res.render('index',{'sunm':req.session.sunm,'result':result});
         /* res.json({
           // result:response,
            msg:msg,
            total_record:result
          })*/
          

  }).catch((err)=>{
    res.render({message:err.message})
    //console.log(err)
  })
});

router.get('/report_user_count', (req, res,next)=>{

  adminModel.reportUser(req.body).then((result)=>{

     if(result){
           // result ='true',
            // msg ='record found'
            
      } else{
          // result = 'false',
           // msg =  'record not found'
            }
        res.render('index',{'sunm':req.session.sunm,'result':result});
         /* res.json({
            //result:result,
            msg:msg,
            total_record:result
          })
          */

  }).catch((err)=>{
    res.render({message:err.message})
    //console.log(err)
  })
});

router.get('/search', (req, res,next)=>{
  
  adminModel.searchDetails(req.body).then((result)=>{

     if(result.length==0){
      res.redirect('/admin/user_list')
       /* res.json({
                result: 'false',
                msg:'record not found'
            })*/
      }else{
        res.render('user_list',{'sunm':req.session.sunm,'list':result});
          /* res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); */
          }  
        //res.render('user_list',{'sunm':req.session.sunm,'result':result});
          

  }).catch((err)=>{
    res.render({message:err.message})
    })
});

router.post('/add_mood',(req,res,next)=>{
    adminModel.addMood(req.body).then((result)=>{

     if(result){
           result = 'true',
            msg ='data  successfully add'
        }else{
            response = 'false',
            msg = 'data not registered'
        }   
        //var data = JSON.stringify(result2)
        res.render('add_mood',{'sunm':req.session.sunm,'output':msg});
            /*res.json({
                result:result,
                 msg:msg
            });*/ 
   }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/get_mood', (req, res,next)=>{
  //res.render('membership_plan',{'sunm':req.session.sunm});
  adminModel.fetchmood(req.body).then((result)=>{
      res.render('mood',{'sunm':req.session.sunm,'list':result});   
      /* res.json({
        result
       }) */
    }).catch((err)=>{
       res.render({message:err.message});
       /*res.json({
        message:err.message
       })*/
    })
});

router.get('/edit_mood/:id', (req, res,next)=>{
  //res.render('edit_mood',{'sunm':req.session.sunm,'output':''});
  adminModel.showMood(req.params.id).then((result)=>{
    console.log(result)
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                msg ='_id invalid...'
        
          }else{
                //result = true,
                msg ='user successfully show'
            }
          res.render('edit_mood',{'sunm':req.session.sunm, 'list':result[0],'output':''});
          /*res.json({
            //result:result,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
    //console.log(err)
  })
});


router.post('/edit_mood/:id', (req, res,next)=>{
  adminModel.editMood(req.body,req.params).then((result1)=>{
  
        var new_id = req.params.id;
         if(result1.length==0){
                //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='data update successfully',
                 res.redirect('/admin/get_mood') 
            }
         res.render('mood',{'sunm':req.session.sunm});
          /*res.json({
            result:result1,
            msg:msg
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/delete_mood/:id', (req, res,next)=>{
  adminModel.deleteMood(req.params).then((result)=>{
  
    var new_id = parseInt(req.params.id);
         
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted',
                res.redirect('/admin/get_mood') 
            }
          res.render('mood',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});




router.post('/add_superlike_list', (req, res,next)=>{
  //res.render('add_notification_msg',{'sunm':req.session.sunm});
  adminModel.add_superlike_list(req.body).then((result)=>{
  
     if(result)
            result ='true',
             msg ='data add successfully....'
            
       else
           result = 'false',
            msg =  'data not registered'
            
        res.render('add_superlike_list',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
          */

  }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
  })
});

router.get('/superlike_list', (req, res,next)=>{
 // res.render('superlike_list',{'sunm':req.session.sunm});
  adminModel.fetchSuperlike(req.body).then((result)=>{
      res.render('superlike_list',{'sunm':req.session.sunm,'list':result});   
       /*res.json({
        result
       })*/ 
    }).catch((err)=>{
       res.render({message:err.message});
       /*res.json({
        message:err.message
       })*/
    })
});

router.get('/edit_superlike_list/:id', (req, res,next)=>{
  //res.render('edit_mood',{'sunm':req.session.sunm,'output':''});
  adminModel.showSuperLike(req.params.id).then((result)=>{
  
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                msg ='_id invalid...'
        
          }else{
                //result = true,
                msg ='user successfully show'
            }
          res.render('edit_superlike_list',{'sunm':req.session.sunm, 'list':result[0]});
          /*res.json({
            //result:result,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
    //console.log(err)
  })
});

router.post('/edit_superlike_list/:id', (req, res,next)=>{
  adminModel.editSuperLike(req.body,req.params).then((result1)=>{
  
        var new_id = req.params.id;
         if(result1.length==0){
                //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='data update successfully',
                 res.redirect('/admin/superlike_list') 
            }
         res.render('superlike_list',{'sunm':req.session.sunm,'output':msg});
         /* res.json({
            result:result1,
            msg:msg
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/delete_superlike_list/:id', (req, res,next)=>{
  adminModel.delete_superlike_list(req.params).then((result)=>{
 
    var new_id = parseInt(req.params.id);
         
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted',
                res.redirect('/admin/superlike_list') 
            }
          res.render('superlike_list',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.post('/add_weekly_reward', (req, res,next)=>{
  //res.render('add_notification_msg',{'sunm':req.session.sunm});
  adminModel.add_weekly_reward(req.body).then((result)=>{
  
     if(result)
            result ='true',
             msg ='data add successfully....'
            
       else
           result = 'false',
            msg =  'data not registered'
            
        res.render('add_weekly_reward',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
          */

  }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
  })
});

router.get('/weekly_reward', (req, res,next)=>{
  //res.render('weekly_reward',{'sunm':req.session.sunm});
  adminModel.fetchReward(req.body).then((result)=>{
      res.render('weekly_reward',{'sunm':req.session.sunm,'list':result});   
       /*res.json({
        result
       })*/ 
    }).catch((err)=>{
       res.render({message:err.message});
       /*res.json({
        message:err.message
       })*/
    })
});



router.get('/edit_weekly_reward/:id', (req, res,next)=>{
  //res.render('edit_mood',{'sunm':req.session.sunm,'output':''});
  adminModel.showWeeklyReward(req.params.id).then((result)=>{
    console.log(result)
        var new_id = parseInt(req.params.id);
         if(result.length==0){
                //result = false,
                msg ='_id invalid...'
        
          }else{
                //result = true,
                msg ='user successfully show'
            }
          res.render('edit_weekly_reward',{'sunm':req.session.sunm, 'list':result[0],'output':''});
          /*res.json({
            //result:result,
            msg:msg,
            data:result
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
    //console.log(err)
  })
});

router.post('/edit_weekly_reward/:id', (req, res,next)=>{
  adminModel.editWeeklyReward(req.body,req.params).then((result1)=>{
  
        var new_id = req.params.id;
         if(result1.length==0){
                //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='data update successfully',
                res.redirect('/admin/weekly_reward') 
            }
         res.render('weekly_reward',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result1,
            msg:msg
          })*/

  }).catch((err)=>{
    res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/delete_weekly_reward/:id', (req, res,next)=>{
  adminModel.delete_weekly_reward(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted',
                res.redirect('/admin/weekly_reward') 
            }
          res.render('weekly_reward',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/manage_user_status', (req, res, next)=>{
  adminModel.manageuserstatus(req.query).then((result)=>{
    console.log(req.query)
    //var new_id = req.query._id;
    //var s = req.query.s;
    if(result.length==0){
                 //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='user successfully updated',
                res.redirect('/admin/user_list')
            }
          

          res.render('user_list',{'sunm':req.session.sunm,'output':msg});
         /* res.json({
            //response:result,
            msg:msg,
            data:result
          })  */
  }).catch((err)=>{
     res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/manage_block_status', (req, res, next)=>{
  adminModel.manageblockstatus(req.query).then((result)=>{
    console.log(req.query)
    //var new_id = req.query._id;
    //var s = req.query.s;
    if(result.length==0){
                 //result = 'false',
                msg ='_id invalid...'
        
          }else{
                //result = 'true',
                msg ='user successfully updated',
                res.redirect('/admin/block_user')
            }
          

          res.render('block_user',{'sunm':req.session.sunm,'output':msg});
         /* res.json({
            //response:result,
            msg:msg,
            data:result
          })  */
  }).catch((err)=>{
     res.json({message:err.message})
     //console.log(err)
  })
});

router.get('/delete_membership_user/:id', (req, res,next)=>{
  adminModel.delete_membership_user(req.params).then((result)=>{
  // res.render('',{ 'sunm':req.session.sunm,'result':result}); 
           var new_id = parseInt(req.params.id);
         if(result.length==0){
                result = 'false',
                msg ='_id invalid...'
        
          }else{
                result = 'true',
                msg ='user successfully deleted',
                res.redirect('/admin/membership_user') 
            }
          res.render('membership_user',{'sunm':req.session.sunm,'output':msg});
          /*res.json({
            result:result,
            msg:msg
          })
*/
  }).catch((err)=>{
    res.json({message:err.message})
  })
});

router.get('/pagination', (req, res,next)=>{

  adminModel.pagination(req.query).then((result)=>{ 
          console.log(req.query)
           var page = req.query.page;
           var limit = req.query.limit;
         if(result.length==0){
                response = 'false',
                msg ='record not found'
        
          }else{
                response = 'true',
                msg ='record get successfully'
            }
          //res.render('membership_user',{'sunm':req.session.sunm,'output':msg});
          res.json({
            result:response,
            msg:msg,
            data:result

          })

  }).catch((err)=>{
    //res.json({message:err.message})
    console.log(err)
  })
});





module.exports = router;