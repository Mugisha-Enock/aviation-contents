import jwt from 'jsonwebtoken';import {env} from '../config/env.js';
const opts={httpOnly:true,sameSite:env.prod?'none':'lax',secure:env.prod,maxAge:7*24*3600*1000};
export const sign=u=>jwt.sign({sub:String(u._id),role:u.role},env.jwt,{expiresIn:'7d'});
export const setSession=(res,u)=>res.cookie('token',sign(u),opts);
export const clearSession=res=>res.clearCookie('token',{...opts,maxAge:undefined});
