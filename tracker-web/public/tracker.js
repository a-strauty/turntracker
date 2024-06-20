const socket = io();
      
const form = document.getElementById('form');
const input = document.getElementById('tracker_1');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});