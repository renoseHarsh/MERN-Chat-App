import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import Conversation from "../models/conversation.model";

const app = express();
const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });
let io: Server;
if (process.env.NODE_ENV === "production") {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
} else {
  io = new Server(httpServer);
}

interface UserTimeout {
  id: string;
  timeOutId?: NodeJS.Timeout;
}

const usersIds: { [key: string]: UserTimeout } = {};

export const getUserSocket = (userId: string): UserTimeout | undefined => {
  return usersIds[userId];
};

export const Everything = () => {
  return usersIds;
};

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (!userId) {
    socket.disconnect(true);
    return;
  }
  if (usersIds[userId]?.timeOutId) clearTimeout(usersIds[userId].timeOutId);
  usersIds[userId] = { id: socket.id };
  try {
    const conversations = await Conversation.getAllByUserId(userId);
    conversations.forEach((conversation) => {
      const toSendId = usersIds[conversation.reciever.id!];
      if (toSendId) {
        io.to(toSendId.id).emit("onlineUser", {
          conversation,
          trueOnline: true,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
  socket.on("disconnect", async () => {
    if (usersIds[userId]?.timeOutId) clearTimeout(usersIds[userId].timeOutId);
    usersIds[userId].timeOutId = setTimeout(async () => {
      delete usersIds[userId];
      try {
        const conversations = await Conversation.getAllByUserId(userId);
        conversations.forEach((conversation) => {
          const toSendId = usersIds[conversation.reciever.id!];
          if (toSendId) {
            io.to(toSendId.id).emit("onlineUser", {
              conversation,
              trueOnline: false,
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  });
});

export { app, httpServer, io };
