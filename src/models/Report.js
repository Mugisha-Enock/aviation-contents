import mongoose from 'mongoose';
const schema=new mongoose.Schema({story:{type:mongoose.Schema.Types.ObjectId,ref:'Story',required:true},
  reporter:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  reason:{type:String,enum:['spam','misleading','copyright','offensive','other'],required:true},details:{type:String,maxlength:1000,default:''},
  status:{type:String,enum:['open','resolved','dismissed'],default:'open',index:true}},
  {timestamps:true,toJSON:{versionKey:false,transform:(d,r)=>{r.id=r._id;delete r._id;return r}}});
export default mongoose.model('Report',schema);
