import {z} from 'zod';import User from '../models/User.js';import Story from '../models/Story.js';import {asyncHandler,httpError} from '../utils/httpError.js';import {plain} from '../utils/sanitize.js';
export const profileSchema=z.object({displayName:z.string().trim().min(2).max(60).optional(),bio:z.string().trim().max(400).optional(),avatarUrl:z.string().max(500).refine(v=>v===''||/^(\/uploads\/|https:\/\/)/.test(v)).optional()});
export const getProfile=asyncHandler(async(req,res)=>{const u=await User.findOne({username:req.params.username.toLowerCase()}).select('displayName username bio avatarUrl createdAt');
  if(!u)throw httpError(404,'Author not found');res.json({user:u,storyCount:await Story.countDocuments({author:u._id,status:'published'})})});
export const updateMe=asyncHandler(async(req,res)=>{const d=req.body;if(d.displayName)req.user.displayName=plain(d.displayName);if(d.bio!==undefined)req.user.bio=plain(d.bio);if(d.avatarUrl!==undefined)req.user.avatarUrl=d.avatarUrl;
  await req.user.save();res.json({user:req.user})});
