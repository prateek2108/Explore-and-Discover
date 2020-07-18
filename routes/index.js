var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var user     = require("../models/user");

//SHOWS THE REGISTER FORM 
router.get("/register",function(req,res){
	res.render("register");
});

//POST REQ TO REGISTER
router.post("/register",function(req,res){
	var newuser= new user({username:req.body.username});
	user.register(newuser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome To Yelpcamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});


//LOGIN ROUTES	
router.get("/login",function(req,res){
	res.render("login");
});

//HANDING LOGIN LOGIC
//app.post("/login",middleware,call back)
router.post("/login",passport.authenticate("local",
	{
		successRedirect : "/campgrounds",
		failureRedirect:"/login"
	}),function(req,res){
	
});


//LOGOUT ROUTES
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out");
	res.redirect("/campgrounds");
});



module.exports = router;
