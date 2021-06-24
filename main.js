const formatMessage = require('./utils/messages');
const { buildingPossible } = require('./utils/netz');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

var gameActive = false
var state={}
var map={}
const path=require('path')
const express=require('express');
const { createConnection } = require('net');
const { findPlacesAroundArea } = require('./utils/netz');
const app = express();
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
  console.log(" new connection")
  
  socket.on('createRoom', ({ username, room,quantity,landscape }) => {
    socket.emit('back', "start creating room")
    console.log("start creating room")
    const user = userJoin(socket.id, username, room);
    console.log("created the user")
    quantity = parseInt(quantity);
    console.log("start joining room")
    socket.join(user.room);
    console.log("socket joined room")
    console.log("tries creating state")
    state  = createState( user,state,room,quantity)
  
    const roomname = room;
    console.log("start creating map")
    map = createMap(map, room, landscape)
    console.log("created map")
    console.log('player ', username , 'complete-----------------------' )
    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Space-Settlers, Creator!'));
    
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    socket.on('house', id=>{
      console.log("start building house")
      buildHouse(id,state,user); })
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log("start disconn", username)
    
     userx = userLeave(socket.id);
    if (userx) {
      io.to(userx.room).emit(
        'message',
        formatMessage(botName, `${userx.username} has left the game`)
      );
        //send state info
      io.to(user.room).emit('stateInfo',{
        stateRoom:state[user.room]
      });
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
  });

  socket.on('joinRoom', ({ username,room}) => {
    roomState = state[room]
   
    console.log(username , "tries joinin room")
    if (gameActive){ 
      console.log("game is active"); 
      }
      console.log("creating user")
      const user = userJoin(socket.id, username, room);
      socket.join(user.room);console.log("created user")
      console.log("start check extend of state")
      const rg = checkExtendState( user, state) 
      console.log("extend state check ...end. result", rg) 
      if (!rg){ console.log("leaving cause negative feedback of extending state"); 
      // socket.emit('leave');
     }else{

      }
  
      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to Space-Settlers!'));
      io.to(user.room).emit('init', map[user.room]);
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
      console.log("check if slot is open")
      if (teamComplete(state[user.room])){ 
        //im view wird karte angezeigt
        console.log("start sending map")
        socket.emit('init', map[user.room]);
        console.log("sent map")
        console.log("starting game interval...");
      startGameInterval(room, map,user)}; 

      socket.on('house', id=>{
        console.log(id, "tries to build, check for game active");
        if (gameActive) { buildHouse(id,state,user)}})
      // Listen for chatMessage
      socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log("disconnect of joiner")
    console.log("start deletion of player from state")
    deletePlayerFromState(state, user)
    console.log("deletion worked, deletion from users")
     userx = userLeave(socket.id);
     console.log("deletion worked")
    if (userx) {
      io.to(userx.room).emit(
        'message',
        formatMessage(botName, `${userx.username} has left the game`)
      );
        //send state info
      io.to(user.room).emit('stateInfo',{
        stateRoom:state[user.room]
      });
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
  });

});

const botName = 'AutoBot';

function startGameInterval(room, map, user) {
  console.log('start game interval, set game active')
  
  gameActive=true;
  state[room].turnTime = timeGetter();
  console.log("set time", state[room].turnTime )
  const intervalId = setInterval(() => {
    let allPlayers = getRoomUsers(user.room);
    const quantity = state[user.room].quantity
    if (quantity > allPlayers.length)
    {clearInterval(intervalId); io.to(user.room).emit('gameEnder'); }
    console.log('check for winner')
    //???
    const winner = gameLoop(state[room],map, user);
    console.log('winner? ', winner)

    if (!winner) {

      console.log('emiting room state ')
      emitGameState( room, state[room])
    } else {
      console.log('emiting game over ')

      emitGameOver(room, winner);
      console.log('set it to null ')
      state[room] = null;
      console.log('delete room method')
      // deleteRoom(state, map, user)
      clearInterval(intervalId);
    }
  }, 500 );
}
function gameLoop(roomState,map,user){
  console.log('gameLoop, which watches for a winner')
  io.to(user.room).emit('killModal');
  console.log("killed modal")
    if (watchForWinner(roomState)){
      console.log('winner exists')
      
      return true}
      console.log('no winner')
      var recTime = timeGetter()
      roomState.timeDif = 30-(recTime-roomState.turnTime);
      console.log("timediff", roomState.timeDif)
      if (roomState.timeDif<=0){
        //wenn keine Zeit bleibt, 
        //setze turnTime neu, und wechsle spieler
        roomState.turnTime = timeGetter()
        console.log("neue turntime",roomState.turnTime)
        roomState.activePlayerNumber=(roomState.activePlayerNumber )%(roomState.quantity) +1
        console.log("new player active", roomState.activePlayerNumber)
        neuerWurf(roomState,map,user);
      }
    return false
}
function neuerWurf(roomState, map,user){
  const num = Math.floor((Math.random() * 12) + 2);
  roomState.Wurf = num
  distributeResources(map[user.room], num, user)
}
function distributeResources(roomMap, num, user)
  {
    var areas = findAreas(roomMap , num)
    console.log("all areas", areas)
    //go through array and value each item out
    areas.forEach(element => {
      if (element.res<6){
      let places = findPlacesAroundArea(element.index)
      places.forEach(place => {
       savedPlayerNumber = state[user.room].net[place].playerNumber
       if(savedPlayerNumber>0){
       savedValue = state[user.room].net[place].value
       state[user.room][savedPlayerNumber][element.res]+= savedValue
       }
      })
      }}
  )
  }
function watchForWinner(roomState) {
  
  const playerCount=roomState['playerCount'];
  for (let index = 1; index <= playerCount; index++) {
    if (roomState[index].points>=50){
      console.log('winner of points, username ', roomState[index].username)

      return true
    }
    return false
    
  } 
}

function keyByVal(object, val){
  console.log("finding key to value")
  return Object.keys(object).find(key=>object[key].clientID===val)
}
function teamComplete(roomState){
  console.log("looking if team complete")
  if(roomState.playerCount===roomState.quantity){
    console.log("true")
    return true}
    console.log("false")
  return false
}
function checkIfPlayerActive(state,user){
  var number = keyByVal(state[user.room], user.id);
  console.log(number," number")
  console.log("im state:", state[user.room].activePlayerNumber)
  return state[user.room].activePlayerNumber==number
}

function buildHouse(id, state,user){
  if (!gameActive || !checkIfPlayerActive(state, user) || !checkBuildingPossible(id, state,user)||!enoughResourcesHouse(state,user)){
    console.log("game or player not active, dismissed building house");
    console.log(checkIfPlayerActive(state, user))
    return
  }
function takeResourcesHouse(state,user){
  var  number = keyByVal(state[user.room], user.id)
  state[user.room][number][3]-=2
      state[user.room][number][4]-=1 
      state[user.room][number][5]-=2
}
function enoughResourcesHouse(state, user)
  {
    var  number = keyByVal(state[user.room], user.id)
    if(state[user.room][number][3]>=2&&
      state[user.room][number][4]>=2 &&
      state[user.room][number][5]>=1)
        return true;
        return false
  }
  function checkBuildingPossible(PlaceId, state, user)
  {
    var  number = keyByVal(state[user.room], user.id)
    //wenn noch keine 2 häuser, immer bauen lassen
    if (state[user.room][number].points<2) return true;
    let places = buildingPossible(PlaceId)
    let ret = false
      for (let index = 0; index < places.length; index++) {
        
        if (state[user.room].net[places[index]].playerNumber==number){
            ret = true
        }
      }
      return ret
  }
  console.log("building house")

  // über userid an die playernumber kommen
  console.log("get to userid with playernumber")
  var  number = keyByVal(state[user.room], user.id)
  console.log("set the playernumber of the house")
  state[user.room].net[id].playerNumber = number;

  console.log("sign in value of house")
  state[user.room].net[id].value = 1;
  console.log("collect points");
  state[user.room][number].points++;
  takeResourcesHouse(state,user)
  
}

function timeGetter(){
  //get the exakt number of millisconds since 1970
  var d = new Date();
  var n = d.getTime()/1000;
  return n
}
function createState( user,state,room,quantity){
   console.log("creates state...")
   // setting turn Time when game active
   state[room] ={
   Wurf: 0,
   timeDif: 30,  
   turnTime: 0,  
   activePlayerNumber: 1,
   playerCount: 1,
   quantity: quantity,
   net: createNet(),
   1 :  { username: user.username, clientID: user.id,
                    1: 10, 2: 9, 3: 8, 4: 7, 5: 6, points:0,color: color(1)}
 }
 return state
}

function createNet(){
  console.log("creates net in state")
  var net = {};
  for (let index = 1; index < 241; index++) {
    net[index] = {playerNumber: 0 , value: 0};
    
  }
  console.log("randomness algorithm terminated suc.")
  return net;
}

function checkExtendState( user, state)
{ 
    console.log("extend check")
    if (state[user.room]){
    if(state[user.room].playerCount < state[user.room].quantity){
      console.log("decided to extend, because playercount<quantity")
      extendState( user,state); }}
    else{
      console.log("no extension, playerCount>=quantity")
      return false}
};
function deleteRoom(state, map, user){
  console.log("deleteroom tries to delete map")
  deleteMap(map, user.room)
  console.log("map deleted, tries to delete state")
  delete state[user.room]
  console.log("state deleted")
}
function extendState( user, state)
{console.log("try extend state")
  console.log("try raise state->playerCount", state[user.room].playerCount)
  
  state[user.room].playerCount++;
  console.log("after", state[user.room].playerCount)
  const playerNum =  state[user.room].playerCount;
  console.log("writing in new user in state")

  state[user.room][playerNum] = { username: user.name, clientID: user.id,
    1: 10, 2: 9, 3: 8, 4: 7, 5: 6, points:0,color: color(playerNum)}
  console.log("success")
   
   return true
}
function color(playerN)
{
  console.log("finding color")

  switch (playerN){
  case 1: return "rgb(177, 20, 20)" ;
  
  case 2: return "MediumSeaGreen" ;
  
  case 3: return"DodgerBlue" ;
  
  case 4: return"Tomato" ;
  
  case 5: return"pink" ;

  // "red","white" ,"grey","lightred","pink"
  }
}
function deletePlayerFromState(state,user){
  console.log('try to delete player', user.username)
  console.log("check if playerCount >=1. it is ", state[user.room].playerCount)

  if (state[user.room].playerCount>=1){
    console.log('try to delete player', user.username)
    var  number = keyByVal(state[user.room], user.id)
    console.log('keyByVal success,value', number)
  console.log('if -1, no deletion')
    
    if (number != -1){
        console.log('try delete state of', number )

        delete state[user.room][number]

        console.log("player deleted")
    }
    return
  }
}

function deleteMap(map,roomname){

  console.log('try to delete map')
  delete map[roomname]
  console.log("new map after deletion")

  return
}

function createMap( map, room, landscape){
  console.log('creates map from algo')

  map[room] = {}
   for (let index = 1; index < 144; index++){
    if (landscape=="normal"){
    map[room][index]=algoNormal();}
    if (landscape=="desert"){
      map[room][index]=algoDesert();}
      if (landscape=="water"){
        map[room][index]=algoWater();}
        if (landscape=="rich"){
          map[room][index]=algoRich();}

  } return map
}
function findAreas(roomMap, number){
  let result=[]
  for (let index = 1; index < 144; index++){
    if( roomMap[index].num==number ){
      result.push( {index: index, res: roomMap[index].res})
    }  
  }
  console.log("result finding areas", result)
  return result
}

function emitGameState(room, gameState) {
  console.log('emits game state')
  io.to(room).emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  console.log('emits game over')
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}
function algoDesert(){
  const num = Math.floor((Math.random() * 12) + 2);
  var res = Math.floor((Math.random() * 10) + 1);
  if(res>=6)res=7;
  const parcel={num: num, res: res}
  return parcel
}
function algoNormal(){
  const num = Math.floor((Math.random() * 10) + 2);
  const res = Math.floor((Math.random() * 6) + 1);
  
  const parcel={num: num, res: res}
  return parcel
}
function algoRich(){
  const num1 = Math.floor((Math.random() * 5) + 1);
  const num2 = Math.floor((Math.random() * 5) + 1);
  const num = num1+num2;
  const res = Math.floor((Math.random() * 4) + 1);
  
  const parcel={num: num, res: res}
  return parcel
}
function algoWater(){
  const num = Math.floor((Math.random() * 10) + 2);
  var res = Math.floor((Math.random() * 8) + 1);
  if(res>=6)res=6;
  const parcel={num: num, res: res}
  return parcel
}

const PORT = process.env.PORT || 8000;

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
