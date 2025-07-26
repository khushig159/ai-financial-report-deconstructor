const express=require('express')
const cors=require('cors')
require('dotenv').config()

const app=express()

const PORT=process.env.PORT || 5000

app.use(cors());
app.use(express.json())  //Allow server to accept JSON in req body

app.get('/',(req,res)=>{
    res.json({ message: "API Gateway is running" });
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

