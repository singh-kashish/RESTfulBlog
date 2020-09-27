var express=require("express"),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	methodOverride=require("method-override"),
	expressSanitizer=require("express-sanitizer")
	app=express();
//app config
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useUnifiedTopology:true,useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true,useNewUrlParser:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Mongoose/model config
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES
app.get("/",function(req,res){
		res.redirect("/blogs");
		});
//index route
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("error");
		}
		else{
				res.render("index",{blogs:blogs});
		}
	})

});
//new route
app.get("/blogs/new",function(req,res){
	res.render("new");
});
//create route
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	//create blog
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			console.log(err);
		}
		else{
			//then redirect to the index
			res.redirect("/blogs");
		}
	})
	
	
})
//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	})
})

//edit route
app.get("/blogs/:id/edit",function(req,res)
	   {
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err)
		}
		else{
			res.render("edit",{blog:foundBlog})
		}
	})
})

//update route
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
			res.redirect("/")
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})
//delete route
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		else{
			//redirectsomewhere
			res.redirect("/blogs");
		}
	})
	
})

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Blog server is running");
})