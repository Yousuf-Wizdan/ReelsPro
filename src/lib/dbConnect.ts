import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!

if(!MONGODB_URL){
    throw new Error('No MongoDB URL found!!')
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null , promise: null};
}

export async function dbConnect(){
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts = {
            bufferCommands:true,
            maxPoolSize: 10
        }

        cached.promise = mongoose
            .connect(MONGODB_URL , opts)
            .then(() => mongoose.connection)
    }

    try{    
        cached.conn = await cached.promise
    }catch(err){
        cached.promise = null
        throw err
    }

    return cached.conn
}