import Story from '../models/Story.js';
export const slugify=t=>String(t).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100)||'story';
export async function uniqueSlug(input,excludeId){const base=slugify(input);let s=base,n=1;
  while(await Story.exists({slug:s,...(excludeId?{_id:{$ne:excludeId}}:{})}))s=`${base}-${++n}`;return s}
