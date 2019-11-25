// npm install lowdb ???
// db if needed
// express app
const app = require('express')();
// http
const http = require('http').Server(app);
// cross origin requests
const cors = require('cors');
app.use(cors({credentials: true, origin: true}))
// socket io
const io = require('socket.io')(http, {
  allowUpgrades: true,
  httpCompression: true,
  origins: '*:*',
  pingTimeout: 60000,
});
// adding for ability to parse json
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// bluebird promise
const Promise = require('bluebird');



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
    console.log('created')
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

  // coordinate game state
  socket.on('request_game_state', (data) => {
    socket.to(data.gameKey).emit('send_game_state')
  })

  socket.on('game_state', (data) => {
    socket.to(data.gameKey).emit('game_state', data)
  })

  socket.on('activate_player', (data) => {
    io.in(data.gameKey).emit('player_activate', data);
  });

  socket.on('reorder_players', (data) => {
    io.in(data.gameKey).emit('reorder_players', data);
  });

  // quit the game
  socket.on('quit_game', (data) => {
    socket.to(data.gameKey).emit('player_quit', data);
  });

  //
  // GAME PLAY
  //

  socket.on('add_question', (data) => {
    io.in(data.gameKey).emit('question_added', data.question);
  });

  socket.on('add_answer', (data) => {
    io.in(data.gameKey).emit('answer_added', data.answer);
  });

  socket.on('adjudicate_answers', (data) => {
    io.in(data.gameKey).emit('answers_adjudicated', data)
  })

  socket.on('reveal_authors', (data) => {
    io.in(data.gameKey).emit('authors_revealed')
  })

  socket.on('score_answers', (data) => {
    io.in(data.gameKey).emit('answers_scored')
  })

  socket.on('advance_round', (data) => {
    io.in(data.gameKey).emit('new_round')
  })

  socket.on('select_answer', (data) => {
    io.in(data.gameKey).emit('answer_selected', { answer: data.answer, player: data.player });
  });

});


http.listen(8087, '0.0.0.0', () => {
    console.log('Listening on port *: 8087');
});