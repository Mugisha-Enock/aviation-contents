export class HttpError extends Error{constructor(status,message,details){super(message);this.status=status;this.details=details}}
export const httpError=(s,m,d)=>new HttpError(s,m,d);
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
