import mongoose from 'mongoose';
const schema=new mongoose.Schema({title:{type:String,required:true},slug:{type:String,required:true,unique:true},issue:{type:Number,required:true},
  coverUrl:String,pdfUrl:String,pages:[String],publishedAt:{type:Date,default:Date.now}},
  {timestamps:true,toJSON:{versionKey:false,transform:(d,r)=>{r.id=r._id;delete r._id;return r}}});
export default mongoose.model('Magazine',schema);
