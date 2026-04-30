import mongoose from "mongoose";

const onboardShema= new mongoose.Schema({
name:{
    type: String,
 required: true
}
,email:{
    type: String,
    required: true,
    unique: true


}} ,{timestamps:true});

const Onboard = mongoose.model("Onboard",onboardShema);
export default Onboard; 