import http from 'http';import mongoose from 'mongoose';import app from './app.js';import {env} from './config/env.js';import {connectDB} from './config/db.js';import {initSockets} from './sockets/index.js';
await connectDB();const server=http.createServer(app);initSockets(server);
server.listen(env.port,()=>console.log(`API + Socket.IO on http://localhost:${env.port}`));
const stop=()=>server.close(async()=>{await mongoose.disconnect();process.exit(0)});process.on('SIGINT',stop);process.on('SIGTERM',stop);
