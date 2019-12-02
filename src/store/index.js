import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

   	game: {
  	 	key: null,
   		host: false,
      connected: false,
      synced: false,
      stage: 0,
      round: 0,
      hotseat: 0,
  	},

  	user: {
      id: '',
  	},

	  players: [],

    questions: [],
  },

  getters: {

    synced: ({game}) => game.synced,

    player: ({players, user}) => players.find(player => player.userId === user.id),

    gameKey: ({game}) => game.key,

    players: ({players}) => players,

    isHost: ({game}) => game.host,

    inLobby: ({game}) => game.key && !game.connected,

    inGame: ({game}) => game.key && game.connected,

    // hotSeatPlayer: ({players}) => players.find(player => player.hotseat),
    hotSeatPlayer: ({game, players}, ) => players.find((player) => player.order === game.hotseat),

    inHotSeat: ({user}, {hotSeatPlayer}) => {
      return hotSeatPlayer ? user.id === hotSeatPlayer.userId : false
    },

    currentQuestion: ({questions}) => questions[questions.length - 1],

    answers: (state, {currentQuestion}) => {
      if(currentQuestion){
        return currentQuestion.answers
      } else {
        return []
      }
    },

    answersRemaining: (state, {currentQuestion, activePlayers}) => {
      if(currentQuestion && activePlayers){
        return activePlayers.length - currentQuestion.answers.length
      } else {
        return 0
      }
    },

    answerPicksRemaining: (state, {currentQuestion, activePlayers}) => {
      let picks = 0
      if(currentQuestion && activePlayers){
        currentQuestion.answers.forEach((answer) => {
          picks += answer.picks.length
        })
      }
      // ignore the hot seat player
      return (activePlayers.length - 1) - picks
    },

    gameWinner: (state, {player, activePlayers}) => {
      let highScore = activePlayers.sort((a, b) => b.score - a.score)
      return highScore.length > 0 ? highScore[0].userId === player.userId : null
    }
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
        score: 0,
        round: 0,
        stage: 0,
        hotseat: 0,
        connected: data.connected,
        synced: data.synced,
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

    ACTIVATE_PLAYERS(store){
      store.players.forEach((player) => {
        player.active = true
      })
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
        synced: false,
        stage: 0,
        round: 0,
        hotseat: 0,
      }

      store.user = {
        id: '',
      }

      store.players = []

      store.questions = []
    },

    COMPUTE_SCORES(store, hotSeatPlayer){
      let correctGuess = []
      let playerScores = {}
      // add 'em up
      store.questions[store.questions.length - 1].answers.forEach((answer) => {
        // if the player guessed the hotseat's answer,
        // then they are awarded 4 points
        if(!!answer.correct){
          // don't need to add because the round only awards points
          // to those users who guessed correctly
          playerScores[answer.player.userId] = 4
          correctGuess.push(answer.player.userId)
        } else {
          // if not,
          // 1 point for every guess
          // and 2 points for guessing the hotseat's answer 
          if(hotSeatPlayer.userId === answer.player.userId){
            // we're looking at the hotseat's player
            // give 2 points to whoever guessed this correctly
            answer.picks.forEach((pick) => {
              if(playerScores.hasOwnProperty(pick.userId)){
                playerScores[pick.userId] += 2

              } else {
                playerScores[pick.userId] = 2
              }
            })
          }

          // otherwise we're on a player's answer
          // give that player 1 point for every pick
          if(playerScores.hasOwnProperty(answer.player.userId)){
            playerScores[answer.player.userId] += answer.picks.length
          } else {
            playerScores[answer.player.userId] = answer.picks.length
          }
          // award extra points
          if(!!answer.extraPoints){
            playerScores[answer.player.userId] += 2
          }
          
        }
      })

      // set the player's scores
      store.players.forEach((player) => {
        let score = 0
        if(correctGuess.length > 0){
          score = correctGuess.includes(player.userId) ? playerScores[player.userId] : 0
        } else {
          score = playerScores[player.userId] || 0
        }
        Vue.set(player, 'score', player.score + score)
        Vue.set(player, 'scoreChange', score)
      })
    },


    //
    // SOCKETS
    //
    SOCKET_TEST(store){
      alert('HELLO')
    },

    SOCKET_BEGIN_GAME(store, data){
      console.log("GAME HAS BEGUN", data)
      store.game.connected = true
    },

    SOCKET_REORDER_PLAYERS(store, data){
      store.players.forEach((player) => {
        player.order = data.playerOrder[player.userId]
      })
    },

    SOCKET_ANSWERS_ADJUDICATED(store, data){
      // shuffle arrays
      let answers = store.questions[store.questions.length - 1].answers
      // shuffle answers
      for (let i = answers.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = answers[i]
        // check the correct / duplicate status
        if(data.correct.includes(temp.player.userId)){
          Vue.set(temp, 'correct', true)
        }
        if(data.duplicates.includes(temp.player.userId)){
          Vue.set(temp, 'duplicate', true)
        }
        if(data.extraPoints === temp.player.userId){
          Vue.set(temp, 'extraPoints', true)
        }
        answers[i] = answers[j]
        answers[j] = temp
      }
    },

    SOCKET_ANSWER_SELECTED(store, data){
      store.questions[store.questions.length - 1].answers.forEach((answer) => {
        // remove any other selections
        for(let i = 0; i > answer.picks.length; i++){
          if(answer.picks[i].userId === answer.player.userId){
            // remove it
            Vue.delete(answer.picks, i)
            // stop the loop
            i = answer.picks.length
            break;
          }
        }
        // add the pick
        if(answer.player.userId === data.answer.player.userId){
          // add the player as the pick
          answer.picks.push(data.player)
        }
      })
    },

    // a new question has been added
    SOCKET_ANSWER_ADDED(store, answer){
      answer.picks = []
      store.questions[store.questions.length - 1].answers.push(answer)
    },

    // a new question has been added
    SOCKET_QUESTION_ADDED(store, question){
      question.answers = []
      store.questions.push(question)
    },

    PLAYER_JOINED(store, player) {
      // set player defaults
      Vue.set(player, 'order', store.players.length)
      Vue.set(player, 'score', 0)
      Vue.set(player, 'hotseat', false)
      Vue.set(player, 'active', false)
      // add new player
      store.players.push(player)

    },

    SOCKET_SEND_GAME_STATE({game, questions, players}, data){
      if(game.host){
        this._vm.$socket.client.emit('game_state', {
          questions: questions,
          players: players,
          stage: game.stage,
          round: game.round,
          gameKey: game.key,
        });
      }
    },

    SOCKET_GAME_STATE(store, data){
      if(!store.game.host){
        store.players = data.players
        store.questions = data.questions
        store.game.stage = data.stage
        store.game.round = data.round
        store.game.synced = true
      }
    },

    // another player is active this round
    SOCKET_PLAYER_ACTIVATE({players, game}, user) {
      let player = players.find( player => player.id === user.id )
      player.active = true
    },

    SOCKET_NEW_ROUND(store) {
      store.game.round++
      store.game.stage = 0
      store.game.hotseat++
      // roll the hotseat around
      if(store.game.hotseat >= store.players.length){
        store.game.hotseat = 0
      }
    },

    // remove quitter
    SOCKET_PLAYER_QUIT(store, data) {
      let index = 0
      store.players.forEach( (player, ind) => {
        if(player.userId === data.user.id){
          index = ind
        }
      })
      // remove player
      Vue.delete(store.players, index)

      if(store.players.length > 0){
        // set new host
        if(store.players[0].userId === store.user.id){
          store.game.host = true
        }
      }

      if(store.players.length >= store.game.hotseat){
        store.game.hotseat = store.players.length - 1
      }

    },

  },

  actions: {

    newGame({commit}, data){
      commit('START_GAME', { player: data, host: true, connected: false, synced: true })
      commit('PLAYER_JOINED', data)
    },

    joinGame({commit}, data){
      commit('START_GAME', { player: data, host: false, connected: false, synced: false })
    },

    activatePlayers({commit}){
      commit('ACTIVATE_PLAYERS')
    },

    incrementStage({commit}, data){
      commit('INCREMENT_STAGE', data)
    },

    quitGame({commit}){
      commit('QUIT_GAME', true)
    },

    endGame({commit}){
      commit('QUIT_GAME', false)
    },

    computeScores({commit, getters}){
      commit('COMPUTE_SCORES', getters.hotSeatPlayer)
    },

    socket_playerJoined({commit}, data){
      commit('PLAYER_JOINED', data)
      // commit('ACTIVATE_PLAYERS')
    },

  },
})
