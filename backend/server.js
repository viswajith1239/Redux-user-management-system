const express=require("express")

const mongoose= require("mongoose")
const port=3000
const app=express()

const logger=require("morgan")
const cors=require("cors")
const userRoutes=require("./Router/User")
const adminRoutes=require("./Router/Admin")

const MONGO_URL="mongodb://localhost:27017/CRUDOPREATIONS"

mongoose.connect(MONGO_URL).then(()=>{
    console.log("connected to mongoDB");
    
}).catch(()=>{
    console.log("disconnected to monogoDB");
    
})

app.use(cors({
    origin:"http://localhost:5174",
    method:["GET","POST"],
    credentials:true
}))


app.use(express.json())
app.use(logger("dev"))

app.use("/user",userRoutes)
app.use("/admin",adminRoutes)


app.listen(port,()=>console.log(`server started on port ${port}`));
