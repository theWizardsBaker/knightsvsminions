// npm install lowdb ???
// db if needed
// express app
const express = require('express');
const app = express();
// http
const http = require('http').Server(app);
// require path
const path = require('path');
// cross origin requests
const cors = require('cors');
app.use(cors({credentials: true, origin: true}))
// socket io
const io = require('socket.io')(http, {
  allowUpgrades: true,
  httpCompression: true,
  origins: '*:*',
  pingTimeout: 60000,
  // resource: '/avalon/socket.io'
});
// adding for ability to parse json
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// create the static app
const staticApp = express.static(path.join(__dirname, 'dist'))
// serve the app
app.use(staticApp)





generateId = () => {
  let number = Math.random()
  // replace commonly mis-read characters
  return (number.toString(36).substr(2, 5)).replace("o", "0").replace("i", "1").replace("l", "2").toUpperCase()
}

generateUserId = (name) => {
  return name.replace(' ', '_') + '_' + Math.floor( Math.random() * 9000 ) + 1000;
}


io.on('connection', function (socket){

  socket.on('disconnecting', (data) => {

  });

  // game meta
  socket.on('disconnect', (data) => {

  });

  //
  // GAME FUNCTIONS
  //

  socket.on('create_game', (data, callback) => {
    // create unique room key
    let gameKey = generateId()
    // create unique user id
    let userId = generateUserId(data.name)
    // join / create room
    socket.join(gameKey);
    // tell user the game's created
    callback({
      error: false,
      data: {
        userId: userId,
        gameKey: gameKey,
        name: data.name,
      }
    });
  });

  // join the game
  socket.on('join_game', (data, callback) => {
    // make sure the room exists
    let rooms = io.sockets.adapter.rooms;
    // upper case er'thing
    data.gameKey = data.gameKey.toUpperCase();
    // if they do
    if(rooms.hasOwnProperty(data.gameKey)){
      // join / create room
      socket.join(data.gameKey);

      // create unique user id
      let userId = generateUserId(data.name)

      // notify room of new player
      socket.to(data.gameKey).emit('player_joined', {
        userId: userId,
        name: data.name,
      });

      // send back to player
      callback({
        error: false,
        data: {
          userId: userId,
          gameKey: data.gameKey,
          name: data.name,
        }
      });

    } else {
      // throw the error in the callback
      callback({
        error: true,
        data: {
          message: 'Game does not exist'
        }
      });
    }
  });

  socket.on('begin_game', (data) => {
    io.in(data.gameKey).emit('begin_game', data)
  })

  // coordinate game state
  socket.on('request_game_state', (data) => {
    socket.to(data.gameKey).emit('send_game_state')
  })

  socket.on('game_state', (data) => {
    socket.to(data.gameKey).emit('game_state', data)
  })

  socket.on('submit_team', (data) => {
    io.in(data.gameKey).emit('team_selected', data)
  })

  socket.on('vote', (data) => {
    io.in(data.gameKey).emit('player_vote', data)
  })

  socket.on('reveal_picks', (data) => {
    io.in(data.gameKey).emit('picks_revealed')
  })

  socket.on('team_result', (data) => {
    io.in(data.gameKey).emit('team_vote', data)
  })

  socket.on('submit_quest', (data) => {
    io.in(data.gameKey).emit('quest_outcome', data)
  })

  socket.on('reveal_quest', (data) => {
    io.in(data.gameKey).emit('quest_reveal', data)
  })

});


http.listen(8087, '127.0.0.1', () => {
// http.listen(8087, '0.0.0.0', () => {
    console.log('Listening on port *: 8087');
});