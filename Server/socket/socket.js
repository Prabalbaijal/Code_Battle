io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    User.findById(userId).then((user) => {
      if (user) {
        const userName = user.username;

        // Store the user's socket ID and name
        userSocketMap[userId] = { socketId: socket.id, userName };

        console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

        // Send updated online users list to all clients
        const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
        io.emit('getOnlineUsers', onlineUserNames);

        // Handle Play request
        socket.on('playRequest', ({ opponentUsername }) => {
          const opponent = Object.values(userSocketMap).find(
            (user) => user.userName === opponentUsername
          );

          if (opponent) {
            const roomName = `${userName}-${opponentUsername}`;
            socket.join(roomName); // Current user joins the room
            io.to(opponent.socketId).emit('playNotification', {
              roomName,
              initiator: userName,
            });
          } else {
            socket.emit('opponentOffline', { message: 'Opponent is offline.' });
          }
        });

        socket.on('solveProblem', ({ roomName, userName }) => {
          if (contestTimers[roomName]) {
              clearTimeout(contestTimers[roomName].timer); // Stop the contest timer
              delete contestTimers[roomName];
      
              // Notify the winner
              io.to(roomName).emit('contestEnded', {
                  winner: userName,
                  message: `${userName} is the winner!`,
              });
      
              console.log(`Contest ended for room: ${roomName}, winner: ${userName}`);
          }
      });

        // Handle opponent joining the room
        socket.on('joinRoom', (roomName) => {
          socket.join(roomName);
          io.to(roomName).emit('startContest', { message: 'Both players are in. Starting the contest.' });
        });
      }
    }).catch((err) => console.log('Error fetching user:', err));
  }

  // Handle socket disconnect
  socket.on('disconnect', () => {
    if (userId) {
      const userName = userSocketMap[userId]?.userName;
      delete userSocketMap[userId];
      console.log(`User disconnected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

      // Send updated online users list to all clients
      const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
      io.emit('getOnlineUsers', onlineUserNames);
    }
  });
});
