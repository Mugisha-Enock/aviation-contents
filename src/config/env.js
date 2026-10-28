import 'dotenv/config';
const need=k=>{if(!process.env[k])throw new Error(`Missing required env var ${k}`);return process.env[k]};
export const env={
  port:Number(process.env.PORT)||5000,mongo:need('MONGODB_URI'),jwt:need('JWT_SECRET'),
  clientUrl:process.env.CLIENT_URL||'http://localhost:5173',prod:process.env.NODE_ENV==='production',
  requireReview:process.env.REQUIRE_REVIEW==='true',maxUploadMb:Number(process.env.MAX_UPLOAD_MB)||8};
