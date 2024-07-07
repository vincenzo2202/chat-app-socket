const { Server } = require('socket.io');

const io = new Server({ cors: 'http://localhost:5173' });


let onLineUsers = [];

io.on('connection', (socket) => {
    console.log('a user connected in: ', socket.id);

    // listen to a connection event
    socket.on('addNewUser', (userId) => {
        addNewUserIfNotExists(userId, socket);
    });

    // add new Message
    socket.on('sendMessage', (message) => {
        const user = onLineUsers.find(user => user.userId === message.recipientId);

        if (user) {
            io.to(user.socketId).emit('getMessage', message);
        }
    });
    

    // disconnect event
    socket.on('disconnect', () => {
        handleUserDisconnect(socket);
    });


});


io.listen(3000, () => {
    console.log('server running at http://localhost:3000');

});
// fix disconnecting user from the server 

function addNewUserIfNotExists(userId, socket) {
    const isUserOnline = onLineUsers.some(user => user.userId === userId);
    if (!isUserOnline) {
        onLineUsers.push({
            userId,
            socketId: socket.id
        });
    }

    console.log('onLineUsers: ', onLineUsers);

    io.emit('getOnLineUsers', onLineUsers);
}

function handleUserDisconnect(socket) { 
    onLineUsers = onLineUsers.filter(user => user.socketId !== socket.id); 
    
    io.emit('getOnLineUsers', onLineUsers);
}