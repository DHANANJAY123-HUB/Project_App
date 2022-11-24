const db = require('./connection')
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
const path = require('path');

function apiModel() {
	this.registerUser=(userDetails)=>{
		console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('user').find().toArray((err,result)=>{
				if(err)
					reject(err)
				else
				{
					var user_id
					var OTP = Math.floor(1000 + Math.random() * 9000);
					var refer_code = Math.floor(1000 + Math.random() * 9000);
					var flag=0

					if(result.length==0)
						_id=1
					else
					{   
					
						var max_id=result[0]._id

						for(let row of result)
						{

						 if(row._id>max_id)
						 	max_id=row._id
						
						 if(row.mobile_no==userDetails.mobile_no && row.country_code==userDetails.country_code)
						 	flag=1							 	
						 	
						}
						_id=max_id+1  	
					}
					
					//userDetails.user_id=user_id
					userDetails.form_status='0'
					userDetails.role="user"
					userDetails.info=Date()
					userDetails.OTP=OTP.toString()
					userDetails.varify_status='0'
					userDetails.refer_code=`ta`+refer_code.toString()
					//userDetails.indexes({location:"2dsphere"});
					userDetails.user_subscribe='no'
					userDetails.distance='0'
					userDetails.like_count=0
					userDetails.dislike_count=0
					userDetails.msg_count=0
					userDetails.superlike_count=0
					userDetails.age_range_min='0'
					userDetails.age_range_max='0'
					userDetails.latitude='0'
					userDetails.longitude='0'
					userDetails.user_status=0
					userDetails.block_status=0
					userDetails.report_status=0

					if(flag)
					{
						resolve(0)
					}
					else
					{
						db.collection('user').insertOne(userDetails,(err1,result1)=>{
						   //err1 ? reject(err1) : resolve(result1);
						   if(err1){
						   	reject(err1)
						   }
						   else
						   {
						   	db.collection('user').find({'country_code':userDetails.country_code,'mobile_no':userDetails.mobile_no}).toArray((err2,result2)=>{
						   		err2?reject(err2):resolve(result2)
						   	})
						   }
					 	})	
					}
					//resolve(result)
				}	
			})
			
		})	
	}

	this.googleLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'google_id':userDetails.google_id}).toArray((err,result)=>{
				//err?reject(err):resolve(result)
			/*})*/
				if(result.length==0){
					userDetails.form_status='1'
					db.collection('user').insertOne(userDetails,(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
				    })
				}else{
					
			      /* db.collection('user').insertOne(userDetails,(err1,result1)=>{
						//err1 ? reject(err1) : resolve(result1);
						if(err1){
							reject(err1)
						}else{
						db.collection('user').find({'google_id':userDetails.google_id}).toArray((err2,result2)=>{
						err2 ? reject(err2) : resolve(result2)
					      })	
						}
						resolve(result1)
					})*/
                    resolve(result)
			        }
				/*}*/
				//resolve(result)
			})
		})
	}

	this.facebookLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'facebook_id':userDetails.facebook_id}).toArray((err,result)=>{
				//err?reject(err):resolve(result)
				
				if(result.length==0){
					userDetails.form_status ='1'
					db.collection('user').insertOne(userDetails,(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1);
				    })
				}else{
					/*db.collection('user').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'fcm':userDetails.fcm}},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})*/
					resolve(result)
				}
				
			})
		})
	}

	this.uploadimage=(userDetails,img)=>{
		console.log(userDetails)
    return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				} else{
					db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'image':img,'form_status':'7'}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
				}
				resolve(result)
			})
		})
	}

	this.userLogin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'mobile_no':userDetails.mobile_no,'country_code':userDetails.country_code,'password':userDetails.password}).toArray((err,result)=>{
				//err ? reject(err) :resolve(result)
				if(err){
					reject(err)
				}else{
					db.collection('user').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'fcm':userDetails.fcm}},(err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
					})
				}
				resolve(result)
			})
		})
	}

	this.updatePassions=(userDetails,new_id )=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{

			db.collection('user').updateOne({'_id':ObjectId(new_id)},{$set:{'passion':userDetails/*{'passions_id':new mongoose.Types.ObjectId(userDetails.passions_id),'passions':userDetails.passions}*/}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);

			})
		}
		   resolve(result)

		 })
		})				
	}

	this.updateLikeReward=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
        var total_like_count = 0;
        var like_count = result[0].like_count;
        console.log(like_count);
        if (like_count == undefined) {
          total_like_count = userDetails.like_count;
        }else{
          total_like_count = like_count+userDetails.like_count;
        }
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'like_count':total_like_count,'date':userDetails.date}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);

			})
		}
		   resolve(result)

		 })
		})				
	}

	this.updateDisLikeReward=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
					var total_dislike_count = 0;
          var dislike_count = result[0].dislike_count;
           if (dislike_count == undefined) {
            total_dislike_count = userDetails.dislike_count;
           }else{
             total_dislike_count = dislike_count+userDetails.dislike_count;
            }
			  db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'dislike_count':total_dislike_count,'date':userDetails.date}},(err1,result1)=>{
				  err1 ? reject(err1) : resolve(result1);
        })
		  }
		   resolve(result)
      })
		})				
	}

	this.updateMsgReward=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
            var total_msg_count = 0;
            var msg_count = result[0].msg_count;
           if (msg_count == undefined) {
            total_msg_count = userDetails.msg_count;
           }else{
             total_msg_count = msg_count+userDetails.msg_count;
            }

			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'msg_count':total_msg_count,'date':userDetails.date}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);

			})
		}
		   resolve(result)

		 })
		})				
	}
  
  this.updateSuperLikeReward=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
					var total_superlike_count = 0;
            var superlike_count = result[0].superlike_count;
           if (superlike_count == undefined) {
            total_superlike_count = parseInt(userDetails.superlike_count);
           }else{
             total_superlike_count = superlike_count+parseInt(userDetails.superlike_count);
            }

			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'superlike_count':total_superlike_count,'date':userDetails.date}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);

			})
		}
		   resolve(result)

		 })
		})				
	}

	this.updateGender=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{

			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'gender_id':new mongoose.Types.ObjectId(userDetails.gender_id),'gender':userDetails.gender,'form_status':'2'}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);

			})
		}
		   resolve(result)

		 })
		})				
	}

	this.updatePreferece=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{

			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'preference_id':new mongoose.Types.ObjectId(userDetails.preference_id),'user_prefrence':userDetails.user_prefrence,'form_status':'2'}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);

			})
		}
		   resolve(result)

		 })
		})				
	}

	this.updatefullName=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'first_name':userDetails.first_name,'last_name':userDetails.last_name,'form_status':'3'}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		  resolve(result)
		})
		})				
	}

	this.updateDob=(userDetails)=>{
        
    var dob = userDetails.date_of_birth;
    var year = Number(dob.substr(0, 4));
    var month = Number(dob.substr(4, 2)) - 1;
    var day = Number(dob.substr(6, 2));
    var today = new Date();
    var yy = today.getFullYear() - year;
    var mm = today.getMonth()-month;
    var dd = today.getDate()-day;
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
      yy--;
      mm--;
      dd--;
    }
    return new Promise((resolve,reject)=>{
      db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'date_of_birth':dob,'age':yy.toString(),'form_status':'4'}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		   resolve(result)
		})	
		})			
	}

	this.updateEmail=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'email':userDetails.email,'form_status':'5'}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.updatePassword=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'password':userDetails.password}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
		})

	}

	this.userSubscription=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_subscribe':userDetails.user_subscribe,'month':userDetails.month,'price':userDetails.price}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
	 })

	}

	this.fetchDetails=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	

	this.fetchAllDetails=(new_id)=>{
      return new Promise((resolve,reject)=>{
         // const limit = 1;
          //const skip = 1;
        
        db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
        	//err ? reject(err) : resolve(result);
       if(err){
            reject(err)
             }else{
             db.collection('user_request').find({'user_id':ObjectId(new_id)}).toArray((err1,result1)=>{
             	//err ? reject(err) : resolve(result);
             
               if (err1) {
                 reject(err1)
             	}else{
             		
               var user_gender = result[0].gender;
               //var frnd_id = result1[0].frnd_id;
               console.log(user_gender);
               
               /*var frnd_id = [];
             	//var newObj = frnd_id.reduce(() => Object.assign(), {});
               for(var i=0;i<result1.length;i++){
                   frnd_id.push(result1[i].frnd_id);
                     console.log(frnd_id)
                }*/
                /* var frnd_id=[];
                for(let row of result1){
                 frnd_id = row.frnd_id;
                  console.log(frnd_id,typeof frnd_id);
               /* }*/
                 
                for(var i = 0; i < result1.length; i++) {
                	 var frnd_id = [];
                	 frnd_id.push(result1[i].frnd_id);
                	 console.log(frnd_id)
                	}
                	for(var j = 0; j < frnd_id.length; i++) {
              db.collection('user').find({'gender': {$ne :user_gender},'_id':{$ne : frnd_id.pop(frnd_id[j])}}).toArray((err2,result2)=>{
              err2 ? reject(err2) : resolve(result2);

              })
            }
           }
           
          })
         }
      })
    })
    }


 /* }*/
        /*if (err) {
        	reject(err)
        }else{
        	console.log("___________")
        	
        db.collection('user').aggregate([
         {
            $geoNear:{
              near:{type:"Point",coordinates:[parseFloat(longitude),parseFloat(latitude)]},
              key:"location",
              location.geo: "2dsphere",
              // maxDistance:15,
              distanceField:"dist.calculated",
              //query: {address:"indore"},
              //includeLocs: "dist.location",
              spherecial:true
               
            } 
         }
        ]).toArray((err2,result2)=>{
            err2 ? reject(err2):resolve(result2)
             console.log(result2)
          })
        }
     })
  })
} */       


this.fetchlatDetails=(new_id,latitude,longitude)=>{
      return new Promise((resolve,reject)=>{
       db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
        	//err ? reject(err) : resolve(result);
       
        if (err) {
        	reject(err)
        }else{
        	console.log("___________")
        	
        db.collection('user').aggregate([
         {
         	 "location.geo": {
            $near:{
              $geometry:{type:"Point",coordinates:[parseFloat(longitude),parseFloat(latitude)]},
              key:"location",
              //coordinates: "2d",
               $maxDistance:10000
              //distanceField:"dist.calculated",
              //query: {address:"indore"},
              //includeLocs: "dist.location",
              //spherecial:true
               
            } 
         }
       }
        ]).toArray((err2,result2)=>{
            err2 ? reject(err2):resolve(result2)
             console.log(result2)
          })
        }
     })
  })
}        

this.fetchDistance=(new_id,latitude,longitude)=>{
   	return new Promise((resolve,reject)=>{
   		db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
   			if(err){
   				reject(err)
   			}else{
   				var latitude = result[0].latitude;
   				console.log(latitude)
   				var longitude = result[0].longitude;
   				console.log(longitude)
   			function getDistanceFromLatLonInKm(lat1=latitude , lon1=longitude, lat2=21.8129, lon2=80.1838) {
             var R = 6371; // Radius of the earth in km
             var dLat = deg2rad(lat2-lat1);  // deg2rad below
             var dLon = deg2rad(lon2-lon1); 
             var a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
              return d;
             }
             function deg2rad(deg) {
             return deg * (Math.PI/180)
             }
           console.log(getDistanceFromLatLonInKm());
            db.collection('user').updateOne({'_id':ObjectId(new_id)},{$set:{'distance':getDistanceFromLatLonInKm()}},(err1,result1)=>{
            err1? reject(err1): resolve(result1)
             console.log(result1)
        })
      }
      resolve(result)
      })
      })
  }
  

	this.verifyOTP=(userDetails)=>{
		console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id),'OTP':userDetails.OTP}).toArray((err,result)=>{
				//err ? reject(err) : resolve(result);
				if(err){
					reject(err)
				}
				else
				{
          var form_status = result[form_status];
					var max_status=0;
					for(let row of result)
						{
						   if(row.form_status<max_status)
						   max_status=row.form_status
						}
					form_status=max_status+1
					userDetails.form_status = form_status;
					db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'form_status':userDetails.form_status,'varify_status':'1'}},(err1,result1)=>{
				       err ? reject(err1) : resolve(result1);
			        })

			    }
                resolve(result);
			    
			})
		})	
	}

	this.maleDetails=(male)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'gender':'male'}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.femaleDetails=(female)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'gender':'female'}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.ageDetails=(age)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'age':age}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.updateSmoke=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
            db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'smoke':userDetails.smoke}},(err1,result1)=>{
				err1? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.updateReligion=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'religion':userDetails.religion}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.updateEducation=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'education':userDetails.education}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.updateSexual=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'sexual':userDetails.sexual}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.updateJoin=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'tag':userDetails.tag}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.findMobile_no=(userDetails)=>{
		var OTP = Math.floor(1000 + Math.random() * 9000);	
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'mobile_no':userDetails.mobile_no,'country_code':userDetails.country_code}).toArray((err,result)=>{
				
				if(err){
			     reject(err)
        }else{
			db.collection('user').updateOne({'mobile_no':userDetails.mobile_no,'country_code':userDetails.country_code},{$set:{'OTP':OTP.toString()}},(err1,result1)=>{
				
				db.collection('user').find({'mobile_no':userDetails.mobile_no,'country_code':userDetails.country_code}).toArray((err,result3)=>{
           resolve(result3)
        })
				// err1 ? reject(err1) : resolve(result);
			})
		}
		// resolve(result)
			})
		})
	}


this.findMobile_no_get=(userDetails)=>{
		
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':userDetails._id}).toArray((err,results)=>{
			err ? reject(err) : resolve(results)
			console.log(results);
		})
		})
	}

this.updateForgetPassword=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'mobile_no':userDetails.mobile_no,'country_code':userDetails.country_code}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			  db.collection('user').updateOne({'mobile_no':userDetails.mobile_no,'country_code':userDetails.country_code},{$set:{'password':userDetails.password}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			  })
      }
		resolve(result)
		})
	})

}

this.resendOTP=(userDetails)=>{
	var OTP = Math.floor(1000 + Math.random() * 9000);	
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'mobile_no':userDetails.mobile_no}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'mobile_no':userDetails.mobile_no},{$set:{'OTP':OTP.toString()}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

this.updateChangePassword=(userDetails)=>{
	console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id),'password':userDetails.password}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			  db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'password':userDetails.new_password}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			  })
      }
		resolve(result)
		})
	})

}

this.updateProfile=(new_id,userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(new_id)},{$set:userDetails/*{'name':name,img'date_of_birth':date_of_birth,'email':email,'smoke':smoke,'religion':religion,'education':userDetails.education,'sexual':userDetails.sexual,'join':userDetails.join},new:true}*/},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
		})

}

this.viewProfile=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			err?reject(err):resolve(result)
		})
		})
      
	}


this.updateFCM=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'fcm':userDetails.fcm}},(err1,result1)=>{
				err ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
		})
  }

  this.updateRaking=(userDetails)=>{
  	
		return new Promise((resolve,reject)=>{
       db.collection('user_request').find({'user_id':ObjectId(userDetails.user_id)}).toArray((err,result)=>{
				 //err ? reject(err) : resolve(result);
				
				if(result.length==0){
					    var point = 0
              var total_point;
             if(userDetails.status == '1'){
         	       total_point = point+1;
              }else if(userDetails.status=='0'){
  	    	       total_point = point-1;
  	          }else if(userDetails.status=='2'){
  	             total_point = point+2;
  	          }else if(userDetails.status=='3'){
  	             total_point = point-10;
  	          }else if(userDetails.status=='4'){
  	             total_point = point-10;		
  	          }else{
                 total_point =point;
  	          }
			db.collection('user_request').insertOne({'user_id':new mongoose.Types.ObjectId(userDetails.user_id),'frnd_id':new mongoose.Types.ObjectId(userDetails.frnd_id),'status':userDetails.status,'point':total_point},(err1,result1)=>{
          err1 ? reject(err1) : resolve(result1);
			      })
				}else{
         var  point = result[0].point;
         var total_point;
         console.log(point)
				if(userDetails.status == '1'){
         	 total_point = point+1;
        }else if(userDetails.status=='0'){
  	    	 total_point = point-1;
  	    }else if(userDetails.status=='2'){
  	      total_point = point+2;
  	   }else if(userDetails.status=='3'){
  	       total_point = point-10;
  	    }else if(userDetails.status=='4'){
  	       total_point = point-10;	
  	    }else{
  	    	  
           total_point = point;
  	    }
			     db.collection('user_request').updateOne({'user_id':ObjectId(userDetails.user_id)},{$set:{'status':userDetails.status,'point':total_point}},(err2,result2)=>{
             err2 ? reject(err2) : resolve(result2);
			     })
		    }

		//resolve(result)
	   })
    
  })
}



this.updRequest=(userDetails) => {
  	return new Promise((resolve,reject)=>{
       
  	  db.collection('user_request').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'frnd_id':mongoose.Types.ObjectId(userDetails.frnd_id),'status':userDetails.status,'superlike_status':userDetails.superlike_status,'current_date':new Date()},(err,result)=>{
        //err ? reject(err) : resolve(result)
      
      if(err){
      	reject(err)
      }else{
        
      db.collection('user').find({'_id':mongoose.Types.ObjectId(userDetails.frnd_id)}).toArray((err2,result2)=>{
      	 err2 ? reject(err2) : resolve(result2)
      })
    }
  //})
          /*if (err) {
           	reject(err)
          }else{*/
      db.collection('user_request').find({'user_id':mongoose.Types.ObjectId(userDetails.frnd_id),'frnd_id':mongoose.Types.ObjectId(userDetails.user_id),'status':'1'}).toArray((err1,result1)=>{
         err1 ? reject(err1) : resolve(result1)
        /* if (result1.length==0) {
           	db.collection('user_request').insertOne({'user_id':mongoose.Types.ObjectId(userDetails.user_id),'frnd_id':mongoose.Types.ObjectId(userDetails.frnd_id),'status':userDetails.status,'superlike_status':userDetails.superlike_status,'current_date':new Date()},(err,result)=>{
               err ? reject(err) : resolve(result)
            })
          }else{
          	db.collection('user_request').updateOne({'user_id':mongoose.Types.ObjectId(userDetails.frnd_id),'frnd_id':mongoose.Types.ObjectId(userDetails.user_id)},{$set:{'status':userDetails.status,'superlike_status':userDetails.superlike_status}},(err2,result2)=>{
              err2 ? reject(err2) : resolve(result2)
            })*/
          //}
        
    })
      })
    })
  }

  this.getRanking=()=>{
		return new Promise((resolve,reject)=>{
			 //var mysort = { point: -1 };
			db.collection('user_request').find().toArray((err,result)=>{
			//err ? reject(err) : resolve(result)
			//console.log(result)
			if(result.length == 0){
          
			}else{
				
				var user_id = [];
          for(var i=0;i<result.length;i++){
              user_id.push(result[i].user_id);
              console.log(user_id)
        }

        db.collection('user_request').aggregate([
              { $lookup:
             
          	    {
                 from : 'user',
                 localField :'user_id',
                 foreignField : '_id',
                      as : 'data'
                   }
                  },
                  {
                  	$sort:{point:-1}
                  },
                  {
                  	$limit:5
                  }
                
                ]).toArray((err1,result1)=>{
                	err1 ? reject(err1) : resolve(result1)

		            })
             }
       //resolve(result)
      })
	})
	}


 

   this.addchat=(userDetails) =>{
   	return new Promise((resolve,reject)=>{
   		     var status = '0';
   		db.collection('chat_list').find({'sender_id':ObjectId(userDetails.sender_id),'receiver_id':ObjectId(userDetails.receiver_id)}).toArray((err,result)=>{
   		   
   		 var sender_id=[];
	      var receiver_id = [];
         for(var i=0;i<result.length;i++){
            sender_id.push(result[i].sender_id);
              receiver_id.push(result[i].receiver_id);
        }
   		
   		if((userDetails.sender_id == sender_id && userDetails.receiver_id == receiver_id)){
         db.collection('chat_list').find({'sender_id':userDetails.receiver_id,'receiver_id':userDetails.sender_id}).toArray((err,result)=>{

         db.collection('chat_list').updateOne({'sender_id':ObjectId(userDetails.receiver_id),'receiver_id':ObjectId(userDetails.sender_id)},{$set:{'msg':userDetails.msg,'status':status}},(err4,result4)=>{
   					err4 ? reject(err4) : resolve(result4)
            })
         })	

         db.collection('chat_list').updateOne({'sender_id':ObjectId(userDetails.sender_id),'receiver_id':ObjectId(userDetails.receiver_id)},{$set:{'msg':userDetails.msg,'status':status,'current_date': new Date()}},(err1,result1)=>{
   				 err1 ? reject(err1) : resolve(result1)
         })
   		  } else{
           db.collection('chat_list').find({'sender_id':ObjectId(userDetails.receiver_id),'receiver_id':ObjectId(userDetails.sender_id)}).toArray((err,result)=>{

             db.collection('chat_list').updateOne({'sender_id':ObjectId(userDetails.receiver_id),'receiver_id':ObjectId(userDetails.sender_id)},{$set:{'msg':userDetails.msg,'status':status,'current_date': new Date()}},(err4,result4)=>{
   					    err4 ? reject(err4) : resolve(result4)
            })

   			    })	
              db.collection('chat_list').insertOne({'sender_id':mongoose.Types.ObjectId(userDetails.sender_id),'receiver_id':mongoose.Types.ObjectId(userDetails.receiver_id),'msg':userDetails.msg,'status':status,'current_date': new Date()},(err2,result2)=>{
   					  err2 ? reject(err2) : resolve(result2)
   			  })
   			}
   			resolve(result)
   		})
   	})
   }

   this.addchatScribe=(userDetails) =>{
   	    return new Promise((resolve,reject)=>{
             db.collection('chat_scribe').insertOne({'sender_id':mongoose.Types.ObjectId(userDetails.sender_id),'receiver_id':mongoose.Types.ObjectId(userDetails.receiver_id),'msg':userDetails.msg,'scription_type':userDetails.scription_type,'date': new Date()},(err,result)=>{
   	          err ? reject(err) : resolve(result)

   	        })
        })
    }
  
   this.msgList=(sender_id1,receiver_id1)=>{
		return new Promise((resolve,reject)=>{
			console.log(sender_id1)
			console.log(receiver_id1)
     // var mysort = {current_date: -1 };
	   db.collection('chat_list').find({$or:[{'sender_id':ObjectId(sender_id1)},{'receiver_id':ObjectId(receiver_id1)}]}).toArray((err,result)=>{
      //db.collection('chat_list').find({'sender_id':sender_id}||{'receiver_id':receiver_id}).toArray((err,result)=>{
			       if(err){
				       reject(err)
             }else{   
				        var sender_id=[];
				        var receiver_id = [];
               for(var i=0;i<result.length;i++){
                   sender_id.push(result[i].sender_id);
                   receiver_id.push(result[i].receiver_id);
                }
               console.log(sender_id)
			         console.log(receiver_id) 
		 	db.collection('chat_list').aggregate([
		 		     { $match: {$or:[{'sender_id':ObjectId(sender_id1)},{'receiver_id':ObjectId(receiver_id1)}],'status':'1'}}, 
              { $lookup:
                {
                 from : 'user',
                 localField :'receiver_id',
                 //localField : 'receiver_id',
                 foreignField : '_id',
                      as : 'data'
                   }
                  },
                   {
                    $sort:{current_date:-1}
                    
                   },
                   /*{
                   	$limit:1 
                   }*/
                ]).toArray((err1,result1)=>{

		 	         
                /* db.collection('user').find({'_id':ObjectId(sender_id),'_id':ObjectId(receiver_id)}).toArray((err1,result1)=>{*/
                 	err1? reject(err1) : resolve(result1)
                 })
              //}
		 	        //resolve(result)
		    }
	    })
		})
	}

    this.msg_List=(sender_id1,receiver_id1)=>{
		return new Promise((resolve,reject)=>{
			console.log(sender_id1)
			console.log(receiver_id1)
       db.collection('chat_scribe').find({$or:[{'sender_id':ObjectId(sender_id1)},{'receiver_id':ObjectId(receiver_id1)}]}).toArray((err,result)=>{
      //db.collection('chat_list').find({'sender_id':sender_id}||{'receiver_id':receiver_id}).toArray((err,result)=>{
			if(err){
				reject(err)
            }else{   
				       var sender_id=[];
				       var receiver_id = [];
               for(var i=0;i<result.length;i++){
                   sender_id.push(result[i].sender_id);
                   receiver_id.push(result[i].receiver_id);
                }

                console.log(sender_id)
			          console.log(receiver_id)
			 
		 	     db.collection('chat_scribe').aggregate([
		 	        //{ $match:{sender_id: ObjectId(sender_id1),'scription_type':'yes'}},
		 	       { $match: {$or:[{'sender_id':ObjectId(sender_id1)},{'receiver_id':ObjectId(receiver_id1)}],'scription_type':'yes'}},
              { $lookup: 
          	    {
                 from : 'user',
                 localField :'receiver_id',
                 foreignField : '_id',
                  as : 'data'
                 }
                  },
                  {
                    $sort:{current_date:-1}
                  },
                   /*{
                   	$limit:1 
                   }*/
         
                ]).toArray((err1,result1)=>{

		 	         /* db.collection('user').find({'_id':ObjectId(sender_id),'_id':ObjectId(receiver_id)}).toArray((err1,result1)=>{*/
                 	err1? reject(err1) : resolve(result1)
                 })
    
		 	       // resolve(result)
		    }
	    })
		})
	}
			
	this.getdislikeList=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_request').find({'user_id':ObjectId(new_id),'status':'0'}).toArray((err,result)=>{
	     if(err){
				  reject(err)
         }else{
            var frnd_id=[];
               for(var i=0;i<result.length;i++){
                   frnd_id.push(result[i].frnd_id);
                }
         	
			     console.log(frnd_id)
          db.collection('user_request').aggregate([

         		{ $lookup:
         			{
         				from: 'user',
         				localField : 'frnd_id',
         				foreignField :'_id',
         				as :'data'
         			}
         		}
         		]).toArray((err1,result1)=>{
         		err1 ? reject(err1):resolve(result1);
         	   	})
         		//console.log(result1)
         	  /* db.collection('user').find({'_id':ObjectId(frnd_id)}).toArray((err1,result1)=>{
         		err1 ? reject(err1):resolve(result1)*/
         		
         
         	 
         }
				//resolve(result)
		})
		})
      
	}  

	this.getlikeList=(new_id)=>{
		return new Promise((resolve,reject)=>{
	     db.collection('user_request').find({'user_id':ObjectId(new_id)}).toArray((err,result)=>{
        if(err){
				  reject(err)
        }else{
         	  var frnd_id=[];
            for(var i=0;i<result.length;i++){
                  frnd_id.push(result[i].frnd_id);
                  
                  console.log(frnd_id);
           /*db.collection('user').find({ _id: { $in: frnd_id.map(frnd_id => ObjectId(frnd_id)) } }).toArray((err1,result1)=>{
         	 	err1 ? reject(err1):resolve(result1)
                })*/
              }
          
         	db.collection('user_request').aggregate([

         			 { $match: { user_id: ObjectId(new_id),status:'1'} },
         		{ $lookup:
         			{
         				from: 'user',
         				localField : 'frnd_id',
         				foreignField :'_id',
         				as :'data'
         			}
         			},
         			{
                $sort:{current_date:-1}
                    
               },
               {
                $limit:2 
               }
            ]).toArray((err1,result1)=>{
         		err1 ? reject(err1):resolve(result1)
         	  /*db.collection('user').find({'_id':ObjectId(frnd_id)}).toArray((err1,result1)=>{
         		err1 ? reject(err1):resolve(result1)*/
         	//console.log(result1)
         	})
         	
         	}
         //	resolve(result)
				
		})
		})
      
	}

 this.deleteProfile=(userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user_request').find({'user_id':userDetails.user_id}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user_request').deleteOne({'user_id':userDetails.user_id},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
		})

	}

	this.superRequest=(userDetails) => {
  	return new Promise((resolve,reject)=>{

  		db.collection('super_user').insertOne(userDetails,(err,result)=>{
       if(err){
					reject(err)
				}else{
        db.collection('super_user').find({'user_id':userDetails.frnd_id,'frnd_id':userDetails.user_id,'status':'1'}).toArray((err1,result1)=>{
         err1 ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
	   })

  	})
  }

  this.moodRequest=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
      db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'mood':userDetails.mood}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		}
		     resolve(result)
		})
		})				
	}

	this.moodDetails=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('today_mood').find().toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this. mage=(userDetails,files,oldfilename,length)=>{
		console.log(userDetails._id)
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				} else{
					var image = result[0].image;
					console.log(image)
					var filename = image[0].filename;
					console.log(filename)
					//var length = files.length;
					objIndex = image.findIndex((obj => obj.oldfilename === filename));
					console.log(image[objIndex])
					//image[objIndex] = Object.assign({}, image[objIndex], filename)
				// for (var i = 0; i < length; i++) {
				 	 //var file = image[i].filename;
          // console.log(file)
				 	// var ext = path.extname(image[i].filename);
				 	 //console.log(ext)
				 	db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'image':files}},(err1,result1)=>{
				   err1 ? reject(err1) : resolve(result1);
			    })
				 
				   /*db.collection('user').updateOne({
          _id: userDetails._id
        }, {
          "image": files
        }, {
          $addToSet: {
            "image.$": oldfilename
          },

        },(err1,result1)=>{
				   err1 ? reject(err1) : resolve(result1);
			    })*/
				 //}
				}
				resolve(result)
			})
		})
	}

	this.updateSetting=(new_id,userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(new_id)},{$set:userDetails/*{'name':name,img'date_of_birth':date_of_birth,'email':email,'smoke':smoke,'religion':religion,'education':userDetails.education,'sexual':userDetails.sexual,'join':userDetails.join},new:true}*/},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
		})

}

this.getlikeCount=(new_id,userDetails)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user_request').find({'user_id':ObjectId(new_id),'status':'1'}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user_request').countDocuments({'status':'1'},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1)
				console.log(result1)
			})
		}
	 	resolve(result)
		})
		})

}

this.blockUser=(userDetails)=>{
  	console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('user_request').find({$and:[{'user_id':ObjectId(userDetails.user_id)},{'frnd_id':ObjectId(userDetails.frnd_id)}]}).toArray((err,result)=>{
				console.log(result)
				if(err){
					reject(err)
				}else{
				
			db.collection('user').updateOne({_id:ObjectId(userDetails.frnd_id)},{$set:{'block_status':1}},(err1,result1)=>{
       err1 ? reject(err1) : resolve(result1);
			})
		 }
		resolve(result)
    })
  })
}

this.reportUser=(userDetails)=>{
	console.log(userDetails)
	  return new Promise((resolve,reject)=>{
	  	db.collection('user_request').find({$and:[{'user_id':ObjectId(userDetails.user_id)},{'frnd_id':ObjectId(userDetails.frnd_id)}]}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
					
	      db.collection('user').updateOne({_id:ObjectId(userDetails.frnd_id)},{$set:{'tag':userDetails.tag,'report_status':1}},(err1,result1)=>{
         err1 ? reject(err1) : resolve(result1)
	      })
	    }
    resolve(result)
  })
  })
}

this.updatelatlang=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'latitude':userDetails.latitude,'longitude':userDetails.longitude}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		}
		  resolve(result)
		})
		})				
	}

	this.fetchGender=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('gender_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.fetchPreference=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_preference_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.generateNotification=(userDetails,new_id)=>{
		
		return new Promise((resolve,reject)=>{
			const serverKey = 'AAAAwmnSsUI:APA91bHRKdTf1mTbUNF4u-MYrNhtZpx0llJcIeOeN8wrK3hwu0jFY5pAQDa36hNcbbGyKp99IGNKZ1fv-inpKe78IICzoil91a22RxxMh1yYA0cNOoYQDpcTdhBHxtybtpP37zuJEdut';
    //const fcm = new FCM(serverKey);
    const message ={
        to:userDetails,
        collapse_key:`TEST`,
        notification :{
            title : `Test`,
            //body : messageBody,
            sound : `ping.aiff`,
            delivery_receipt_requested : true
        },
        data : {
            message : 'abc',
            //type:type
        }
    };
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.likeCount=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('user_request').countDocuments({'status':'1'},(err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.privacypolicy=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('privacy_policy').find().toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.termandcondition=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('term_and_condition').find().toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.rewardDetails=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('reward_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.passionsDetails=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('passions_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.SuperLikeDetails=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_superlike_list').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}


}

module.exports=new apiModel()