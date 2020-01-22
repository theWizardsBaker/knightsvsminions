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
//
app.use(cors({credentials: true, origin: true}));
const Datastore = require('nedb');
// socket io
const io = require('socket.io')(http, {
  allowUpgrades: true,
  httpCompression: true,
  origins: '*:*',
  pingTimeout: 900000,
  transports: ['websocket', 'polling']
  // resource: '/avalon/socket.io'
  // path: process.env.NODE_ENV === 'production' ? '/software/knightsvsminions/socket.io' : '/socket.io'
});
// api fallback for SPA
const history = require('connect-history-api-fallback');
// adding for ability to parse json
const bodyParser = require('body-parser');
app.use(bodyParser.json());
if(process.env.NODE_ENV === 'production'){
  // create the static app
  const staticApp = express.static(path.join(__dirname, 'dist'));
  // serve the app
  // app.use(staticApp)
  app.use(staticApp);
  app.use(history());
  app.use(staticApp);
}


generateId = () => {
  let number = Math.random()
  // replace commonly mis-read characters
  return (number.toString(36).substr(2, 5)).replace("0", "O").replace("i", "1").replace("l", "2").toUpperCase()
}

generateUserId = (name) => {
  return name.replace(' ', '_') + '_' + Math.floor( Math.random() * 9000 ) + 1000;
}

db = new Datastore({ inMemoryOnly: true });

db.ensureIndex({ fieldName: 'gameKey', unique: true }, (err) => { console.log(err); });


io.on('connection', (socket) => {

  socket.on('connect_error', (error) => {
    console.log("CONNECTION ERROR", error);
  });

  socket.on('error', (error) => {
    console.log("ERROR", error);
  });

  socket.on('connect_timeout', (timeout) => {
    console.log("TIMEOUT");
  });

  //
  // GAME FUNCTIONS
  //

  socket.on('create_game', (data, callback) => {
    // create unique room key
    let gameKey = generateId();
    // create unique user id
    let userId = generateUserId(data.name);
    db.insert({
      inGame: false,
      gameKey: gameKey.toUpperCase(),
      maxPlayers: data.maxPlayers,
      players: [
        {
          userId: userId,
          name: data.name,
          active: true
        }
      ],
      gameEvents: []
    }, (err, newDoc) => {
      // join / create room
      socket.join(gameKey.toUpperCase());
      // tell user the game's created
      callback({
        error: false,
        data: {
          userId: userId,
          gameKey: gameKey.toUpperCase(),
          name: data.name,
        }
      });
    });
  });

  // join the game
  socket.on('join_game', (data, callback) => {
    // make sure the room exists
    // let rooms = io.sockets.adapter.rooms;
    // // upper case er'thing
    data.gameKey = data.gameKey.toUpperCase();
    db.findOne({
      gameKey: data.gameKey
    }, (err, doc) => {
      if(doc){
        // check the room's not full
        if(doc.maxPlayers > doc.players.length || doc.inGame){
          // join / create room
          socket.join(data.gameKey);
          // create unique user id
          let userId = generateUserId(data.name)
          // insert user
          db.update({
            _id: doc._id
          }, {
            $push: {
              players: {
                userId: userId,
                name: data.name,
                active: true
              }
            }
          }, (err, newDoc) => {
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

          });
        } else {
          // throw the error in the callback
          callback({
            error: true,
            data: {
              message: 'Game room is full'
            }
          });
        }
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
  });

  // quit the game
  socket.on('quit_game', (data) => {
    db.update({
      gameKey: data.gameKey.toUpperCase()
    },{
      $pull: {
        players: {
          userId: data.userId
        }
      }
    },
    (err, result) => {
      // db.findOne({
      //   gameKey: data.gameKey
      // }, (err, doc) => {
        // console.log(doc, doc.players.length)
        // if(doc && doc.players.length <= 0){
        //   db.remove({
        //     gameKey: data.gameKey
        //   }, {}, () => {
        //     console.log('game removed')
        //   })
        // }
        socket.to(data.gameKey).emit('player_quit', data);
      // });
    });
  });


  socket.on('begin_game', (data) => {
    db.update({
      gameKey: data.gameKey.toUpperCase()
    },{
      $set: {
        inGame: true
      }
    },
    (err, doc) => {
      io.in(data.gameKey).emit('begin_game', data);
    });
  });

  // coordinate game state
  socket.on('get_players', (data) => {
    db.findOne({
      gameKey: data.gameKey
    }, (err, doc) => {
      // if we found it
      if(doc){
        // send the list of players
        socket.emit('player_list', {
          players: doc.players
        });
      }
    });
  });

  // coordinate game state
  socket.on('request_game_state', (data, callback) => {
    db.findOne({
      gameKey: data.gameKey
    }, (err, doc) => {
      // if we found it
      if(doc){
        console.log(data.sync, doc.gameEvents.length)
        // if we've missed messages
        if(data.sync < doc.gameEvents.length){
          // go through each one and send them
          // for(let i = data.sync; i < doc.gameEvents.length; i++){
            // send the saved messages to the client
            // socket.emit(doc.gameEvents[i].message, doc.gameEvents[i].data)
            (function looper(i){
              setTimeout(() => {
                console.log("EMIT", doc.gameEvents[i].message, doc.gameEvents[i].data)
                socket.emit(doc.gameEvents[i].message, doc.gameEvents[i].data);
                if (--i) {
                  looper(i);
                }
              }, 400);
            })(doc.gameEvents.length -  data.sync);
          // }
        }

      }

      callback({
        success: true,
      });

    });

  });

  // socket.on('game_state', (data) => {
  //   socket.to(data.gameKey).emit('game_state', data)
  // })

  response = (message, data) => {
    db.update({
      gameKey: data.gameKey.toUpperCase()
    },{
      $push: {
        gameEvents: {
          message: message,
          data: data
        }
      }
    },
    (err, doc) => {
      io.in(data.gameKey).emit(message, data)
    });
  }

  socket.on('submit_team', (data) => {
    response('team_selected', data);
  });

  socket.on('vote', (data) => {
    response('player_vote', data);
  });

  socket.on('reveal_picks', (data) => {
    response('picks_revealed', data);
  });

  socket.on('team_result', (data) => {
    response('team_vote', data);
  });

  socket.on('submit_quest', (data) => {
    response('quest_outcome', data);
  });

  socket.on('reveal_quest', (data) => {
    response('quest_reveal', data);
  });

});


// http.listen(8087, '127.0.0.1', () => {
http.listen(8087, '0.0.0.0', () => {
    console.log('Listening on port *: 8087');
});