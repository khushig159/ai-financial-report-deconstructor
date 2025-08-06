import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import analysisRoutes from './routes/analysisRoutes.js';
import authRoutes from './routes/authRoutes.js';
import admin from 'firebase-admin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config();

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

console.log("admin:", admin);

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
})

const app=express()

const PORT=process.env.PORT

app.use(cors({
    origin:process.env.CLIENT_URL
}));
app.use(express.json())  //Allow server to accept JSON in req body


app.use('/api',analysisRoutes)
app.use('/auth',authRoutes)
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


