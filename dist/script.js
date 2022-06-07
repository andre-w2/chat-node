const socket = io();
const alert = document.querySelector('.alert')
const form = document.querySelector('#form');
const input = document.querySelector('#input');
const connect_form = document.querySelector('.connect__form')
const connect_input = document.querySelector('.connect__input')

const exit_btn = document.querySelector('.exit__btn')
const exit = document.querySelector('.exit')
const connect = document.querySelector('.connect')
const chat = document.querySelector('.chat')
const id = document.querySelector('.connect__id__id')

const createRoom = () => {
  return Math.floor(Math.random() * 5320)
}
const room = createRoom()

const innerID = idRoom => {
  id.innerText = idRoom;
}

innerID(room)

const createAlert = (type, text, status, idRoom) => {
  alert.classList.add(`alert-${type}`)
  alert.innerText = text

  show(status, idRoom)

  setTimeout(() => {
    alert.classList.remove(`alert-${type}`)
    alert.innerText = ''
  }, 3000)
}

const show = (status, idRoom) => {
  if (status === 0) {
    exit.classList.add('d-none')
    chat.classList.add('d-none')
    connect.classList.remove('d-none')
  } else if(status === 1) {
    innerID(idRoom)
    
    exit.classList.remove('d-none')
    chat.classList.remove('d-none')
    connect.classList.add('d-none')
  }
}


socket.on('alert status', ({ type, text, status, id }) => {
  createAlert(type, text, status, id)
})

socket.emit('room', room)

form.addEventListener('submit', e => {
  e.preventDefault();
  if(input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

exit_btn.addEventListener('click', () => {
  socket.emit('change chat')
})

connect_form.addEventListener('submit', e => {
  e.preventDefault();
  if(connect_input.value) {
    socket.emit('connect chat', parseInt(connect_input.value))
    connect_input.value = ''
  }
})

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});