import {z} from 'zod';import Story,{TYPES} from '../models/Story.js';import {asyncHandler,httpError} from '../utils/httpError.js';import {plain,rich} from '../utils/sanitize.js';
import {uniqueSlug} from '../utils/slug.js';import {isStaff} from '../middleware/auth.js';import {broadcastNewStory} from '../sockets/index.js';import {env} from '../config/env.js';
const AUTHOR={path:'author',select:'displayName username avatarUrl bio createdAt'};
const media=z.string().max(500).refine(v=>/^(\/uploads\/|https:\/\/)/.test(v),'Must be an /uploads/ path or https URL');
export const storySchema=z.object({title:z.string().trim().min(8).max(150),slug:z.string().trim().max(160).optional(),excerpt:z.string().trim().min(20).max(300),
  body:z.string().trim().min(60).max(100000),type:z.enum(TYPES),category:z.string().trim().min(2).max(40),tags:z.array(z.string().trim().max(30)).max(10).default([]),
  coverUrl:media.optional(),gallery:z.array(z.object({url:media,caption:z.string().max(300).optional(),credit:z.string().max(100).optional()})).max(30).default([]),
  videoUrl:z.string().url().max(500).optional(),magazine:z.string().regex(/^[a-f\d]{24}$/i).optional(),status:z.enum(['draft','published']).default('draft')});
export const statusSchema=z.object({status:z.enum(['draft','pending','published','archived'])});
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const finalStatus=(u,want)=>want==='published'&&env.requireReview&&u.role==='user'?'pending':want;
const clean=d=>({title:plain(d.title),excerpt:plain(d.excerpt),body:rich(d.body),type:d.type,category:plain(d.category),
  tags:[...new Set(d.tags.map(t=>plain(t).toLowerCase()).filter(Boolean))],coverUrl:d.coverUrl,
  gallery:d.gallery.map(g=>({url:g.url,caption:plain(g.caption||''),credit:plain(g.credit||'')})),videoUrl:d.videoUrl,magazine:d.magazine});
const canEdit=(u,s)=>s.author.equals(u._id)||isStaff(u);
const page=q=>({page:Math.max(1,parseInt(q.page)||1),limit:Math.min(50,Math.max(1,parseInt(q.limit)||12))});
async function paged(filter,q,sort){const {page:p,limit}=page(q);const [items,total]=await Promise.all([Story.find(filter).sort(sort).skip((p-1)*limit).limit(limit).populate(AUTHOR),Story.countDocuments(filter)]);
  return {items,page:p,pages:Math.max(1,Math.ceil(total/limit)),total}}
export const list=asyncHandler(async(req,res)=>{const {q,type,category,author,sort}=req.query,f={status:'published'};
  if(TYPES.includes(type))f.type=type;if(category)f.category=String(category);
  if(q){const r=new RegExp(esc(String(q).slice(0,80)),'i');f.$or=[{title:r},{excerpt:r},{tags:r}]}
  if(author){const User=(await import('../models/User.js')).default;const u=await User.findOne({username:String(author).toLowerCase()});f.author=u?u._id:null}
  res.json(await paged(f,req.query,sort==='popular'?{views:-1}:{publishedAt:-1}))});
export const mine=asyncHandler(async(req,res)=>{const f={author:req.user._id};if(['draft','pending','published','archived'].includes(req.query.status))f.status=req.query.status;
  res.json(await paged(f,req.query,{updatedAt:-1}))});
export const getBySlug=asyncHandler(async(req,res)=>{const s=await Story.findOne({slug:req.params.slug}).populate(AUTHOR);if(!s)throw httpError(404,'Story not found');
  const own=req.user&&(s.author._id.equals(req.user._id)||isStaff(req.user));if(s.status!=='published'&&!own)throw httpError(404,'Story not found');
  if(s.status==='published'){Story.updateOne({_id:s._id},{$inc:{views:1}}).exec();s.views+=1}
  const related=await Story.find({status:'published',_id:{$ne:s._id},$or:[{category:s.category},{type:s.type}]}).sort({publishedAt:-1}).limit(3).populate(AUTHOR);
  res.json({story:s,related})});
export const create=asyncHandler(async(req,res)=>{const d=req.body,status=finalStatus(req.user,d.status);
  const s=await Story.create({...clean(d),slug:await uniqueSlug(d.slug||d.title),author:req.user._id,status,publishedAt:status==='published'?new Date():undefined});
  const full=await Story.findById(s._id).populate(AUTHOR);if(status==='published')broadcastNewStory(full.toJSON());res.status(201).json({story:full})});
export const update=asyncHandler(async(req,res)=>{const s=await Story.findById(req.params.id);if(!s)throw httpError(404,'Story not found');if(!canEdit(req.user,s))throw httpError(403,'You can only edit your own stories');
  const d=req.body,was=s.status==='published',status=finalStatus(req.user,d.status);Object.assign(s,clean(d),{status});
  if(d.slug&&d.slug!==s.slug)s.slug=await uniqueSlug(d.slug,s._id);if(status==='published'&&!s.publishedAt)s.publishedAt=new Date();
  await s.save();const full=await Story.findById(s._id).populate(AUTHOR);if(!was&&status==='published')broadcastNewStory(full.toJSON());res.json({story:full})});
export const setStatus=asyncHandler(async(req,res)=>{const s=await Story.findById(req.params.id);if(!s)throw httpError(404,'Story not found');const was=s.status==='published';
  s.status=req.body.status;if(s.status==='published'&&!s.publishedAt)s.publishedAt=new Date();await s.save();
  const full=await Story.findById(s._id).populate(AUTHOR);if(!was&&s.status==='published')broadcastNewStory(full.toJSON());res.json({story:full})});
export const remove=asyncHandler(async(req,res)=>{const s=await Story.findById(req.params.id);if(!s)throw httpError(404,'Story not found');
  if(!(s.author.equals(req.user._id)||req.user.role==='admin'))throw httpError(403,'You can only delete your own stories');await s.deleteOne();res.json({ok:true})});
