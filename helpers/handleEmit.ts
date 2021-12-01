import { Socket } from 'socket.io';
import { IncomingHttpHeaders } from 'http';

interface handleEmitParams {
  socket: Socket;
  method: string;
  body?: any;
  headers?: IncomingHttpHeaders;
  path?: string;
}

export default async ({
  socket,
  method,
  body: rawBody,
  headers,
  path,
}: handleEmitParams) => {
  let body: string | undefined;
  if (rawBody) {
    if (typeof rawBody === 'string') body = rawBody;
    else {
      body = JSON.stringify(rawBody);
      if (body === '{}') body = undefined;
    }
  }
  socket.emit('api', { method, body, headers, path });
  const result = await new Promise((resolve, reject) => {
    socket.on('api', result => {
      resolve(result);
    });
    socket.on('error', error => {
      reject(error);
    });
  });
  return result;
};
