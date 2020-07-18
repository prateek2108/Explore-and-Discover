var express    =  require("express");
var router     =  express.Router();
var campground =  require("../models/campground");
var comment    =  require("../models/comment");
var middleware =  require("../middleware");

router.get("/",function(req,res){
	campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	})
	
});

//CREATE NEW CAMPGROUND
router.post("/",middleware.isloggedin,function(req,res){
	
	
	var name=req.body.name;
	var price= req.body.price;
	var image=req.body.image;
	var description=req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newcampground={
		name:name,
		price : price,
		image:image,
		description:description,
		author : author
	};

	campground.create(newcampground,function(err,newcampground){
		if(err){
			console.log(err);
		}
		else{
			console.log("new campground created!!");
			console.log(newcampground);
		}
	})
	
	res.redirect("/campgrounds");
});

//NEW SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new",middleware.isloggedin,function(req,res){
	res.render("campgrounds/new");
})
//SHOW ROUTE
router.get("/:id",function(req,res){
	//res.send("THIS WOULD BE THE SHOW PAGE");
	campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
		if(err){
			console.log(err);
		}
		else{
			console.log(foundcampground);
			res.render("campgrounds/show",{campground:foundcampground});
		}
	})
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkcampgroundownership,function(req,res){
	campground.findById(req.params.id,function(err,foundcampground){
		res.render("campgrounds/edit",{campground:foundcampground});
	});
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkcampgroundownership,function(req,res){
	//find and update the correct campground
	campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatecampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	//redirect somewhere
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkcampgroundownership,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});




module.exports = router;
