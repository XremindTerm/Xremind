var mysql=require('mysql');
var pool=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'',
	database:'xremind'
});1

exports.query=function(sql,vs,cb){
	pool.getConnection(function(err,conn){
		if(err){
			if(typeof cb == 'function')cb(err,null,null);
		}else{
			if(typeof vs =='function'){cb=vs;vs=[];}
			conn.query(sql,vs,function(qerr,vals,fields){
				conn.release();//释放连接
				if(typeof cb == 'function')cb(qerr,vals,fields);
			});
		}
	});
}
module.exports=exports.query;