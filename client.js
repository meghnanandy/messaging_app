const socket = io('http://localhost:8000');

//get dom elements in respective variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//notification audio
var audio = new Audio('notification.mp3');


//function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

//send message to the server if form is submited
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

//input user name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//if new user joins then receive the user name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})

//receiving message send by server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

//if a user leave, display it to all the user
socket.on('left', name => {
    append(`${name} has left the chat`, 'left');
})