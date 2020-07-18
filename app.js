var express           =  require("express");
var app               =  express();
var bodyparser        =  require("body-parser");
var mongoose          =  require("mongoose");
var campground        =  require("./models/campground");
var comment           =  require("./models/comment");
var seedDB            =  require("./seeds");
var passport          =  require("passport");
var localstrategy     =  require("passport-local");
var user              =  require("./models/user");
var campgroundRoutes  =  require("./routes/campgrounds");
var commentsRoutes    =  require("./routes/comments");
var indexRoutes       =  require("./routes/index");
var methodoverride    =  require("method-override");
var flash             =  require("connect-flash");
var PORT              =  process.env.PORT || 3000
//seedDB();
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://pranay:yelpcampdatabase@cluster0.fearn.mongodb.net/YELPCAMP-PROJECT?retryWrites=true&w=majority",{useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended : true}));
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Hello Pranay Kanjolia",
	resave:false,
	saveUninitialized : false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(methodoverride("_method"));
app.use(express.static(__dirname + "/public"));


app.use(function(req,res,next){
	res.locals.currentuser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/",indexRoutes);


app.get("/",function(req,res){
	res.render("landing");
});





app.listen(PORT, process.env.IP, function(){
   console.log("Server Has Started!");
});