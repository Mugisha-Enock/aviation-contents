import express from 'express';import cors from 'cors';import helmet from 'helmet';import morgan from 'morgan';import cookieParser from 'cookie-parser';import rateLimit from 'express-rate-limit';import path from 'path';
import {env} from './config/env.js';import routes from './routes/index.js';import {notFound,errorHandler} from './middleware/error.js';
const app=express();app.set('trust proxy',1);
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(cors({origin:env.clientUrl.split(','),credentials:true}));
app.use(morgan(env.prod?'combined':'dev'));app.use(express.json({limit:'1mb'}));app.use(cookieParser());
app.use('/uploads',express.static(path.resolve('uploads'),{maxAge:'7d'}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300}),routes);
app.use(notFound);app.use(errorHandler);export default app;
