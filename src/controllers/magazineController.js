import {z} from 'zod';import Magazine from '../models/Magazine.js';import {asyncHandler,httpError} from '../utils/httpError.js';import {plain} from '../utils/sanitize.js';import {slugify} from '../utils/slug.js';
export const magazineSchema=z.object({title:z.string().trim().min(3).max(120),issue:z.number().int().positive(),coverUrl:z.string().max(500).optional(),pdfUrl:z.string().max(500).optional(),pages:z.array(z.string().max(500)).max(300).default([]),publishedAt:z.coerce.date().optional()});
export const list=asyncHandler(async(req,res)=>res.json({items:await Magazine.find().sort({issue:-1})}));
export const getBySlug=asyncHandler(async(req,res)=>{const m=await Magazine.findOne({slug:req.params.slug});if(!m)throw httpError(404,'Edition not found');res.json({magazine:m})});
export const create=asyncHandler(async(req,res)=>{const d=req.body;res.status(201).json({magazine:await Magazine.create({...d,title:plain(d.title),slug:slugify(d.title+'-'+d.issue)})})});
