const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const notifier = require('node-notifier');
const FCM = require('fcm-node')
const sid =    'ACc0d6dd702a8e593da9ac599c27a0f9c5'
const auth_token = 'f34dc7be5a1687817ce85e965b0588bd'
const twilio = require('twilio')(sid,auth_token)
//const assert = require('assert');
//const { GridFsStorage } = require("multer-gridfs-storage");
const { body, validationResult } = require('express-validator');
const apiModel = require('../models/apiModel');
const admin = require("firebase-admin");
const serviceAccount = require("F:/NodeJs/Tamu_Project/tamuadminjsom.json");
 const token = ['AAAAwmnSsUI:APA91bHRKdTf1mTbUNF4u-MYrNhtZpx0llJcIeOeN8wrK3hwu0jFY5pAQDa36hNcbbGyKp99IGNKZ1fv-inpKe78IICzoil91a22RxxMh1yYA0cNOoYQDpcTdhBHxtybtpP37zuJEdut']
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tamudatingapp-default-rtdb.firebaseio.com"
});



/*router.use((req,res,next)=>{
	if(req.session.sunm==undefined || res.session.srole ==undefined)
		res.redirect('/api/login')
		next()
})*/

/* GET users listing. */
/*router.get('/', (req, res, next)=>{
  console.log('');
});*/

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads/')
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null,Date.now()+ext)
    }
});


const upload = multer({
    storage: storage,
    fileFilter: function(req,file,callback){
        if(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
    ){
        callback(null,true)
    }else{
        console.log('only  png , jpg & jpeg file supported')
        callback(null,false)
    }

   },
   limits:{
    filesize:1024 * 1024 * 2
   }
});


router.post('/uploadProfile',upload.any('image1','image2','image3','image4','image5','image6'),(req, res,err) => {
   
    apiModel.uploadimage(req.body,req.files).then((result)=>{
        console.log(req.files)

        var img = req.files;
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',

            })
        }else{
         req._id = result[0]._id,
            req.image1 = result[0].image1

            if(result[0].image1 == req.image1 ){
                res.json({
                     result:'true',
                    msg:'file uploaded successfully',
                    body:req.files
                })

            }else{

            }
        }
    }).catch((err)=>{
        console.log(err)
        res.json({message:err.message})
    });
});

router.get('/getProfile', (req, res,next) => {
    apiModel.fetchDetails(req.body).then((result) => {
        if(result==0) {
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }
        else {
            req._id = result[0]._id
            res.json({
                result:'true',
                msg:'record get successfully',
                image:[{
                     fieldname:result[0].image[0].fieldname,
                     filename:result[0].image[0].filename,
                     originalname:result[0].image[0].originalname,
                     path:result[0].image[0].path
                   }]
            
                
            });
        }
     }).catch((err)=>{
        console.log(err)
        //res.json({message:err.message})
    });
});   


router.post('/signup',
    body('mobile_no').isLength({
        min:1,
        max:10
    }).withMessage('mobile_no should be required'),
     body('country_code').isLength({
        min:1,
        max:10
    }).withMessage('country_code should be required'),
    body('password').isLength({
        min:2,
        max:10
    }).withMessage('password should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required country_code, mobile_no & password'
        });
    }
	
apiModel.registerUser(req.body).then((result2)=>{

        
        /*var mobile_no = result2[0].mobile_no;
        var country_code = result2[0].country_code;
        var OTP = result2[0].OTP;
        twilio.messages.create({
             from:"+14799991055",
              to:country_code+""+mobile_no,
              body:"Dear customer, the one time password (OTP) to Verify your Number at Tamu  App is ******. This OTP will expire in 5 minutes"+OTP,
        })
        notifier.notify('new user registered...');*/
        var mobile_no = result2[0].mobile_no;
   console.log(mobile_no)
   var token = [mobile_no]

        var payload ={
         notification:{
            title: "Tamu Notification Message",
            body: "your mobile_no successfully add in my Tamu App."
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
        });
        if(result2){
            response = 'true',
            msg ='mobile_no registered successfully..'
        }else{
            response = 'false',
        	msg = 'mobile_no already registered please enter new mobile_no..'
        }   
        //var data = JSON.stringify(result2)
        
            res.json({
                result:response,
        	    msg:msg,
                data:result2
                
           }); 

        
   }).catch((err)=>{
		res.json({message:err.message})
	})
});

router.post('/login',
    body('mobile_no').isLength({
        min:10,
        max:10
    }).withMessage('mobile_no should be required..'),
     body('country_code').isLength({
        min:1,
        max:10
    }).withMessage('country_code should be required..'),
    body('password').isLength({
        min:2,
        max:10
    }).withMessage('password should be required...'),(req,res,next)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            // errors: errors.array()
            msg: 'parameter required country_code, mobile_no & password'
        });
    }

    apiModel.userLogin(req.body).then((result)=>{
          
        if(result.length==0){
			res.json({
                result: 'false',
				msg:'mobile_no,country_code or password invalid...',
			})
		}
		else{
            var user_status = result[0].user_status;
			req.mobile_no = result[0].mobile_no,
            req.country_code = result[0].country_code,
			req.password = result[0].password

			if(result[0].password==req.password && result[0].country_code == req.country_code && user_status == 0){
				res.json({
                    result: 'true',
                     msg:'user successfully login..',
                     data:result[0]
			       /* _id:result[0]._id,
                    mobile_no:result[0].mobile_no,*/
                });
			}else{
                res.json({
                    result:'false',
                    msg:'user blocked by admin...'
                })

			}
		}

	}).catch((err)=>{
		res.json({message:err.message})
	})
})

router.post('/google_login',
     body('email').isEmail({}).withMessage('mobile_no should be required..'),
     (req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required google_id & email..'
        });
    }

    apiModel.googleLogin(req.body).then((result)=>{
         
       if(result){
             res.json({
                result: 'true',
                msg:'user successfully registered',
                data:result
            })
        }else{
           req.google_id = result[0].google_id
           if(result[0].google_id == req.google_id){
                res.json({
                    result: 'false',
                     msg:'user already registered please enter new google_id',
                     data:result[0]
                   
                })
            }else{
                 
            }
        }

    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.post('/facebook_login',
    body('email').isEmail().withMessage('email should be required..'),(req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required facebook_id & email'
        });
    }
    apiModel.facebookLogin(req.body).then((result)=>{

        if(result){
            res.json({
                result: 'true',
                msg:'user successfully registered',
                 data:result
            })
        }
        else{
            req.facebook_id = result[0].facebook_id
            
            if(result[0].facebook_id==req.facebook_id){
                res.json({
                    result: 'false',
                     msg:'user already registered please enter new facebook_id',
                     data:result[0]
                })
            }else{

            }
        }

    }).catch((err)=>{
        res.json({message:err.message})
    })
})

router.patch('/updatePassions/:id',
    body('passions').isLength({
        min:1,
        max:50
    }).withMessage('passions must be alphabetic.'),(req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg: 'parameter required _id, passion_id & passions'
        });
    }
    apiModel.updatePassions(req.body,req.params).then((result)=>{
          var userDetails=req.body;
          var new_id = req.params.id;
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found'
            })
        }
        else{
            req._id = result[0]._id
            /*req.passions_id = result[0].passions_id,
            req.passions = result[0].passions*/
            
            if(result[0]._id==req._id){
                res.json({
                    result: 'true',
                     msg:'passions successfully updated',
                     data:result[0]
                })
            }else{

            }
        }

    }).catch((err)=>{
        res.json({message:err.message})
    })
})

router.patch('/updateGender',
    body('gender').isLength({
        min:1,
        max:20
    }).withMessage('gender must be alphabetic.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id ,gender_id & gender'
        });
    }

    apiModel.updateGender(req.body).then((result)=>{
      
    if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.gender_id = result[0].gender_id,
            req.gender = result[0].gender

            if(result[0].gender ==req.gender && result[0].gender_id ==req.gender_id){
    	        res.json({
    		         result:'true',
    		        msg:"gender successfully updated"
    	        })
            }else{

            }
        }     
    }).catch((err)=>{
    	res.json({message:err.message})
    })

})

router.patch('/updatePreference',
    body('user_prefrence').isLength({
        min:1,
        max:20
    }).withMessage('gender must be alphabetic.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id,preference_id & user_prefrence'
        });
    }

    apiModel.updatePreferece(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.preference_id = result[0].preference_id,
            req.gender = result[0].gender

            if(result[0].gender ==req.gender && result[0].preference_id ==req.preference_id ){
                res.json({
                     result:'true',
                    msg:"user_prefrence successfully updated"
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
})


router.patch('/updateLikeReward',
    body('like_count').isLength({
        min:1,
        max:20
    }).withMessage('like_count should be required'),
    body('date').isDate({
    format: 'YYYY/MM/DD'
    //strictMode:true,
    //endDate: 'today'
    //autoclose:true
    }).withMessage('date should be required date formate yyyy/mm/dd.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id, date(yyyy/mm/dd) & like_count...'
        });
    }

    apiModel.updateLikeReward(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.like_count = result[0].like_count,
            req.date = result[0].date
           
            if(result[0].like_count == req.like_count && result[0].date  == req.date){
                res.json({
                     result:'true',
                    msg:"like reward successfully updated"
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
})


router.patch('/updateDisLikeReward',
    body('dislike_count').isLength({
        min:1,
        max:20
    }).withMessage('dislike_count should be required'),
    body('date').isDate({
    format: 'YYYY/MM/DD'
    //strictMode:true,
    //endDate: 'today'
    //autoclose:true
    }).withMessage('date should be required date formate yyyy/mm/dd.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id,date(yyyy/mm/dd) & dislike_count...'
        });
    }

    apiModel.updateDisLikeReward(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.dislike_count = result[0].dislike_count,
            req.date = result[0].date
           
            if(result[0].dislike_count == req.dislike_count && result[0].date == req.date ){
                res.json({
                     result:'true',
                    msg:"dislike reward successfully updated"
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
})

router.patch('/updateMsgReward',
    body('msg_count').isLength({
        min:1,
        max:20
    }).withMessage('msg_count should be required'),
    body('date').isDate({
    format: 'YYYY/MM/DD'
    //strictMode:true,
    //endDate: 'today'
    //autoclose:true
    }).withMessage('date should be required date formate yyyy/mm/dd.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id, date(yyyy/mm/dd) & msg_count...'
        });
    }

    apiModel.updateMsgReward(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.msg_count = result[0].msg_count,
            req.date = result[0].date
           
            if(result[0].msg_count == req.msg_count && result[0].date == req.date){
                res.json({
                     result:'true',
                    msg:"message reward successfully updated"
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/updateSuperLikeReward',
    body('superlike_count').isLength({
        min:1,
        max:20
    }).withMessage('superlike_count should be required'),
    body('date').isDate({
    format: 'YYYY/MM/DD'
    //strictMode:true,
    //endDate: 'today'
    //autoclose:true
    }).withMessage('date should be required date formate yyyy/mm/dd.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id, date(yyyy/mm/dd) & superlike_count...'
        });
    }

    apiModel.updateSuperLikeReward(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.superlike_count = result[0].superlike_count,
            req.date = result[0].date
           
            if(result[0].superlike_count == req.superlike_count && result[0].date == req.date){
                res.json({
                     result:'true',
                    msg:"superlike reward successfully updated"
                })
            }else{

            }
        }     
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/updatefullName',
    body('first_name').isLength({
        min:1,
        max:20
       }).withMessage('first_name should be required.'),
     body('last_name').isLength({
        min:1,
        max:20
       }).withMessage('last_name should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id ,first_name & last_name'
        });
    }

    apiModel.updatefullName(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.first_name = result[0].first_name,
            req.last_name = result[0].last_name

            if(result[0].first_name ==req.first_name && result[0].last_name ==req.last_name ){
                res.json({
    	            result:'true',
    		        msg:"name successfully updated"
    	        })
            }    
        }
    }).catch((err)=>{
    	res.json({message:err.message})
    })

})

router.patch('/updateDob',
    body('date_of_birth').isDate({
    format: 'YYYY/MM/DD',
    strictMode:true,
    endDate: 'today'
    //autoclose:true
    }).withMessage('date_of_birth should be required date formate yyyy/mm/dd.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id & date_of_birth(yyyy/mm/dd'
        });
    }

    apiModel.updateDob(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'mobile_no not registered please enter register mobile_no',
            })
        }else{

            req._id = result[0]._id,
            req.date_of_birth = result[0].date_of_birth

            if(result[0].date_of_birth ==req.date_of_birth ){
                    res.json({
    	                result:'true',
    		            msg:"date of birth successfully updated"
    	            })
            }else{

            }    
        }
    }).catch((err)=>{
    	res.json({message:err.message})
    })

})

router.patch('/updateEmail',
    body('email').isEmail().normalizeEmail().withMessage('email should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
           // errors: errors.array()
           msg:'parameter required _id & email'
        });
    }

    apiModel.updateEmail(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'mobile_no not registered please enter the register mobile no',
            })
        }else{

              req._id = result[0]._id,
              req.email = result[0].email

                if(result[0].email ==req.email ){
                    res.json({
    	                result:'true',
    		             msg:"email id successfully updated"
    	            })
                }else{
            }
        }
    }).catch((err)=>{
    	res.json({message:err.message})
    })

})

router.patch('/updatePassword',
    body('password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required min 6 digit.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id & password'
        });
    }

    apiModel.updatePassword(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'mobile_no not registered please enter the register mobile no',
            })
        }else{
            req._id = result[0]._id,
            req.password = result[0].password

            if(result[0].password ==req.password ){
                    res.json({
    	                result:'true',
    		            msg:"password successfully updated"
    	            })
                }else{

            }    
        }
    }).catch((err)=>{
    	res.json({message:err.message})
    })

})

router.get('/List', (req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            errors: errors.array()
        });
    }
  
    apiModel.fetchDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
    	        result:'true',
                msg:'record get successfully',
    	        data:result
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/all_list', (req,res,next)=>{
    
   apiModel.fetchAllDetails(req.body).then((result)=>{

       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }       
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/male_list',
    body('gender').isAlpha().withMessage('gender should be alphabetic.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            errors: errors.array()
        });
    }
  
    apiModel.maleDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/female_list',
    body('gender').isAlpha().withMessage('gender should be alphabetic.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            errors: errors.array()
        });
    } 
  
    apiModel.femaleDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
             res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }       
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/age_list',
    body('age').isLength({
        min:1,
        max:2
    }).withMessage('age should be no & min 1 & max 2 digit.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            errors: errors.array()
        });
    }
  
    apiModel.ageDetails(req.body.age).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            });
        }        
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.post('/verifyOTP',
    body('OTP').isLength({
        min:4,
        max:4
    }).withMessage('otp must be required min & max 4 digit.'), (req, res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            errors: errors.array()
        });
    } 
  
    apiModel.verifyOTP(req.body).then((result)=>{
    
        if(result.length == 0){
        	res.json({
        		result: 'false',
				msg:'invalid otp & please Enter the valid otp ',
			})
		}else{
         
            req._id = result[0]._id,
            req.OTP = result[0].OTP

            if(result[0].OTP ==req.OTP ){
				res.json({
					result:'true',
					msg:"user successfully verify"
				})
			}else{
             }
        }  
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.patch('/updateReligion',
    body('religion').isLength({
        min : 1,
        max : 15
    }).withMessage('religion should be required...'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required _id & religion'
        });
    }

    apiModel.updateReligion(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              req._id = result[0]._id,
              req.religion = result[0].religion

                if(result[0].religion ==req.religion ){
                    res.json({
                        result:'true',
                         msg:"data successfully updated"
                    })
                }else{
            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.patch('/updateSmoke',
    body('smoke').isLength({
        min:1,
        max:15
    }).withMessage('smoke should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required _id & smoke'
        });
    }

    apiModel.updateSmoke(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              req._id = result[0]._id,
              req.smoke = result[0].smoke

                if(result[0].smoke == req.smoke ){
                    res.json({
                        result:'true',
                         msg:"data successfully updated"
                    })
                }else{
            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.patch('/updateEducation',
    body('education').isLength({
        min:1,
        max:20
    }).withMessage('education should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required _id & education'
        });
    }

    apiModel.updateEducation(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              req._id = result[0]._id,
              req.education = result[0].education

                if(result[0].education ==req.education ){
                    res.json({
                        result:'true',
                         msg:"data successfully updated"
                    })
                }else{
            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.patch('/updateSexual',
    body('sexual').isLength({
        min:1,
        max:20
    }).withMessage('sexual should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required _id & sexual'
        });
    }

    apiModel.updateSexual(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              req._id = result[0]._id,
              req.sexual = result[0].sexual

                if(result[0].sexual ==req.sexual ){
                    res.json({
                        result:'true',
                         msg:"data successfully updated"
                    })
                }else{
            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.patch('/updateJoin',
    body('tag').isLength({
        min:1,
        max:20
    }).withMessage('tag should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required _id & sexual'
        });
    }

    apiModel.updateJoin(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              req._id = result[0]._id,
              req.tag = result[0].tag

                if(result[0].tag ==req.tag ){
                    res.json({
                        result:'true',
                         msg:"data successfully updated"
                    })
                }else{
            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.patch('/find_mobile_no',
    body('mobile_no').isLength({
        min:1,
        max:20
    }).withMessage('mobile_no should be required.'),
    body('country_code').isLength({
        min:1,
        max:10
    }).withMessage('country_code should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required mobile_no & country_code '
        });
    }

    apiModel.findMobile_no(req.body).then((result3)=>{

        var mobile_no = result3[0].mobile_no;
        console.log(mobile_no);
        var country_code = result3[0].country_code;
        console.log(country_code);
        var OTP = result3[0].OTP;
        twilio.messages.create({
             from:"+14799991055",
              to:country_code+""+mobile_no,
              body:"Dear customer, the one time password (OTP) to Verify your Number at Tamu  App is ******. This OTP will expire in 5 minutes "+OTP
        })
        
        if(result3.length == 0){
          
            res.json({
                result: 'false',
                msg:'mobile_no invalid',
            })
        }else{
             res.json({
                result: 'true',
                msg:'mobile_no valid',
                data: result3
            })

            // req.mobile_no = result[0].mobile_no

            // if(result[0].mobile_no == req.mobile_no ){
            //         res.json({
            //             result:'true',
            //             msg:"mobile_no valid",
            //             data:result[0]
                        
            //         })
            //     }else{

            // }
    }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.patch('/updateForgetPassword',
    body('mobile_no').isLength({
        min:1,
        max:20
    }).withMessage('mobile_no should be required'),
    body('country_code').isLength({
        min:1,
        max:20
    }).withMessage('country_code should be required'),
    body('password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required mobile_no ,country_code & password'
        });
    }

    apiModel.updateForgetPassword(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'mobile_no no does not valid',
            })
        }else{
            req.mobile_no = result[0].mobile_no,
            req.country_code = result[0].country_code,
            req.password = result[0].password

            if(result[0].mobile_no == req.mobile_no && result[0].country_code == req.country_code ){
                    res.json({
                        result:'true',
                        msg:"password successfully updated"
                    })
                }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
})

router.patch('/resend_otp',
    body('mobile_no').isLength({
        min:10,
        max:10
    }).withMessage('mobile_no should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required mobile_no'
        });
    }

    apiModel.resendOTP(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              req.mobile_no = result[0].mobile_no

                if(result[0].mobile_no == req.mobile_no ){
                    res.json({
                        result:'true',
                         msg:"OTP successfully updated"
                    })
                }else{
            }
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

})

router.get('/home/:id', (req,res,next)=>{

    apiModel.fetchAllDetails(req.params,req.query,req.body).then((result2)=>{
    //apiModel.fetchlatDetails(req.params,req.query,req.body).then((result2)=>{   
           //let  page = parseInt(req.query.page);
           //const limit = parseInt(req.query.limit) || 1;
           
       
         var new_id = parseInt(req.params.id)
         console.log(new_id)
         /*const latitude = parseFloat(req.body.latitude)
         console.log(latitude)
         const longitude = parseFloat(req.body.longitude)
         console.log(longitude,typeOf(longitude));*/
       
        if(result2.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            //req._id = result[0]._id
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result2
                
                
                // _id:result1[0]._id,
                // mobile_no:result1[0].mobile_no,
                // form_status:result1[0].form_status,
                // gender:result1[0].gender,
                // name:result1[0].name,
                // email:result1[0].email,
                // filename:result1[0].image[0].filename,
                // smoke:result1[0].smoke,
                // religion:result1[0].religion,
                // education:result1[0].education,
                // sexual:result1[0].sexual,
                // image:result1[0].image
            }); 
        }       
    }).catch((err)=>{
       res.json({message:err.message})
        console.log(err)
    })

});

router.patch('/logout',(req,res,next)=>{    
   apiModel.updateFCM(req.body).then((result)=>{
        console.log(req.body);
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id
            

            if(result[0]._id ==req._id ){
                    res.json({
                        result:'true',
                        msg:"user successfully logout"
                    })
            }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    }) 
});

router.patch('/changePassword',
    body('password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required min 6 digit.'),
    body('new_password').isLength({
        min:1,
        max:20
    }).withMessage('password should be required min 6 digit.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required mobile_no, password & new_password'
        });
    }

    apiModel.updateChangePassword(req.body).then((result)=>{
        console.log(req.body);
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'mobile_no and password  invalid',
            })
        }else{
            req._id = result[0]._id,
            req.password = result[0].password


            if(result[0]._id == req._id && result[0].password == req.password){
                res.json({
                    result:'true',
                    msg:"password successfully changed"
                })
            }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.put('/updateProfile/:id',(req,res,next)=>{

    apiModel.updateProfile(req.params,req.body).then((result)=>{
        var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'_id not found',
            })
        }else{
            req._id = result[0]._id
            

            if(result[0]._id ==req._id ){
                    res.json({
                        result:'true',
                        msg:"data successfully updated"
                    })
                }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.get('/viewProfile/:id',(req,res,next)=>{
    
    apiModel.viewProfile(req.params).then((result)=>{
        
        var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
              req._id = result[0]._id
            
                if(result[0]._id == req._id ){
                    res.json({
                        result:'true',
                        msg:"data successfully get",
                        data:result
                    })
                }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.post('/req_user',(req,res) => {
 apiModel.updRequest(req.body).then((result2) => {
  //apiModel.updateRequest(req.body).then((result2) => {
        //console.log(typeof req.body)
       //var user_id = req.body.user_id;
       // console.log(user_id,typeof(user_id))
        //var frnd_id = req.body.frnd_id;
       // console.log(frnd_id,typeof(frnd_id))
       //var status = req.body.status;
   var fcm = result2[0].fcm;
   console.log(fcm)
   var token = [fcm]
       var payload ={
         notification:{
            title: "New Like",
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
    }); 
     
    if(result2.length==0){
        res.json({
            result: "true",
            msg: "Request successfully",
            match_status:'0'
        });
    }
    else
    {
        /*req.user_id = result1[0].user_id,
        req.frnd_id = result1[0].frnd_id
        if((result1[0].user_id == req.user_id) && (result1[0].frnd_id == req.user_id)){*/
        res.json({
            result: "true",
            msg: "Request successfully",
            match_status:'1'

        });
     /*}else{

     }*/
    }
   }).catch((err)=>{
    msg:err.message
   })
});

router.patch('/updateRaking',
    body('status').isLength({
        min:1,
        max:10
    }).withMessage('status should be required.'),(req,res) => {

         const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, frnd_id & status'
        });
    }

   apiModel.updateRaking(req.body).then((result2) => {
        
     if(result2.length==0){
        res.json({
            result: "true",
            msg: "point successfully added",
           // match_status:'0'
        });
    }
    else
    {
        /*req.user_id = result2[0].user_id
        if(result2[0].user_id = req.user_id){*/
        res.json({
            result: "true",
            msg: "point successfully updated",
           // match_status:'1'

        });
  /*  }else{

        }*/
    }
   }).catch((err)=>{
    msg:err.message
   })
});

router.get('/ranking',(req,res) => {
    apiModel.getRanking(req.body).then((result1) => {
      
    if(result1){
        res.json({
            result: "true",
            msg:'record get successfully',
            data:result1
        });
    }else{
        res.json({
            result: "false",
            msg: 'record not found',
        });
    }
   }).catch((err)=>{
    res.json({msg:err.message})
   })
});




router.post('/request_user',(req,res,next)=>{

   apiModel.updateRequest(req.body).then((result) =>{
    console.log(req.body);
    
    if(result.length==0){
        res.json({
            result: "false",
            msg: "record not match",
            match_status:'0'

        });
    }
    else
    {   
           req.user_id = result.user_id,
           req.frnd_id = result.frnd_id
            
        if(result.user_id == req.user_id && result.frnd_id == req.frnd_id && req.status == '1'){
        res.json({
            result: "true",
            msg: "recod successfully match",
            match_status:'1'
        });
    }else{
            req.user_id = result.user_id,
            req.frnd_id = result.frnd_id

        
        if(result.user_id != req.user_id && result.frnd_id != req.frnd_id && req.status != '1'){
        res.json({
            result:'false',
            msg:'record not found',
            match_status:'0'
        })
    }else{
            req.user_id = result.user_id,
            req.frnd_id = result.frnd_id

        
        if(result.user_id == req.frnd_id && result.frnd_id == req.user_id && req.status == '1'){
        res.json({
            result:'true',
            msg:'record successfully match',
            match_status:'1'
        })
    }else{
          req.user_id = result.user_id,
          req.frnd_id = result.frnd_id
         
         if(result.user_id == req.frnd_id && result.frnd_id == req.user_id && req.status == '0'){
            res.json({
                true:'false',
                msg:'record successfully deleted'
            })
         }
    }

    }

    }
    }
    
     }).catch((err)=>{

       res.json({message:err.message})
     })
});

router.post('/sendmsg',(req,res,next)=>{

    apiModel.addchat(req.body).then((result)=>{
        
        if(result==0){
            res.json({
           result:'true',
            msg : 'record add successfully'
            })
        }else{
           /* req.sender_id = result[0].sender_id,
            req.receiver_id = result[0].receiver_id
            if(result[0].sender_id == req.sender_id && result[0].receiver_id == req.receiver_id){*/
             res.json({
            result:'true',
            msg :'record update successfully',
            //data:result1
            })
         /*}
         else{

         }*/
        }
        
    }).catch((err)=>{
        res.json({message:err.message})
    })
});


router.get('/chat_list_sam/:id',(req,res) => {

   apiModel.msgListsam(req.params.id).then((result1) => {
  
  if(result1.length==0)
  {
    res.json({
        result:'false',
        msg:'record not found'
    })
  }else{
    res.json({
        result:'true',
        msg:'record successfully get',
        data:[{result1}]
    })
  }

   });

});

router.get('/msglist/:id',(req,res,next)=>{
    
    apiModel.msgList(req.params.id).then((result1)=>{
        
        var sender_id1 = parseInt(req.params.id);
        var receiver_id1 = parseInt(req.params.id);
         
        if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
              //req._id = result[0]._id
            
               // if(result[0]._id == req._id ){
                    res.json({
                        result:'true',
                        msg:"data successfully get",
                        data:result1
                       /* _id:result1[0]._id,
                        name:result1[0].name,
                        mobile_no:result1[0].mobile_no,
                        msg:result1[0].msg,
                        filename:result1[0].image[0].filename*/
                    
                        
                    })
                

               
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.get('/get_dislikelist/:id',(req,res,next)=>{
    
    apiModel.getdislikeList(req.params.id).then((result1)=>{
        
        var new_id = parseInt(req.params.id);
        
        if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

                 var result2=[];
               for(var i=0; i<result1.length; i++) {
                result2.push(result1[i]);
               }

               /*for(var i=0; i<result1.length; i++) {
                var result2  = result1[i]
               }*/
                  req.user_id = result2.user_id

              //  if(result2.user_id == req.user_id ){
                    res.json({
                        result:'true',
                        msg:"data successfully get",
                        //user_id:result1[0].user_id,
                        //frnd_id:result1[0].frnd_id,
                          data:result1
                        
                        //data:[{
                           // result2
                            //_id:result2._id,
                            //name:result2.name,
                            //mobile_no:result2.mobile_no,
                            //filename:image.filename

                        //}]
                    
                        
                    
                    })
               // }else{

           // }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});


router.get('/get_likelist/:id',(req,res,next)=>{
    
    apiModel.getlikeList(req.params.id).then((result1)=>{
        
        var new_id = parseInt(req.params.id);
        
        if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{

              /*  var result2=[];
               for(var i=0; i<result1.length; i++) {
                result2.push(result1[i]);
               }
*/
             // req.id = result1[0].user_id
            
                //if(result1[0].user_id == req.id ){
                    res.json({
                        result:'true',
                        msg:"data successfully get",
                        //user_id:result1[0].user_id,
                        //frnd_id:result1[0].frnd_id,
                        data:result1
                         //data:[{
                           // result1
                           /* _id:result2._id,
                            name:result2.name,
                            filename:result2.image*/
                           // path:result1[0].image[0].path

                       // }]
                        
                    
                    })
              // }else{

            //}    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});
router.delete('/deleteProfile/:user_id',(req,res,next)=>{
    
    apiModel.deleteProfile(req.params).then((result)=>{
        
        //var new_id = parseInt(req.params.user_id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
              req.user_id = result[0].user_id
            
                if(result[0].user_id == req.user_id ){
                    res.json({
                        result:'true',
                        msg:"record deleted successfully",
                    
                    })
                }else{
                    if(result1[0].frnd_id ==0)
                        res.json({
                            result:'false',
                            msg:'frnd_id not match'
                        })
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.patch('/todaymood',(req,res,next)=>{ 
   
    apiModel.moodRequest(req.body).then((result1) => {

     if(result1.length==0){
        res.json({
            result: "true",
            msg: "record not found",
        });
    }
    else
    {
         req._id = result1._id,
         req.tag = result1.tag

        if(result1.mood ==req.mood ){
        res.json({
            result: "true",
            msg: "data successfully updated",

        });
    }
    }
   }).catch((err)=>{
        res.json({message:err.message})
    });

});


router.post('/superlike', 
    body('status').isLength({
        min:1,
        max:2
    }).withMessage('status should be required.'),(req,res,next)=>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required user_id, frnd_id & status'
        });
    }
    apiModel.superRequest(req.body).then((result1) => {

     if(result1.length==0){
        res.json({
            result: "true",
            msg: "Request successfully",
            match_status:'0'
        });
    }
    else
    {
        res.json({
            result: "true",
            msg: "Request successfully",
            match_status:'1'

        });
    }
   }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/moodList', (req,res,next)=>{
    
    apiModel.moodDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.patch('/updateImage',upload.any('image1','image2','image3','image4','image5','image6'),(req, res,err) => {
   
    apiModel.updateimage(req.body,req.files).then((result)=>{

        
        var _id = req.body._id;
        var oldfilename = req.body.filename;
         console.log(oldfilename);
        //var media = req.body.fieldname;
        //console.log(media)
        var files = req.files;
        console.log(files)
        //var length = req.files.length;
        var extensions = ['.jpg', '.jpeg', '.png'];
     
       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',

            })
        }else{
         
          /*req.files.image1 = result[0].image[0].fieldname,
          req.files.image2 = result[0].image[0].fieldname,
          req.files.image3 = result[0].image[0].fieldname,
          req.files.image4 = result[0].image[0].fieldname,
          req.files.image5 = result[0].image[0].fieldname,
          req.files.image6 = result[0].image[0].fieldname*/

            //if(result[0].image[0].fieldname == "image1" ||result[0].image[0].fieldname == "image2"||result[0].image[0].fieldname == "image3"||result[0].image[0].fieldname == "image4"||result[0].image[0].fieldname == "image5"||result[0].image[0].fieldname == "image6" ){
                res.json({
                     result:'true',
                    msg:'file uploaded successfully',
                    body:result
                })

            //}else{

           // }
        }
    }).catch((err)=>{
        console.log(err)
        res.json({message:err.message})
    });
});

router.put('/updateSetting/:id',(req,res,next)=>{

    apiModel.updateSetting(req.params,req.body).then((result)=>{
       
        var new_id = parseInt(req.params.id);
        
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'_id not found',
            })
        }else{
            req._id = result[0]._id
            

            if(result[0]._id ==req._id ){
                    res.json({
                        result:'true',
                        msg:"data successfully updated"
                    })
                }else{

            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.get('/likeCount/:id',(req,res,next)=>{

    apiModel.getlikeCount(req.params).then((result1)=>{
        var new_id = parseInt(req.params.id);
        
        if(result1.length==0){
            res.json({
                result: 'false',
                msg:'recond not found',
            })
        }else{
          /*  req.new_id = result1[0].user_id*/
            

           /* if(result1[0].user_id ==req.new_id ){*/
                    res.json({
                        result:'true',
                        msg:"like list successfully get",
                        likeCount:result1
                    })
               /* }else{*/

            /*} */   
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.patch('/block_user',(req,res,next)=>{

    apiModel.blockUser(req.body).then((result)=>{
        
        if(result.length==0){
        res.json({
            result:'false',
            msg : 'record not found'
           })
        }else{
            req.user_id = result[0].user_id,
            req.frnd_id = result[0].frnd_id
            if(result[0].user_id == req.user_id && result[0].frnd_id == req.frnd_id){
        res.json({
            result:'true',
            msg :'user successfully blocked',
            //data:result1
            })
         }
         else{

         }
        }
        
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/report_user',
      body('tag').isLength({
        min:1,
        max:100
    }).withMessage('tag should be required.'),(req,res,next)=>{
       
       const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg: 'parameter required user_id , frnd_id and tag'
        });
    }
    apiModel.reportUser(req.body).then((result)=>{
        
        console.log(req.body)
        if(result.length==0){
            res.json({
                  result:'false',
                   msg : 'report not found'
                   //data:result1
            })
        }else{
             res.json({
                  result:'true',
                  msg :'report updated successfully'
                  //data:result
            })
         }
         
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.patch('/updatelatlong',
    body('latitude').isLength({
        min:1,
        max:20
       }).withMessage('lat should be required.'),
       body('longitude').isLength({
        min:1,
        max:20
       }).withMessage('lang should be required.'),(req,res,next)=>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id ,latitude & longitude'
        });
    }

    apiModel.updatelatlang(req.body).then((result)=>{
        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            req._id = result[0]._id,
            req.latitude = result[0].latitude,
            req.longitude = result[0].longitude

            if(result[0].latitude ==req.latitude && result[0].longitude ==req.longitude){
                res.json({
                    result:'true',
                    msg:'latitute and longitute successfully updated'
                })
            }    
        }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.get('/fatch_distance/:id', (req,res,next)=>{

   apiModel.fetchDistance(req.params,req.body).then((result1)=>{
         var new_id = parseInt(req.params.id)
         //const latitude = req.body.latitude
         //console.log(latitude, typeOf latitude )
         //const longitude = req.body.longitude
         //console.log(longitude,typeOf(longitude))
       
       if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            //req._id = result[0]._id
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result1
            }); 
        }       
    }).catch((err)=>{
       res.json({message:err.message})
        console.log(err)
    })

});

router.get('/gender_list', (req,res,next)=>{
    
   apiModel.fetchGender(req.body).then((result)=>{

       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }       
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/user_preference_list', (req,res,next)=>{
    
   apiModel.fetchPreference(req.body).then((result)=>{

       if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }       
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.post('/androidPushNotification',(deviceToken,messageBody,type,callback)=>{
    const serverKey = 'AAAAwmnSsUI:APA91bHRKdTf1mTbUNF4u-MYrNhtZpx0llJcIeOeN8wrK3hwu0jFY5pAQDa36hNcbbGyKp99IGNKZ1fv-inpKe78IICzoil91a22RxxMh1yYA0cNOoYQDpcTdhBHxtybtpP37zuJEdut';
    const fcm = new FCM(serverKey);
    const message ={
        to:deviceToken,
        collapse_key:`TEST`,
        notification :{
            title : `Test`,
            body : messageBody,
            sound : `ping.aiff`,
            delivery_receipt_requested : true
        },
        data : {
            message : messageBody,
            type:type
        }
    };
    
    fcm.send(message,callback);

});

router.post('/androidPushNotification/:id',(req,res)=>{
    apiModel.generateNotification(req.body,req.params).then((result)=>{

        var new_id=parseInt(req.params.id)
        if(result.length==0){
            res.json({
                result:'false',
                msg:'record not found'
            })
        }else{
            res.json({
                    result:'true',
                    msg:'successfully'
                })
        }
    }).catch((err)=>{
        res.json({msg:err.message})
    })
});

router.get('/like_count', (req, res,next)=>{
 
  apiModel.likeCount(req.body).then((result)=>{

       if(result){
               response ='true',
                 msg ='record found'
            }else{
               response = 'false',
                msg =  'record not found'
           } 
       
          res.json({
            result:response,
            msg:msg,
            like_count:result
          })
          

 }).catch((err)=>{
    //res.render({message:err.message})
    console.log(err)
 })
});

router.get('/privacy_policy', (req,res,next)=>{
    
    apiModel.privacypolicy(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                _id:result[0]._id,
                file:result[0].data
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/term_and_condition',(req,res,next)=>{
    
    apiModel.termandcondition(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                _id:result[0]._id,
                file:result[0].data
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.patch('/user_subscription',
    body('month').isLength({
        min:1,
        max:12
    }),(req,res,next)=>{
      
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required _id, month & price'
        });
    }
    apiModel.userSubscription(req.body).then((result)=>{
        
        if(result==0){
            res.json({
           result:'true',
            msg : 'record not found'
            })
        }else{
            
            req._id = result[0]._id,
            req.month = result[0].month,
            req.price = result[0].price
        if(result[0].month == req.month ||result[0].price == req.price){
                res.json({
                   result:'true',
                   msg :'record successfully updated',
                   data:result1
                })
        }else{

         }
        }
        
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.post('/sendmsg_scribe',
     body('msg').isLength({
        min:1,
        max:100
    }),(req,res,next)=>{

  const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: 'false',
            //errors: errors.array()
            msg:'parameter required sender_id, receiver_id & msg..'
        });
    }

    apiModel.addchatScribe(req.body).then((result)=>{
        
        if(result==0){
            res.json({
               result:'false',
               msg : 'record not added'
            })
        }else{
           /* req.sender_id = result[0].sender_id,
            req.receiver_id = result[0].receiver_id
            if(result[0].sender_id == req.sender_id && result[0].receiver_id == req.receiver_id){*/
             res.json({
            result:'true',
            msg :'record add successfully',
            data:result
            })
         /*}
         else{

         }*/
        }
        
    }).catch((err)=>{
        res.json({message:err.message})
    })
});

router.get('/msg_list/:id',(req,res,next)=>{
    
    apiModel.msg_List(req.params.id).then((result1)=>{
        
        var sender_id1 = parseInt(req.params.id);
        var receiver_id1 = parseInt(req.params.id);
         
        if(result1.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
              //req._id = result[0]._id
            
               // if(result[0]._id == req._id ){
                    res.json({
                        result:'true',
                        msg:"data successfully get",
                        data:result1
                       /* _id:result1[0]._id,
                        name:result1[0].name,
                        mobile_no:result1[0].mobile_no,
                        msg:result1[0].msg,
                        filename:result1[0].image[0].filename*/
                    
                        
                    })
                }
    }).catch((err)=>{
        res.json({message:err.message})
    })

});

router.get('/rewardList', (req,res,next)=>{
    
    apiModel.rewardDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/passionsList', (req,res,next)=>{
    
    apiModel.passionsDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});

router.get('/superLike_List', (req,res,next)=>{
    
    apiModel.SuperLikeDetails(req.body).then((result)=>{

        if(result.length==0){
            res.json({
                result: 'false',
                msg:'record not found',
            })
        }else{
            res.json({
                result:'true',
                msg:'record get successfully',
                data:result
            }); 
        }   
    }).catch((err)=>{
       res.json({message:err.message})
    })
});


module.exports = router;