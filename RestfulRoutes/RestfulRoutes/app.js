var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var express=require("express");
var app=express();
var methodOverride= require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/restful_blog_app");

//app config
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose/model config
var blogschema=new mongoose.Schema(
    {
        title:String,
        image:String,
        Body:String,
        created:{type:Date ,default:Date.now()},
         });

var blog = mongoose.model("blog",blogschema);

// restful routes
// blog.create({
//                 title:"test blog",
//                 image:"https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d4147a2e4e3f79299e2f0c92b13db9ee&auto=format&fit=crop&w=634&q=80",
//                 Body:"This is test blog !!!",
    
// },function(err,blog){
//     if(err){
//         console.log("oops something went wrong with blog creation");
//     } else{
//         console.log(blog);
//     }
// });
app.get("/",function(req,res){
    res.redirect("/blog");
});

// index route (show all blogs)
app.get("/blog",function(req,res){
    blog.find({},function(err,foundblog){
         if(err){
        console.log("oops something went wrong with blog finding");
    } else{
        res.render("index", {foundblog:foundblog});
    }
    });
        
    });
    
    
//see a new form --new route
app.get("/blog/new",function(req,res){
    
    res.render("new");
});

//create route

app.post("/blog",function(req,res){
    
    req.body.blog.Body = req.sanitize(req.body.blog.Body) ;
    
   blog.create(req.body.blog,function(err,blog){
    if(err){
       res.render("new");
    } else{
        res.redirect("/blog");
    }
});
    
});

// show route

app.get("/blog/:id",function(req,res){
    
    blog.findById(req.params.id,function(err,found){
         if(err){
        console.log("oops something went wrong with blog finding");
    } else{
        res.render("show", {blog:found});
    }
    
    });
   
});

// edit route 

app.get("/blog/:id/edit" ,function(req,res){
   
    blog.findById(req.params.id,function(err,found){
         if(err){
        console.log("oops something went wrong with blog finding");
    } else{
         res.render("edit", {blog:found});
    }
    
    });
  
});

//update route 

app.put("/blog/:id",function(req,res){
   
     req.body.blog.Body = req.sanitize(req.body.blog.Body) ;
   
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,found){
         if(err){
        console.log("oops something went wrong with blog finding");
    } else{
         res.redirect("/blog/" + req.params.id); }
    });
    });
    
app.delete("/blog/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err,found){
         if(err){
        console.log("oops something went wrong with blog deleting");
    } else{
         res.redirect("/blog"); }
    });
});

app.listen (process.env.PORT, process.env.IP, function(){
    console.log("blog server has statred");
});



