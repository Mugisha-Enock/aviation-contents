import jwt from 'jsonwebtoken';import {env} from '../config/env.js';import User from '../models/User.js';import {httpError} from '../utils/httpError.js';
export const authenticate=(required=true)=>async(req,res,next)=>{
  const t=req.cookies?.token||(req.headers.authorization||'').replace(/^Bearer /,'');
  const fail=m=>required?next(httpError(401,m)):next();
  if(!t)return fail('Sign in required');
  try{const p=jwt.verify(t,env.jwt),u=await User.findById(p.sub);if(!u)return fail('Account no longer exists');req.user=u;next()}
  catch{return fail('Invalid or expired session')}};
export const requireRole=(...r)=>(req,res,next)=>r.includes(req.user?.role)?next():next(httpError(403,'You do not have permission for this action'));
export const isStaff=u=>!!u&&['editor','admin'].includes(u.role);
