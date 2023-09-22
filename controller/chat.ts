
import { Context } from 'koa';
import { Following } from '../models/following'; 
import mongoose from 'mongoose';
export default {
  async sendMessage(ctx: Context) {
    try {
      const { followerId, followingId, message } = ctx.request.body as {
        followerId : mongoose.Types.ObjectId,
        followingId : mongoose.Types.ObjectId,
        message : string
      };

     
      const isFollowing = await Following.findOne({
        follower: followerId,
        following: followingId,
      });
  

      if (!isFollowing) {
        ctx.status = 403; 
        ctx.body = 'You can only chat with your followers.';
        return;
      }

      const io = ctx.state.io;
      io.to(followingId.toString()).emit('message', {
        sender: followerId,
        message,
      });

      ctx.status = 200;
      ctx.body = 'Message sent successfully';
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = 'Internal server error';
    }
  },
};



// import { Context } from 'koa';
// import { Server } from 'http';
// import socketIO, { Server as SocketServer, Socket } from 'socket.io';

// let io: SocketServer;

// export const initSocket = (httpServer: Server): void => {
//   io = new socketIO.Server(httpServer);

//   io.on('connection', (socket: Socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('join', (roomId: string) => {
//       socket.join(roomId);
//     });

//     socket.on('chat message', (roomId: string, message: string) => {
//       io.to(roomId).emit('chat message', message);
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// };

// export const emitToRoom = (roomId: string, event: string, data: any): void => {
//   io.to(roomId).emit(event, data);
// };
