const db = require('./connection')
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const mongoosePaginate = require("mongoose-paginate-v2");


function adminModel() {

    this.fetchDetails=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'form_status':'7'}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.maleDetails=(male)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'gender':'male','form_status':'7'}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.femaleDetails=(female)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'gender':'female','form_status':'7'}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.otherDetails=(other)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'gender':'other','form_status':'7'}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result);
			})
		})	
	}

	this.blockDetails=(other)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'block_status':1}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result);
			})
		})	
	}

	this.membershipDetails=(other)=>{
		return new Promise((resolve,reject)=>{
			var mysort = { end_date: 1 };
			db.collection('membership_user').find({}).sort(mysort).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result);
			})
		})	
	}

	this.reportDetails=(other)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'report_status':1}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result);
			})
		})	
	}

	this.viewDetails=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})
	}

	this.add_notification_msg=(userDetails)=>{
		//console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('add_notification_msg').insertOne(userDetails,(err,result)=>{
				//err? reject(err) : resolve(result);
				if(err)
				{
					reject(err)
				}else{
					db.collection('user').find({}).toArray((err1,result1)=>{
						err1 ? reject(err1) : resolve(result1)
						console.log(result1)
					})
				}
				//resolve(result)
		    })
		}) 
    }	

    this.add_membership_plan=(userDetails)=>{
		//console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('add_membership_plan').insertOne(userDetails,(err,result)=>{
				err? reject(err) : resolve(result);
		    })
		}) 
    }	

    this.add_weekly_reward=(userDetails)=>{
		//console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('add_weekly_reward').insertOne(userDetails,(err,result)=>{
				err? reject(err) : resolve(result);
		    })
		}) 
    }	

    this.add_superlike_list=(userDetails)=>{
		//console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('add_superlike_list').insertOne(userDetails,(err,result)=>{
				err? reject(err) : resolve(result);
		    })
		}) 
    }

    this.privacy_policy=(userDetails,new_id)=>{
		//console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('privacy_policy').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('privacy_policy').updateOne({'_id':ObjectId(new_id)},{$set:{'mood':userDetails.mood}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
				//console.log(result1)
			})
		       }
		//resolve(result)
		  })
		}) 
    }

    this.term_and_condition=(userDetails)=>{
		//console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('term_and_condition').insertOne(userDetails,(err,result)=>{
				err? reject(err) : resolve(result);
		    })
		}) 
    }	

    this.deleteUser=(new_id)=>{
		return new Promise((resolve,reject)=>{
				db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('user').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
		})

	}

	this.showUser=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			err?reject(err):resolve(result)
		})
		})
      
	}

	const p1 = new Promise((resolve, reject) => {
		db.collection('user').countDocuments({},(err,result1)=>{
        setTimeout(() => resolve(result1), 1000);
    })
    });

	const p2 = new Promise((resolve, reject) => {
      db.collection('membership_user').countDocuments({},(err,result2)=>{
      setTimeout(() => resolve(result2), 2000);
      })
    });

	var result = [
	    this.all=()=>{
		       return new Promise((resolve,reject)=>{
                db.collection('user').countDocuments({},(err,result)=>{
                err ? reject(err) : resolve(result);
				// total_count = result;
				 console.log("user_count="+result)
			    }),
                
                db.collection('membership_user').countDocuments({},(err,result)=>{
                err ? reject(err) : resolve(result);
				//membership_count= result;
				console.log("membership_user="+result)
			    }),
                
                db.collection('block_user').countDocuments({},(err,result)=>{
                err ? reject(err) : resolve(result);
				//block_count= result;
				console.log("block_user="+result)
			    }),
              
                db.collection('report_user').countDocuments({},(err,result)=>{
                err ? reject(err) : resolve(result);
				//report_count= result;
				console.log("report_user="+result)
			    })
            })

        }
	]
	
    this.total_user_count=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').countDocuments({},(err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result)
			})
		})	
	}

	this.membership_user_count=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('membership_user').countDocuments({},(err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result)
			})
		})	
	}

	this.block_user_count=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('block_user').countDocuments({},(err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result)
			})
		})	
	}

	this.report_user_count=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('report_user').countDocuments({},(err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result)
			})
		})	
	}
    
	
    this.fetchNotification=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_notification_msg').find({'id':userDetails.id}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.fetchSuperlike=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_superlike_list').find({'id':userDetails.id}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.fetchMembership=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_membership_plan').find({'id':userDetails.id}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.searchDetails=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'name':userDetails.name}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.addMood=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('today_mood').insertOne(userDetails,(err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.fetchmood=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('today_mood').find({}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}

	this.deleteMood=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('today_mood').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('today_mood').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		}
		resolve(result)
		})
	 })

	}

	this.delete_membership_plan=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_membership_plan').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('add_membership_plan').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }

    this.delete_superlike_list=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_superlike_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('add_superlike_list').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }

	this.editMood=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
		    db.collection('today_mood').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('today_mood').updateOne({'_id':ObjectId(new_id)},{$set:{'mood':userDetails.mood}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
				console.log(result1)
			})
		}
		//resolve(result)
		})
	 })

	}

	this.showMood=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('today_mood').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			err?reject(err):resolve(result)
		})
		})
    }

	this.showPrivacyPolicy=()=>{
		return new Promise((resolve,reject)=>{
			db.collection('privacy_policy').find({}).toArray((err,result)=>{
			err?reject(err):resolve(result)
		})
		})
    }

	this.fetchReward=(userDetails)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_weekly_reward').find({'id':userDetails.id}).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
			})
		})	
	}
    
    this.showWeeklyReward=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_weekly_reward').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)
		    })
	    })
    }

	this.editWeeklyReward=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
		    db.collection('add_weekly_reward').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('add_weekly_reward').updateOne({'_id':ObjectId(new_id)},{$set:{'day':userDetails.day,'date':userDetails.date,'type':userDetails.type,'count':userDetails.count}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
				console.log(result1)
			})
		}
		//resolve(result)
		})
	 })

	}

	this.delete_weekly_reward=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_weekly_reward').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('add_weekly_reward').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }

	this.showSuperLike=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_superlike_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)
		    })
	    })
    }

    this.editSuperLike=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_superlike_list').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
		    db.collection('add_superlike_list').updateOne({'_id':ObjectId(new_id)},{$set:{'price':userDetails.price,'super_like':userDetails.super_like}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
				//console.log(result1)
			})
			}
		    //resolve(result)
		  })
		})
	}

	this.showMembershipPlan=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_membership_plan').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)
		    })
	    })
    }

    this.editMembershipPlan=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_membership_plan').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
		    db.collection('add_membership_plan').updateOne({'_id':ObjectId(new_id)},{$set:{'price':userDetails.price,'super_like':userDetails.super_like}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
				//console.log(result1)
			})
			}
		    //resolve(result)
		  })
		})
	}

	this.delete_notification_msg=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_notification_msg').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('add_notification_msg').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }

    this.showNotificationMsg=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_notification_msg').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
			   err?reject(err):resolve(result)
		    })
	    })
    }

    this.editNotificationMsg=(userDetails,new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('add_notification_msg').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
		    db.collection('add_notification_msg').updateOne({'_id':ObjectId(new_id)},{$set:{'title':userDetails.title,'description':userDetails.description,'notification_time':userDetails.notification_time,'select_gender':userDetails.select_gender}},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
				//console.log(result1)
			})
			}
		    //resolve(result)
		  })
		})
	}

	this.manageuserstatus=(userDetails)=>{
		console.log(userDetails)
		//console.log(new_id)
		//console.log(s)
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			if(userDetails.s=='block')
			{
				db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_status':0}},(err1,result1)=>{
					err1 ? reject(err1) : resolve(result1);
				})
			}
			else if(userDetails.s=='verify')
			{
				db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'user_status':1}},(err2,result2)=>{
					err2 ? reject(err2) : resolve(result2);
				})
			}
			else
			{
				db.collection('user').deleteOne({'_id':ObjectId(userDetails._id)},(err3,result3)=>{
					err3 ? reject(err3) : resolve(result3);
				})
			}
		   }
		   resolve(result)
		  })  
		})	
	}

	this.manageblockstatus=(userDetails)=>{
		console.log(userDetails)
		//console.log(new_id)
		//console.log(s)
		return new Promise((resolve,reject)=>{
			db.collection('user').find({'_id':ObjectId(userDetails._id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			if(userDetails.s=='block')
			{
				db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'block_status':0}},(err1,result1)=>{
					err1 ? reject(err1) : resolve(result1);
				})
			}
			else if(userDetails.s=='verify')
			{
				db.collection('user').updateOne({'_id':ObjectId(userDetails._id)},{$set:{'block_status':1}},(err2,result2)=>{
					err2 ? reject(err2) : resolve(result2);
				})
			}
			else
			{
				
			}
		   }
		   resolve(result)
		  })  
		})	
	}

	this.delete_membership_user=(new_id)=>{
		return new Promise((resolve,reject)=>{
			db.collection('membership_user').find({'_id':ObjectId(new_id)}).toArray((err,result)=>{
				if(err){
					reject(err)
				}else{
			db.collection('membership_user').deleteOne({'_id':ObjectId(new_id)},(err1,result1)=>{
				err1 ? reject(err1) : resolve(result1);
			})
		        }
		    resolve(result)
		  })
	    })
    }

    this.pagination=(page,limit)=>{
    	console.log(page);
    	console.log(limit);
		return new Promise((resolve,reject)=>{
			db.collection('user').find({},{page,limit}).plugins(mongoosePaginate).toArray((err,result)=>{
				err ? reject(err) : resolve(result);
				console.log(result)
			})
		})	
	}

}
module.exports=new adminModel()