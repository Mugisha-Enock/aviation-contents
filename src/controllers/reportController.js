import {z} from 'zod';import Report from '../models/Report.js';import Story from '../models/Story.js';import {asyncHandler,httpError} from '../utils/httpError.js';import {plain} from '../utils/sanitize.js';
export const reportSchema=z.object({storyId:z.string().regex(/^[a-f\d]{24}$/i),reason:z.enum(['spam','misleading','copyright','offensive','other']),details:z.string().max(1000).optional()});
export const resolveSchema=z.object({status:z.enum(['open','resolved','dismissed'])});
export const create=asyncHandler(async(req,res)=>{const d=req.body;if(!(await Story.exists({_id:d.storyId})))throw httpError(404,'Story not found');
  res.status(201).json({report:await Report.create({story:d.storyId,reporter:req.user._id,reason:d.reason,details:plain(d.details||'')})})});
export const list=asyncHandler(async(req,res)=>{const f=req.query.status?{status:String(req.query.status)}:{};
  res.json({items:await Report.find(f).sort({createdAt:-1}).limit(100).populate('story','title slug status').populate('reporter','displayName username')})});
export const setStatus=asyncHandler(async(req,res)=>{const r=await Report.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});if(!r)throw httpError(404,'Report not found');res.json({report:r})});
