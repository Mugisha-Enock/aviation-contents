import bcrypt from 'bcryptjs';import {z} from 'zod';import User from '../models/User.js';import {asyncHandler,httpError} from '../utils/httpError.js';import {setSession,clearSession} from '../utils/token.js';import {plain} from '../utils/sanitize.js';
export const registerSchema=z.object({displayName:z.string().trim().min(2).max(60),username:z.string().trim().regex(/^[a-zA-Z0-9_]{3,24}$/,'3-24 letters, numbers or underscores'),
  email:z.string().trim().email(),password:z.string().min(8).max(100),terms:z.literal(true,{errorMap:()=>({message:'You must accept the terms and guidelines'})})});
export const loginSchema=z.object({identifier:z.string().trim().min(3),password:z.string().min(1)});
export const register=asyncHandler(async(req,res)=>{const d=req.body;
  const user=await User.create({displayName:plain(d.displayName),username:d.username,email:d.email,passwordHash:await bcrypt.hash(d.password,12)});
  setSession(res,user);res.status(201).json({user})});
export const login=asyncHandler(async(req,res)=>{const id=req.body.identifier.toLowerCase();
  const user=await User.findOne({$or:[{email:id},{username:id}]}).select('+passwordHash');
  if(!user||!(await bcrypt.compare(req.body.password,user.passwordHash)))throw httpError(401,'Incorrect email/username or password');
  setSession(res,user);res.json({user})});
export const logout=(req,res)=>{clearSession(res);res.json({ok:true})};
export const me=(req,res)=>res.json({user:req.user});
