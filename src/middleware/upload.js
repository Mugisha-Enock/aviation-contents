import multer from 'multer';import path from 'path';import crypto from 'crypto';import {env} from '../config/env.js';import {httpError} from '../utils/httpError.js';
const EXT={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif','video/mp4':'.mp4','video/webm':'.webm'};
// Local disk for development. In production switch to S3/Cloudinary and return those URLs instead.
export const upload=multer({
  storage:multer.diskStorage({destination:path.resolve('uploads'),filename:(req,f,cb)=>cb(null,crypto.randomUUID()+EXT[f.mimetype])}),
  limits:{fileSize:env.maxUploadMb*1024*1024,files:10},
  fileFilter:(req,f,cb)=>EXT[f.mimetype]?cb(null,true):cb(httpError(400,'Unsupported file type. Use JPG, PNG, WebP, GIF, MP4 or WebM.'))});
