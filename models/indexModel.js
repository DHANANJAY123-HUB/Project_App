const db = require('./connection')

function indexModel() {
	this.registerUser=(userDetails)=>{
		console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('admin').find().toArray((err,result)=>{
				if(err)
					reject(err)
				else
				{
					var user_id;
					var val = Math.floor(1000 + Math.random() * 9000);
					var flag=0

					if(result.length==0)
						user_id=1
					else
					{   
					
						var max_id=result[0].user_id

						for(let row of result)
						{

						 if(row.user_id>max_id)
						 	max_id=row.user_id
						
						 if(row.email==userDetails.email)
						 	flag=1							 	
						 	
						}
						user_id=max_id+1  	
					}
					//userDetails.user_id=user_id
					userDetails.form_status=0
					userDetails.role="user"
					userDetails.info=Date()
					userDetails.val=val

					if(flag)
					{
						resolve(0)
					}
					else
					{
						db.collection('admin').insertOne(userDetails,(err1,result1)=>{
						err1 ? reject(err1) : resolve(1);
					 	})	
					}
				}	
			})
			
		})	
	}

	this.userLogin=(userDetails)=>{
		console.log(userDetails)
		return new Promise((resolve,reject)=>{
			db.collection('admin').find({'email':userDetails.email,'password':userDetails.password}).toArray((err,result)=>{
				err ? reject(err) :resolve(result)
			})
		})
	}

	

}

module.exports=new indexModel()
