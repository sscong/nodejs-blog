var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var db_str = 'mongodb://localhost:27017/blog';
/* GET home page. */
router.get('/', function(req, res, next) {
	//博客内容
	var arr2 = [];
	var findData1 = function(db,callback){
		var conn = db.collection('boke');
		conn.find({}).toArray(function(err,result){
			callback(result);
		});
	}
	mongodb.connect(db_str,function(err,db){
		if(!err){
			findData1(db,function(result){
				arr2 = result;
				db.close();
			});
		}
	});
	
	
 	var findData = function(db,callback){
  		var conn = db.collection('user');
  		conn.find({}).toArray(function(err,result){
	  		callback(result);
	  	});
	}
	mongodb.connect(db_str,function(err,db){
	  	if(!err){
	  		findData(db,function(result){
	  			var arr = [];
	  			var arr1 = [];
	  			result.forEach(function(value){
	  				arr1.push(value.pass);
	  				arr.push(value.username);
	  			});
	  			console.log(req.session.user1);
	  			 res.render('index', { user: arr ,pass:arr1,user1:req.session.user1,boke:arr2});
	  		})
	  	}
	})
  
});

//注册
router.post('/register', function(req, res, next) {
	
	//express获取数据
  var zh = req.body['username'];
  var pass = req.body['pass'];
  
  //首先获取数据库中的数据，用户名唯一可以注册
  //封装的获取数据的方法
  var findData = function(db,callback){
  	var conn = db.collection('user');
  	conn.find({"username":zh}).toArray(function(err,result){
  		callback(result);
  		
  	});
  }
  //链接数据库
  mongodb.connect(db_str,function(err,db){
  	if(!err){
  		findData(db,function(result){
  			if(result.length>0){
  				console.log('shi');
  				res.redirect('/');
				db.colse();
  			}else{
  				console.log('success');
  				//封装的插入数据的方法
				  var insertData = function(db,callback){
				  	var conn = db.collection('user');
				  	var data = [{username:zh,pass:pass}];
				  	conn.insert(data,function(err,result){
				  		callback(result);
				  	});
				  };
				  //链接数据库
				  mongodb.connect(db_str,function(err,db){
				  	if(!err){
				  		insertData(db,function(result){
				  			
				  			res.redirect('/');
								db.colse();
				  			
				  		});
				  	}
				});
  				
  				
  			}
  		});
  	}
  });
  
  
  
});

//登录
router.post('/login',function(req,res,next){
	var zh = req.body['username'];
  	var pass = req.body['pass'];
  	//获取数据库中的数据
  	var findData = function(db,callback){
  		var conn = db.collection('user');
  		var data = {"username":zh,"pass":pass};
  		conn.find(data).toArray(function(err,result){
	  		callback(result);
	  	});
  	}
  	
  	//链接数据库
  	mongodb.connect(db_str,function(err,db){
  		if(!err){
  			findData(db,function(result){
  				if(result.length>0){
  					console.log(result);
  					req.session.user1 = result[0].username;
  					res.redirect('/');
  					db.close();
  				}else{
  					res.redirect('/');
  					db.close();
  				}
  			});
  		}
  	});
});

//退出登录
router.post('/relogin',function(req,res,next){
	req.session.destroy(function(err){
		if(!err){
			res.redirect('/');
		}
	});
});

//留言板
router.get('/messages',function(req,res,next){
	var findData = function(db,callback){
		var conn = db.collection('messages');
		conn.find({}).toArray(function(err,result){
			callback(result);
		});
	}
	mongodb.connect(db_str,function(err,db){
		if(!err){
			findData(db,function(result){
				res.render('messages',{result:result});
			});
		}
		
	});
	
});

//博客
router.get('/boke',function(req,res,next){
	res.render('boke',{});
});
module.exports = router;
