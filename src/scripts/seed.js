import bcrypt from 'bcryptjs';import mongoose from 'mongoose';import {connectDB} from '../config/db.js';
import User from '../models/User.js';import Story from '../models/Story.js';import Magazine from '../models/Magazine.js';import Report from '../models/Report.js';import {uniqueSlug,slugify} from '../utils/slug.js';
await connectDB();await Promise.all([User.deleteMany(),Story.deleteMany(),Magazine.deleteMany(),Report.deleteMany()]);
const hash=await bcrypt.hash('Password123!',12);
const [admin,elena,kofi,ines]=await User.create([
  {displayName:'Site Admin',username:'admin',email:'admin@example.com',passwordHash:hash,role:'admin'},
  {displayName:'Elena Voss',username:'elenavoss',email:'elena@example.com',passwordHash:hash,bio:'Airline captain and safety writer.'},
  {displayName:'Kofi Mensah',username:'kofim',email:'kofi@example.com',passwordHash:hash,bio:'Aerospace engineer covering propulsion.'},
  {displayName:'Inês Duarte',username:'inesd',email:'ines@example.com',passwordHash:hash,bio:'Aviation photographer.'}]);
const body='<p>Sample seeded story body. Replace with real content once the platform is live.</p><p>Stories support headings, quotes, lists and links through the editor.</p>';
const rows=[['The Quiet Revolution of Electric Regional Flight','tech','Innovation',kofi,'Battery-electric commuter aircraft are moving from demonstrators to certification campaigns.'],
['Night Approach: Eleven Frames Over the Alps','photo','Photography',ines,'A photographer follows the evening arrival wave into Innsbruck, one long exposure at a time.'],
['Inside a Transatlantic Crossing: Cockpit Cam','video','Airlines',elena,'Eight hours compressed into twelve minutes, with the crew explaining every decision.'],
['Runway Resurfacing Finishes Early at a Major Hub','news','Airports',elena,'Overnight crews wrapped up the project two weeks ahead of schedule, reopening the main runway.'],
['How Satellite Navigation Is Reshaping Approaches','tech','Navigation',kofi,'Satellite-based procedures let smaller airports offer precision approaches without ground beacons.']];
let i=0;for(const [title,type,category,a,excerpt] of rows)await Story.create({title,type,category,excerpt,body,author:a._id,slug:await uniqueSlug(title),status:'published',publishedAt:new Date(Date.now()-3600e3*6*++i),tags:[category.toLowerCase(),type]});
await Magazine.create(['Winter','Autumn','Summer','Spring'].map((s,n)=>({title:`${s} Edition`,slug:slugify(`${s} Edition ${41-n}`),issue:41-n,publishedAt:new Date(2026,11-n*3,1)})));
console.log('Seeded. Login: admin@example.com / Password123! (all seeded users share this password; change it).');await mongoose.disconnect();
