import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";

dotenv.config();



const app = express();
import accountRoutes from "./routes/accounRoutes.js";
import authRoutes from "./routes/authRoutes.js";




app.use(express.json());
app.use('/api',accountRoutes);
app.use('/api',authRoutes);

app.get('/', (req, res)=>{
   res.send("API is working fine Just as you want it to sir") ;

});
app.listen(3000,()=>{
    console.log("port 3000");
});
mongoose.connect(process.env.MONGODB_URI).then(()=>{
console.log("connected");
}).catch((err)=>{
    console.error("offline", err);
});

