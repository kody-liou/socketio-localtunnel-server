import { Socket, Server } from 'socket.io';
import Koa, { Context } from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { createServer } from 'http';
import apiRoute from './routes/api';
import model from './model';

const PORT = process.env.PORT || 3000;

const router = new Router<Record<string, never>, Context>();
router.use('/api', apiRoute.routes(), apiRoute.allowedMethods());
const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const httpServer = createServer(app.callback());
const io = new Server(httpServer, {});

httpServer.listen(PORT);

io.on('connection', (socket: Socket) => {
  const userId = socket.handshake.query.id;
  console.log(`connect socketId: ${socket.id}, userId: ${userId}`);
  if (typeof userId !== 'string') {
    console.log('error, no id');
    socket.disconnect();
    return;
  }
  model.userIdSocketMap[userId] = socket;
  socket.on('disconnect', () => {
    delete model.userIdSocketMap[userId];
    console.log(`disconnect ${socket.id}`);
  });
});
io.engine.on('connection_error', (err: any) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});
