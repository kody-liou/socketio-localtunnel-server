import Router from '@koa/router';
import { Context } from 'koa';
import model from '../model';
import handleEmit from '../helpers/handleEmit';

const router = new Router<Record<string, never>, Context>();
router.all('/:userId/(.*)?', async (ctx: Context): Promise<void> => {
  try {
    const { userId, '0': path } = ctx.params;
    if (!userId) {
      ctx.body = 'please provide client id';
      return;
    }
    const socket = model.userIdSocketMap[userId];
    if (!socket) {
      ctx.body = 'no socket!';
      return;
    }
    const result = await handleEmit({
      socket,
      method: ctx.method,
      body: ctx.request.body,
      headers: ctx.headers,
      path,
    });
    ctx.body = result;
  } catch (error: any) {
    ctx.throw(500, error.message || error);
  }
});

export default router;
