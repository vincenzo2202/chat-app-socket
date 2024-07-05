const { Server } = require('socket.io');

const io = new Server({ cors: 'http://localhost:5173' });


let onLineUsers = [];

io.on('connection', (socket) => {
    console.log('a user connected in: ', socket.id);

    // listen to a connection event
    socket.on('addNewUser', (userId) => {
        addNewUserIfNotExists(userId, socket);
    });

    // disconnect event
    socket.on('disconnect', () => {
        onLineUsers = onLineUsers.filter(user => user.socketId !== socket.id);
        io.emit('getOnLineUsers', onLineUsers);
    });


});


io.listen(3000, () => {
    console.log('server running at http://localhost:3000');

});

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

function disconnectUser(userId) { 
    onLineUsers = onLineUsers.filter(user => user.userId !== userId); 

    io.emit('getOnLineUsers', onLineUsers);

}
