import {httpError} from '../utils/httpError.js';
export const uploadMedia=(req,res)=>{if(!req.files?.length)throw httpError(400,'No files uploaded');
  res.status(201).json({files:req.files.map(f=>({url:'/uploads/'+f.filename,mimetype:f.mimetype,size:f.size}))})};
