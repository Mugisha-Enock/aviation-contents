import Story from '../models/Story.js';import User from '../models/User.js';import Report from '../models/Report.js';import {asyncHandler} from '../utils/httpError.js';
const AUTHOR={path:'author',select:'displayName username'};
export const stats=asyncHandler(async(req,res)=>{const [total,published,drafts,pending,contributors,openReports,recent]=await Promise.all([
  Story.countDocuments(),Story.countDocuments({status:'published'}),Story.countDocuments({status:'draft'}),Story.countDocuments({status:'pending'}),
  Story.distinct('author').then(a=>a.length),Report.countDocuments({status:'open'}),Story.find().sort({updatedAt:-1}).limit(10).populate(AUTHOR).select('title slug status updatedAt author')]);
  res.json({total,published,drafts,pending,contributors,openReports,users:await User.countDocuments(),recent})});
export const content=asyncHandler(async(req,res)=>{const f=req.query.status?{status:String(req.query.status)}:{};const limit=Math.min(100,parseInt(req.query.limit)||25),page=Math.max(1,parseInt(req.query.page)||1);
  const [items,total]=await Promise.all([Story.find(f).sort({updatedAt:-1}).skip((page-1)*limit).limit(limit).populate(AUTHOR),Story.countDocuments(f)]);res.json({items,page,total,pages:Math.max(1,Math.ceil(total/limit))})});
