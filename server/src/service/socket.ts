import { Server } from 'socket.io'
import { languages } from './languages'

export const socketService = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  const socketToRoom = new Map();
  const userInfoMap = new Map();
  const languageToRoom = new Map();
  // On user connection
  io.on('connection', (socket: any) => {
    socket.on('join-room', (userInfo: any) => {
      const { roomId } = userInfo;
      socketToRoom.set(socket.id, roomId);
      userInfoMap.set(socket.id, userInfo);

      if (!userInfoMap.has(roomId)) {
        userInfoMap.set(roomId, []);
        languageToRoom.set(roomId, userInfo.lang);
      }

      userInfo['id'] = socket.id; // eslint-disable-line
      userInfoMap.get(roomId).push(userInfo);
      socket.join(roomId);
      io.to(roomId).emit(
        'on-join',
        userInfoMap.get(roomId),
        `${userInfo.name} joined!`,
        languageToRoom.get(roomId),
      );
    });
    // Language changed in room
    socket.on('language-changed', ({ lang }: any) => {
      const roomId = socketToRoom.get(socket.id);
      languageToRoom.set(roomId, lang);

      io.to(roomId).emit('emit-language-changed', lang, languages[lang]);
    });

    // User changes a name
    socket.on('name-change', (userInfo: any) => {
      const roomId = socketToRoom.get(socket.id);
      const userList = userInfoMap.get(roomId);
      const index = userList.findIndex((user: any) => user.id === socket.id);
      userList[index].name = userInfo.name;

      io.to(roomId).emit('name-changed', userInfoMap.get(roomId));
    });

    // When someone changes input data in room
    socket.on('input-data', ({ data }: any) => {
      const roomId = socketToRoom.get(socket.id);
      io.to(roomId).emit('emit-input-data', { inputData: data });
    });

    // When someone tries to execute code
    socket.on('execute-code-start', () => {
      const roomId = socketToRoom.get(socket.id);
      io.to(roomId).emit('emit-execute-code-start');
    });

    // Emit the response of the execution to everyone in the room
    socket.on('code-executed', (data: any) => {
      const roomId = socketToRoom.get(socket.id);
      io.to(roomId).emit('emit-code-executed', data.data);
    });

    // When a user sends a message
    socket.on('send-message', (messageData: any) => {
      const roomId = socketToRoom.get(socket.id);
      messageData.socketId = socket.id; // eslint-disable-line no-param-reassign
      socket.broadcast.to(roomId).emit('message', messageData);
    });

    // When question data is changed
    socket.on('question-data-received', (questionData: any) => {
      const roomId = socketToRoom.get(socket.id);
      socket.broadcast
        .to(roomId)
        .emit('emit-question-data-received', questionData);
    });

    // When a user gets disconnected
    socket.on('disconnect', () => {
      const roomId = socketToRoom.get(socket.id);
      let userList = userInfoMap.get(roomId);
      socket.leave(roomId);
      let disconnectedUser;
      if (userList !== undefined) {
        disconnectedUser =
          userList[userList?.findIndex((user: any) => user.id === socket.id)];
      }
      userList = userList?.filter((u: any) => u.id !== socket.id);
      if (userList === undefined || !userList.length) {
        userInfoMap.delete(roomId);
      } else {
        userInfoMap.set(roomId, userList);
      }
      socket.broadcast
        .in(roomId)
        .emit('user-left', userInfoMap.get(roomId), disconnectedUser?.name);
    });
  });
};