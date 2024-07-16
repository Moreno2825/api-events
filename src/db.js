import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

console.log('MONGODB_URI:', MONGODB_URI);

export async function connectToDb(){
    try {
        const db = await mongoose.connect(MONGODB_URI);
        console.log('connection is successfully');
    } catch (error) {
        console.log(error);
    }
}