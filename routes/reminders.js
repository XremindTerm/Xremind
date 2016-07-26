var express=require('express');
var router=express.Router();

// POST reminders listening
router.get('/',function(req,res,next){
	res.jsonp({
		state:'err',
		detail:'Lack option such as add/list'
	});
});

// add new reminders
router.post('/add',function(req,res,next){

	res.josnp(req.body);
});

module.exports = router;
