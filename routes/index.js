const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const indexModel = require('../models/indexModel')

/* middleware function to destry user session */
router.all((req, res, next)=>{
  if(req.session.sunm!=undefined||req.session.srole=='admin')
  	res.redirect('/admin/index')
  next()    
});

router.use((req, res, next)=>{
  if(req.session.sunm !=undefined || req.session.srole=='admin')
    res.redirect('/admin/index')
     next()   
});



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage });


router.get('/', (req, res,next)=>{
  res.render('home');
});

/* GET home page. */
router.get('/login', (req, res,next)=>{
  res.render('login',{'output':''});
});

router.get('/signup', (req, res, next)=>{
  res.render('register',{'output':''});
});

router.get('/forgot', (req, res, next)=>{
  res.render('forgot');
});

router.get('/logout',(req,res,next)=>{    
    req.session.destroy(function(err){  
        if(err){  
          console.log(err);  
         }  
        else  
        {  
          res.render('login');  
        }  
    })
})


router.post('/signup',(req,res,next)=>{

	indexModel.registerUser(req.body).then((result)=>{
	
	   if(result)
            result =true,
		    msg ="User registered Successfully...."
            
       else
           result = false,
        	msg =" email already exit,Plese enter new email"
            
       // res.render('register',{'output':msg});
          res.json({
            result:result,
            msg:msg
          })
          

	}).catch((err)=>{
		//res.render({message:err.message})
		console.log(err)
	})
})


router.post('/login',
    /* body('email').isEmail().normalizeEmail().withMessage('email should be required.'),
     body('password').isStrongPassword({
        minLength: 6,
     minLowercase: 1,
    minUppercase: 1,
     minNumbers: 1
    }).withMessage('password should be required min 6 character,1 lowercase, 1 uppercase & 1 number.'),*/(req,res,next)=>{
   

    /*const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            result: false,
            errors: errors.array()
        });
    }*/


    indexModel.userLogin(req.body).then((result)=>{
        console.log(req.body)
        console.log(result)
       if(result.length==0){
			res.render('login',{'output':'Invalid email & password....'});
            /*res.json({
                result:false,
                msg:'email  not registered please enter register email..'
            })*/
		}
		else{
			    req.session.sunm = result[0].email,
			    req.session.srole = result[0].role

			    if(result[0].role=="admin"){
            res.redirect('/admin/index')
            /* res.json({
                result:true,
                msg:'admin successfully login..'
             })*/
            }else{
             res.redirect('/login')    
            }
        }
      }).catch((err)=>{
		//res.render({message:err.message})
        console.log(err)
	})
})




module.exports = router;