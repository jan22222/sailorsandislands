const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from URL
const { username, room, quantity, landscape } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

var users=[]

var socket = io("https://sailorsandislands.herokuapp.com/");
// "localhost:8000 || https://sailorsandislands.herokuapp.com/"
socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameEnder', ()=>{console.log("game ender info"); 
gameEnder();})
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('leave',()=>{window.location = '../index.html';})
socket.on('showModal', showModal)
socket.on('killModal',killModal)
socket.on('leaveGame', leaveGame)
socket.on('warningMessage', (message)=>{ app.$data.message  = message  })

socket.on('roomUsers', ({ room, users }) => {  
  this.users = users; console.log("changed users, roomUsers",this.users)
  app.$data.userlisto = this.users; 
  
});

function paintGame(state) {
 // color korrektur
 app.$data.time = Math.floor(state.timeDif);
 app.$data.recPlayer = state.activePlayerNumber;
 app.$data.Wurf=state.Wurf
//  console.log(socket.id)
  const usernumber = Object.keys(state).find(key=>state[key].clientID==socket.id)
//  console.log(usernumber)
 app.$data.usernumber=usernumber
 app.$data.erz=state[usernumber][1]
 app.$data.weizen=state[usernumber][2]
 app.$data.lehm=state[usernumber][3]
  app.$data.schaf=state[usernumber][4]
  app.$data.holz=state[usernumber][5]
 app.$data.points=state[usernumber].points

  for (let index = 1; index < 241; index++) {
    
      if (state.net[index].value===1){
        var number = state.net[index].playerNumber
        var color = state[number].color
        
        hauszeichnen( color, index) 
      }
      if (state.net[index].value===2){
        var number = state.net[index].playerNumber
        var color = state[number].color 
        villazeichnen(color, index)
      }
    };
}

function handleInit(mapa) { 
  setupCanvas(mapa)
}

function handleGameState(gameState) {

  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  
  data = JSON.parse(data);

  gameActive = false;
  const usernumber = Object.keys(state).find(key=>state[key].clientID==socket.id)
  if (data.winner == usernumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}
function showReady(){
  // const usernumber = Object.keys(state).find(key=>state[key].clientID==socket.id)
  console.log("emits ready")
  socket.emit('ready', 1)
}
function handleUnknownCode() {
  alert('Unknown Game Code')
  reject();
}

function handleTooManyPlayers() {
  alert('This game is already in progress');
  reject();
}

function reject(){
  window.location = '../index.html';
}
 

if( typeof quantity === 'undefined'){//only a join
  console.log("joinroom")
  socket.emit('tryJoinRoom', {username,room})
}
else {//then a create
  console.log("createroom")
  socket.emit('createRoom', {username,room,quantity,landscape})
}

socket.on('roomPermitance', (username, room)=>{
  console.log("after permitance trying to join as ", username, " in room", room )
  socket.emit('joinRoom',{username,room})
})

const SR = {};

 socket.on('stateInfo',
  (stateRoom)=>{

    SR = stateRoom;
  })

    // Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  this.users = users; 
});

socket.on('back', (message)=>{console.log(message)} )
// Message from server
socket.on('message', (message) => {
  
  outputMessage(message);
  // Scroll down
  // chatMessages.scrollTop = chatMessages.scrollHeight;
});

function houseBuild()
{
  socket.emit('house',findID(aktpunkt))
}
// Message submit
function chatten(e){
  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if (!msg) {
    return false;
  }
  // Emit message to server
  socket.emit('chatMessage', msg);
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
};

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  app.$data.room = room;
}
function leaveGame(){
  alert('You will leave game!');
  window.location.replace("../index.html");
}
function showModal(message, buttonOpt) {
  modal = document.getElementById("modal");
  modal.style.display = "flex";
	modal.style.flexDirection = "row";
	modal.style.justifyContent = "space-around";
	modal.style.alignItems = "flex-start";
  modal.children[1].children[0].innerText = message
  console.log("button", buttonOpt,modal.children[1].children[1].display)
  if(buttonOpt) {modal.children[1].children[1].style.display = 'block'}
  if(!buttonOpt) {modal.children[1].children[1].style.display = 'none'}
}
function gameEnder(){
  // console.log("game ender")
  // showModal("A player left the game. Game ends.", true)
  leaveGame()
}

function killModal() {
  modal = document.getElementById("modal");
  modal.style.display = "none";
}
// Add users to DOM



