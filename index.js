const io = require('socket.io')(8800, {
    cors: {
        origin: "http://localhost:3000"
    }
})
let activeUsers = [];
io.on("connection", (socket) => {
    // new user
    socket.on('new-user-add', (newUserId) => {
        // if user is not added previously
        if (!activeUsers?.some((user) => user?.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket?.id,
            })
        }
        console.log('Connected Users', activeUsers);
        io.emit('get-users', activeUsers);
    })
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket?.id);
        console.log('User Disconnected', activeUsers);
        io.emit('get-users', activeUsers);
    });
    socket.on('send-message', (data) => {
        const {recieverId} = data;
        const user = activeUsers.find((user) => user?.userId === recieverId);
        console.log('sending from message to the ', recieverId);
        console.log('data', data);
        if (user) {
            io.to(user?.socketId).emit("receive-message", data)
        }
    })
});

