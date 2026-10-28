import mongoose from 'mongoose';import {stripTags} from '../utils/sanitize.js';
export const TYPES=['news','photo','video','tech'];
const schema=new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:150},slug:{type:String,required:true,unique:true},
  excerpt:{type:String,required:true,maxlength:300},body:{type:String,required:true},
  type:{type:String,enum:TYPES,required:true},category:{type:String,required:true,trim:true,index:true},
  tags:[String],coverUrl:String,
  gallery:[{_id:false,url:String,caption:String,credit:String}],videoUrl:String,
  magazine:{type:mongoose.Schema.Types.ObjectId,ref:'Magazine'},
  // Always set from the authenticated session, never from the request body.
  author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  status:{type:String,enum:['draft','pending','published','archived'],default:'draft',index:true},
  publishedAt:Date,views:{type:Number,default:0},readingTime:{type:Number,default:1}
},{timestamps:true,toJSON:{versionKey:false,transform:(d,r)=>{r.id=r._id;delete r._id;return r}}});
schema.index({status:1,publishedAt:-1});
schema.pre('validate',function(next){const w=stripTags(this.body||'').trim().split(/\s+/).filter(Boolean).length;this.readingTime=Math.max(1,Math.ceil(w/220));next()});
export default mongoose.model('Story',schema);
