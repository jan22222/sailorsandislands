const formatMessage = require('./utils/messages');
const { buildingPossible } = require('./utils/netz');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
var seedrandom = require('seedrandom');
const generator = seedrandom(timeGetter());
var gameActive = {}
var state={}
var map={}
var round={}
var turnSaver ={} //saves if user build 1 house in first 2 rounds e.g. turnSaver[user]=true then turn is save. has to be reseted
const path=require('path')
const express=require('express');
const { createConnection } = require('net');
const { findPlacesAroundArea } = require('./utils/netz');
const app = express();
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//LIFE CIRLE
// Run when client connects
io.on('connection', socket => {



 //prepares a join
  
  socket.on('tryJoinRoom', ({username,room}) => {
    if  (!state[room] ){
      socket.emit('leaveRoom')
    }
    if(state[room] && checkExtendState(room)){
      let data={username,room}
      socket.emit('roomPermitance', data)
    }
  })

// Joiner
  //LIFE CIRCLE OF A JOINER

  socket.on('joinRoom', ({username,room}) => {

    
    
    //if team is already complete, stop here.
    
      //putting user into users array
      const user = userJoin(socket.id, username.username,username.room);
      roomState = state[user.room]
    if (teamComplete( roomState)){socket.emit('leaveGame')}else
    {
      socket.join(user.room);

      //extend state
      extendState(user, state)


      if (teamComplete( roomState)){
        startGameInterval(user.room,map,user)
      }

      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to sailors and islands!'));
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

      socket.on('house', id=>{
        if (gameActive[user.room]) { buildHouse(id,state,user)}})
      // Listen for chatMessage
      socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });
      // client clicks ready button an skips round
      socket.on('ready', (id)=>{
        // if(roomState.activePlayerNumber==id){
        state[user.room].timeDif = 0
      })

      // Runs when client disconnects

      socket.on('disconnect', () => {
        
          const users = getRoomUsers(user.room)
          // dann raum verlassen
          userx = userLeave(socket.id);
        
          //wenn er der letzte war, state und map löschen
          if (users.length==1){console.log("deletes state"); state[user.room]=null; map[user.room]=null;}
        })
      //else-statement ends here
      }  
      // join circle ends  
      })


//DISTINGUISHES IN CREATOR AND  JOINER


  socket.on('createRoom', ({ username, room,quantity,landscape }) =>
  {
    
    //IF ROOM ALREADY EXISTS
    if (state[room]){socket.emit('leaveGame');  console.log("room exists")}
    else{
    socket.emit('back', "start creating room")
    const user = userJoin(socket.id, username, room);
    quantity = parseInt(quantity);
    socket.join(user.room);
    state  = createState( user,state,room,quantity)
  
    const roomname = room;
    map = createMap(map, room, landscape)
    console.log("created map")
    console.log('player ', username , 'complete-----------------------' )
    

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Sailors and Islands, you created the game!'));
    
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
   

    socket.on('house', id=>{
      console.log("start building house")
      // if (round[user.room] == 1 && turnSaver[user])
      buildHouse(id,state,user); })

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('ready', (id)=>{
      // if(roomState.activePlayerNumber==id){
      console.log("setting timedif to 0")
      state[user.room].timeDif = 0
    })


    // DISCONNECT OF CREATOR
    socket.on('disconnect', () => {
      console.log("start disconnect of creator ", username)
      //erst raum ansehen
      const users = getRoomUsers(user.room)
      // dann raum verlassen
      userx = userLeave(socket.id);
      //wenn er der letzte war, state und map löschen
      if (users.length==1){console.log("deletes state"); state[user.room]=null; map[user.room]=null;}
    //disconnect ends
    });
    //the else-condition ends
  }

  //end create room circle
  })
  //complete end conn
});
  



//FOLLOWING ALL THE FUNCTIONS WHICH ARE NOT DIRECTLY IN A LIFE CIRCLE



const botName = 'AutoBot';

function startGameInterval(room, map, user) {
  console.log('start game interval, set game active')
  round[user.room] = 1;
  gameActive[user.room]=true;
  state[room].turnTime = timeGetter();
  console.log("set time", state[room].turnTime )
  const intervalId = setInterval(() => {
    let allPlayers = getRoomUsers(user.room);

    //beenden falls ein spieler weg ist 
    const quantity = state[user.room].quantity
    if (quantity > allPlayers.length)
    {clearInterval(intervalId); gameActive[user.room]=false; io.to(user.room).emit('gameEnder');  }
    
    const winner = gameLoop(state[room],map, user);
    

    if (!winner) {

      
      emitGameState( room, state[room])
    } else {
      console.log('emiting game over ')

      emitGameOver(user.room, winner);
     
      // deleteRoom(state, map, user)
      clearInterval(intervalId);
      gameActive[user.room]=false;
      map[user.room] = null;
      state[user.room] = null;
    }
  }, 500 );
}
function gameLoop(roomState,map,user){
  
  io.to(user.room).emit('killModal');
  //alternative ende
    if (watchForWinner(roomState)){
      
      
      return true}
      
      
      
      
      if (roomState.timeDif<=0){
        //wenn keine Zeit bleibt, 
        //setze turnTime neu, und wechsle spieler
        roomState.turnTime = timeGetter()
        //iterate over turnSaver and set all  values false
        for (const key in turnSaver) {
          turnSaver[key] = false
      }
        //runde 1 endet (normale spielmechnanik ist ganz am ende bei else)
        if(round[user.room] == 1 &&roomState.activePlayerNumber==(roomState.quantity) ){
          round[user.room] = 2
          
           
        }//runde 2 endet
        else if(round[user.room] == 2 &&roomState.activePlayerNumber==1 ){
          round[user.room] = 3
          roomState.activePlayerNumber=2
           
        }//rückwärts gehen in runde 2
        else if(round[user.room]==2){
          roomState.activePlayerNumber=(roomState.activePlayerNumber ) -1
        }
        else //normale Spielmechanik: einfach nächster Spieler ist dran
        {roomState.activePlayerNumber=(roomState.activePlayerNumber )%(roomState.quantity) +1}
        
        console.log("runde", round[user.room] )
        console.log(turnSaver)
        console.log("new player active", roomState.activePlayerNumber)
          if(round[user.room]>2){
          neuerWurf(roomState,map,user);
          }
      }
      var recTime = timeGetter()
      roomState.timeDif = 30-(recTime-roomState.turnTime);
    return false
}
function neuerWurf(roomState, map,user){
  var prng = generator()
  const num = Math.floor((prng* 5) + 1);
  var prngx = generator()
  const num2 = Math.floor((prngx* 5) + 1);
  roomState.Wurf = num+num2
  distributeResources(map[user.room], roomState.Wurf, user)
  // io.to(user.room).emit('warningMessage', (message))
}
function distributeResources(roomMap, num, user)
  {
    var areas = findAreas(roomMap , num)
    console.log("Wurf Nummer ", num, "areas ", areas)
    
    //go through array and value each item out
    areas.forEach(element => {
      if (element.res<6){
        console.log("a")
      let places = findPlacesAroundArea(element.index)
      places.forEach(place => {
        console.log("place ", place)
       savedPlayerNumber = state[user.room].net[place].playerNumber
       
       if(savedPlayerNumber>0){
       savedValue = state[user.room].net[place].value
       state[user.room][savedPlayerNumber][element.res]+= savedValue
       console.log("Player ",savedPlayerNumber,"got ",savedValue,"of ", element.res )
       }
      })
      }}
  )
  }

function watchForWinner(roomState) {
  if(!roomState){return false}else{
  const playerCount = roomState['playerCount'];
  for (let index = 1; index <= playerCount; index++) {
    if (roomState[index].points>=50){

      return true
    }
    return false
    
  } }
}

function keyByVal(object, val){
  return Object.keys(object).find(key=>object[key].clientID===val)
}

function teamComplete(roomState){

  if(roomState.playerCount===roomState.quantity){
   
    return true}
    
  return false
}

function checkIfPlayerActive(state,user){
  var number = keyByVal(state[user.room], user.id);
  return state[user.room].activePlayerNumber==number
}

function buildHouse(id, state, user){
  console.log("ts ", turnSaver[user]," ",round[user.room])
  if (!gameActive[user.room] || !checkIfPlayerActive(state, user) || !checkBuildingPossible(id, state,user)|| (turnSaver[user]&&round[user.room]<3)){
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
      state[user.room][number][4]>=1 &&
      state[user.room][number][5]>=2)
        return true;
        return false
  }
  function takeResourcesHouse(state,user){
    var  number = keyByVal(state[user.room], user.id)
    state[user.room][number][3]-=2
        state[user.room][number][4]-=1 
        state[user.room][number][5]-=2
        turnSaver[user]=true
  }
  function enoughResourcesVillage(state, user)
    {
      var  number = keyByVal(state[user.room], user.id)
      if(state[user.room][number][1]>=3&&
        state[user.room][number][2]>=2 )
        
          return true;
          return false
    }
    function takeResourcesVillage(state,user){
      var  number = keyByVal(state[user.room], user.id)
      state[user.room][number][1]-=3
          state[user.room][number][2]-=2 
          
    }
  //the function checks if building possible due to distance to other houses:
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
  var  number = keyByVal(state[user.room], user.id)
  if(state[user.room].net[id].value == 0 && enoughResourcesHouse(state, user)){
      state[user.room].net[id].playerNumber = number;
      state[user.room].net[id].value = 1;
      state[user.room][number].points++;
      takeResourcesHouse(state,user)
  }else
    if(state[user.room].net[id].value == 1&&state[user.room].net[id].playerNumber == number&&enoughResourcesVillage(state, user)){
    
    state[user.room].net[id].value = 2;
    state[user.room][number].points++;
    takeResourcesVillage(state,user)
  	}
}

function timeGetter(){
  //get the exakt number of millisconds since 1970
  var d = new Date();
  var n = d.getTime()/1000;
  return n
}
function createState( user,state,room,quantity){
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
                    1: 0, 2: 0, 3: 4, 4: 2, 5: 4, points:0,color: color(1)}
 }
 return state
}

function createNet(){
  var net = {};
  for (let index = 1; index < 241; index++) {
    net[index] = {playerNumber: 0 , value: 0};
    
  }
  return net;
}

function checkExtendState( room)
{ 
    if (state[room]){
    if(state[room].playerCount < state[room].quantity){
       return true}}
    else{
      return false}
};

function extendState( user, state)
{
  state[user.room].playerCount++;
  const playerNum =  state[user.room].playerCount;
  state[user.room][playerNum] = { username: user.name, clientID: user.id,
    1: 0, 2: 0, 3: 4, 4: 2, 5: 4, points:0,color: color(playerNum)}
   
   return true
}
function color(playerN)
{

  switch (playerN){
  case 1: return "rgb(177, 20, 20)" ;
  
  case 2: return "MediumSeaGreen" ;
  
  case 3: return"DodgerBlue" ;
  
  case 4: return"Tomato" ;
  
  case 5: return"pink" ;

 
  }
}

function createMap( map, room, landscape){

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

  return result
}

function emitGameState(room, gameState) {
  
  io.to(room).emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}
function algoDesert(){
  var prng2 = generator()
  const num = Math.floor((prng2* 10) + 2);
  var prng3 = generator()
  var res = Math.floor((prng3* 10) + 1);
  if(res>=6)res=7;
  const parcel={num: num, res: res}
  return parcel
}
function algoNormal(){
  var prng4 = generator()
  
  const num = Math.floor((prng4* 10) + 2);
  var prng5 = generator()
  const res = Math.floor((prng5* 6) + 1);
  
  const parcel={num: num, res: res}
  return parcel
}
function algoRich(){
  var prng6 = generator()
  const num1 = Math.floor((prng6 * 5) + 1);
  var prng7 = generator()
  const num2 = Math.floor((prng7* 5) + 1);
  const num = num1+num2;
  var prng8 = generator()
  const res = Math.floor((prng8 * 5) + 1);
  
  const parcel={num: num, res: res}
  return parcel
}
function algoWater(){
  var prng9 = generator()
  const num = Math.floor((prng9* 12) + 2);
  var prng10 = generator()
  var res = Math.floor((prng10 * 8) + 1);
  if(res>=6)res=6;
  const parcel={num: num, res: res}
  return parcel
}

const PORT = process.env.PORT || 8000;

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
