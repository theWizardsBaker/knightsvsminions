import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

   	game: {
  	 	key: null,
   		host: false,
      connected: false,
      round: 0,
      leader: 0,
      minPlayers: 5,
      maxPlayers: 12,
  	},

  	user: {
      id: '',
  	},

	  players: [],

    quests: [],

  },

  getters: {

    connected: ({game}) => game.connected,

    player: ({players, user}) => players.find(player => player.userId === user.id),

    gameKey: ({game}) => game.key,

    players: ({players}) => players,

    isHost: ({game}) => game.host,

    inLobby: ({game}) => game.key && !game.connected,

    inGame: ({game}) => game.key && game.connected,

    leader: ({game, players}) => players[game.leader],

    isLeader: ({user}, { leader }) => leader.id === user.id,

    role: (store, { player }) => player.role,

    allegiance: (store, { player }) => player.role.alignment,

    quest: ({quests, game}) => quests[game.round]

  },

  mutations: {

    INCREMENT_STAGE(store, data){
      store.game.stage += data
    },

    START_GAME(store, data) {
      // reset game
      store.game = {
        host: data.host,
        key: data.player.gameKey,
        connected: data.connected,
        round: 0,
        leader: 0,
        minPlayers: 5,
        maxPlayers: 12
      }
      // reset user
      store.user = {
          id: data.player.userId,
      }
      // clear players
      store.players = []
      // clear questions
      store.questions = []
    },

    SELECT_PLAYER(store, userId){
      store.players.forEach(player => {
        if(player.userId === userId){
          Vue.set(player, 'selected', !player.selected)
          console.log(player)
        }
      })
    },

    NEXT_LEADER(store) {
      if(store.game.leader < store.players.length - 1){
        store.game.leader++
      } else {
        store.game.leader = 0
      }
    },

    // the user has quit the game. reset everything
    QUIT_GAME(store, notify) {
      if(notify){
        // notify server
        this._vm.$socket.client.emit('quit_game', { gameKey: store.game.key, user: store.user })
      }

      // reset all
      store.game = {
        key: null,
        host: false,
        connected: false,
        round: 0,
        leader: 0,
        minPlayers: 5,
        maxPlayers: 12,
      }

      store.user = {
        id: '',
      }

      store.players = []

      store.questions = []

    },

    //
    // SOCKETS
    //

    SOCKET_BEGIN_GAME(store, data){
      store.players = data.players
      store.game.connected = true
    },

    PLAYER_JOINED(store, player) {
      // add new player
      store.players.push(player)
    },

    SOCKET_SEND_GAME_STATE({game, questions, players }, data){
      if(game.host){
        this._vm.$socket.client.emit('game_state', {
          players: players,
          round: game.round,
          leader: game.leader,
          gameKey: game.key,
        });
      }
    },

    SOCKET_GAME_STATE(store, data){
      if(!store.game.host){
        store.players = data.players
      }
    },

    SOCKET_NEW_ROUND(store) {
      store.game.round++
    },

  },

  actions: {

    newGame({commit}, data){
      commit('START_GAME', { player: data, host: true, connected: false })
      commit('PLAYER_JOINED', data)
    },

    joinGame({commit}, data){
      commit('START_GAME', { player: data, host: false, connected: false })
    },

    nextRound({commit}){
      commit('INCREMENT_ROUND')
    },

    nextLeader({commit}){
      commit('NEXT_LEADER')
    },

    playerSelect({commit}, userId){
      commit('SELECT_PLAYER', userId)
    },

    quitGame({commit}){
      commit('QUIT_GAME', true)
    },

    endGame({commit}){
      commit('QUIT_GAME', false)
    },

    socket_playerJoined({commit}, data){
      commit('PLAYER_JOINED', data)
    },

  },
})
