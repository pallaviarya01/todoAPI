
const express=require("express");
const mongo=require("mongodb");
const cors=require("cors");
const bodyParser=require("body-parser");
const { request, response, json } = require("express");
const app=express();

app.use(cors())
app.use(bodyParser.json())

var mongoURL="mongodb+srv://Pallaviarya:Pallavi02@cluster0.x29da.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongo.MongoClient.connect(mongoURL,
    {useNewUrlParser:true,useUnifiedTopology:true},
    (err,client)=>{
    if(err){
        return console.log(err)
    }
    console.log("Connected to mongoDb")
    const NewDb=client.db('PALLAVIdb');

    app.post("/signUp",(request,response)=>{
        const{name,contactNo,email,password}=request.body;
        console.log(request.body);

        var data={
            name: name,
            contactNo:contactNo,
            email:email,
            password:password,
        };

        let exsistingUser=NewDb.collection('user').find({email:email}).toArray()
        exsistingUser.then(User=>{
            console.log("User")
            if(User.length>0){
                response.status(201).json("user already exists")
                
            }
            else if(User.length<1)
            {
                let createdUser=NewDb.collection("user").insertOne(data);
                createdUser.then((user)=>{
                    response.status(200).json(user.ops);
                })
            }
        })
    });
    
    app.post("/login",(request,response)=>{
        const{useremail,password}=request.body;
        console.log(request.body);


        let exsistingUser=NewDb.collection("user").find({email:useremail}).toArray()
        exsistingUser.then(User=>{
            console.log(User)

            if(User.length>=1){
                if(password===User[0].password){
                    response.status(200).json(User)
                }
                else{
                    response.status(201).json("please enter the correct password")
                }
            }
            else if (User.length<1){
                response.status(201).json("User doesn't exist, please sign up")
            }

        })
    })

    app.post("/todo",(request,response)=>{
        // const{task,description,deadline,userEmail}=request.body;
        console.log(request.body);


        let exsistingUser=NewDb.collection("todo").insertOne(request.body)
        exsistingUser.then(Todo=>{
            console.log(Todo)

            if(Todo.ops.length>0){
                response.status(200).json(Todo.ops)
            }
            else{
                response.status(201).json("unable to save in database")
            }

        })
    })


    app.get("/getAlltodo/:email", (request,response)=>{
        const email=request.params.email
        console.log("email", email)

        let allTodo=NewDb.collection("todo").find({userEmail:email}).toArray()
         allTodo.then(Todo=>{
             if(Todo.length>0){
                 response.status(200).json(Todo)
             }
             else{
                 response.status(500).json("create a todo")
             }
         })
    })
})
 
app.get("/logout/:email", (request,response)=>{
    const email=request.params.email
    console.log("email", email)

    let allTodo=NewDb.collection("todo").find({userEmail:email}).toArray()
     allTodo.then(Todo=>{
         if(Todo.length>0){
             response.status(200).json(Todo)
             localStorage.removeItem();
            window.location.href = "login.html"
         }
         else{
             response.status(500).json("create a todo")
         }
     })
})



app.listen(8081,()=>{
    console.log("server started")
})