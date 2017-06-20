var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var db_str = 'mongodb://localhost:27017/blog';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//将留言存入数据库
router.post('/messages',function(req,res,next){
	if(req.session.user1){
		var con = req.body['con'];
		var username = req.session.user1;
		var date = new Date();
		var yy = date.getFullYear();
		var mm = date.getMonth()+1;
		var dd = date.getDate();
		mm = mm<10?'0'+mm:mm;
		dd = dd<10?'0'+dd:dd;
		var time = yy + "年" + mm + "月" + dd + "日";
		
		//插入数据
		var insertData = function(db,callback){
			var conn = db.collection('messages');
			var data = [{username:username,con:con,time:time}];
			conn.insert(data,function(result){
				callback(result);
			});
		}
		//链接数据库
		mongodb.connect(db_str,function(err,db){
			if(!err){
				insertData(db,function(result){
					res.redirect('/messages');
					db.colse();
				});
			}
		});
		
	}else{
		res.redirect('/');
	}
});
//存博客
router.post('/boke',function(req,res,next){
	var title = req.body['title'];
	var content = req.body['content'];
	content = (content.replace(/\s /gi,"&nbsp;")).replace(/\n/gi,"<br/>");
	var date = new Date();
	var yy = date.getFullYear();
	var mm = date.getMonth()+1;
	var dd = date.getDate();
	mm = mm<10?'0'+mm:mm;
	dd = dd<10?'0'+dd:dd;
	var time = yy + "年" + mm + "月" + dd + "日";
	//插入数据
	var insertData = function(db,callback){
		var conn = db.collection('boke');
		var data = [{title:title,content:content,time:time}];
		conn.insert(data,function(result){
			callback(result);
		});
	}
	//链接数据库
	mongodb.connect(db_str,function(err,db){
		if(!err){
			insertData(db,function(){
				res.redirect('/');
				db.close();
			});
		}
	});
});

module.exports = router;
