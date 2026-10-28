import mongoose from 'mongoose';import {connectDB} from '../config/db.js';import User from '../models/User.js';
const [email,role='admin']=process.argv.slice(2);
if(!email||!['user','editor','admin'].includes(role)){console.error('Usage: npm run make-admin -- you@example.com [admin|editor]');process.exit(1)}
await connectDB();const u=await User.findOneAndUpdate({email:email.toLowerCase()},{role},{new:true});
console.log(u?`${u.email} is now ${u.role}`:'No user found with that email. Register in the app first.');await mongoose.disconnect();
