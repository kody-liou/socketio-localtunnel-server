import { Socket } from 'socket.io';

const userIdSocketMap: { [userId: string]: Socket | undefined } = {};

export default { userIdSocketMap };
