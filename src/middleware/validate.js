import {httpError} from '../utils/httpError.js';
export const validate=schema=>(req,res,next)=>{const r=schema.safeParse(req.body);
  if(!r.success)return next(httpError(400,'Validation failed',r.error.flatten().fieldErrors));req.body=r.data;next()};
