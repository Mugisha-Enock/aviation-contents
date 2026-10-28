import {env} from '../config/env.js';
export const notFound=(req,res)=>res.status(404).json({error:'Route not found'});
export const errorHandler=(err,req,res,next)=>{
  let status=err.status||500,message=err.message,details=err.details;
  if(err.code===11000){status=409;message='That value is already in use';details=err.keyValue}
  else if(err.name==='CastError'){status=400;message='Invalid identifier'}
  else if(err.name==='MulterError'){status=400;message=err.code==='LIMIT_FILE_SIZE'?'File is too large':err.message}
  if(status>=500){console.error(err);if(env.prod)message='Something went wrong'}
  res.status(status).json({error:message,...(details?{details}:{})})};
