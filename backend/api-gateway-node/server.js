const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
require('dotenv').config()
const analysisRoute=require('./routes/analysisRoutes')

const app=express()

const PORT=process.env.PORT || 5000

app.use(cors());
app.use(express.json())  //Allow server to accept JSON in req body


app.use('/api',analysisRoute)
app.get('/',(req,res)=>{
    res.json({ message: "API Gateway is running" });
})


mongoose.connect(process.env.MONGO_URL)
.then(result=>{
    console.log('Connected to MongoDB')
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch(err=>{
    console.log('Error connecting to mongoDB')
})


