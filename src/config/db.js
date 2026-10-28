import dns from 'dns';
import mongoose from 'mongoose';
import {env} from './env.js';

// Some networks refuse SRV lookups (needed by mongodb+srv). Use public DNS for this process only.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB(){
  mongoose.set('strictQuery',true);
  try{
    await mongoose.connect(env.mongo,{serverSelectionTimeoutMS:8000});
    console.log('MongoDB connected:',mongoose.connection.name);
  }catch(e){
    console.error('\nCould not connect to MongoDB:',e.message,'\nCheck MONGODB_URI in .env, the Atlas Network Access list, and the database user/password.\n');
    process.exit(1);
  }
}