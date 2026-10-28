import {Server} from 'socket.io';import {env} from '../config/env.js';
let io;
export function initSockets(server){
  io=new Server(server,{cors:{origin:env.clientUrl.split(','),credentials:true}});
  io.on('connection',s=>{s.on('feed:join',c=>{if(typeof c==='string'&&c.length<40)s.join('cat:'+c)})});return io}
// Clients dedupe by story.id, so a repeated event is harmless.
export const broadcastNewStory=story=>{io?.emit('story:new',story);if(story.category)io?.to('cat:'+story.category).emit('story:new:category',story)};
