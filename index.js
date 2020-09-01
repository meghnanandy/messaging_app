// Node server which will handle socket io connections

const io = require('socket.io')(8000);

const users = {};

io.on('connection', socket => {
    //Notifies current user about the new user joining
    socket.on('new-user-joined', name => {
        //console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //message send is displayed to everyone
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })

    });

    //left member is displayed to everyone
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];

    });
})