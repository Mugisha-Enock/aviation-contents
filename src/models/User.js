import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  displayName:{type:String,required:true,trim:true,maxlength:60},
  username:{type:String,required:true,unique:true,lowercase:true,trim:true,match:/^[a-z0-9_]{3,24}$/},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  passwordHash:{type:String,required:true,select:false},
  role:{type:String,enum:['user','editor','admin'],default:'user'},
  bio:{type:String,default:'',maxlength:400},avatarUrl:{type:String,default:''}
},{timestamps:true,toJSON:{versionKey:false,transform:(d,r)=>{r.id=r._id;delete r._id;delete r.passwordHash;return r}}});
export default mongoose.model('User',schema);
