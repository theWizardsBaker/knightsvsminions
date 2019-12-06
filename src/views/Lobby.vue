<template>
  <div class="gameboard hero is-dark">
    <div class="hero-body">
      <div>
        <!-- main navigation and options menu -->
        <h3 class="subtitle has-text-centered is-italic help fancy-subtitle drop-shadow has-text-weight-bold">game key</h3>
        <h3 class="title is-1 has-text-centered fancy-title drop-shadow">{{gameKey}}</h3>
        <div class="is-centered has-text-centered fancy-subtitle drop-shadow">
          <span class="subtitle has-text-weight-bold">{{players.length}} / {{maxPlayers}} players</span>
        </div>
        <div v-if="isHost && players.length">
          <br/>
          <div class="buttons is-centered">
            <button class="button is-success" @click="startGame">
              Begin Game
            </button>
          </div>
        </div>
        <br/>
        <player-list :players="players"/>
        <br/>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerList from '@/components/PlayerList.vue'
import { mapGetters, mapState } from 'vuex'

export default {

  name: 'Lobby',

  components: {
    PlayerList
  },

  created(){
    if(!this.isHost){
      this.$socket.client.emit('request_game_state', { gameKey: this.gameKey })
    }
  },

  data () {
    return {
      alignments: [
        // good, evil
        [3, 2], // 5
        [4, 2], // 6
        [4, 3], // 7
        [5, 3], // 8
        [6, 3], // 9
        [6, 4], // 10
        [7, 4], // 11
        [7, 5], // 12
      ],
      roles: [
        {
          name: 'Knight',
          alignment: true,
          required: true,
          use: true,
        },
        {
          name: 'Minion',
          alignment: false,
          required: true,
          use: true
        }
      ],

      specialRoles: [
        {
          name: 'Merlin',
          alignment: true,
          required: true,
          use: true
        }
      ]
    }
  },

  watch: {
    inGame(val) {
      // if the user is in a game, navigate to the game
      if(val){
        this.playGame()
      }
    },
  },

  computed: {

    // get the states from the store
    ...mapState({
      minPlayers: ({game})=> game.minPlayers,
      maxPlayers: ({game})=> game.maxPlayers,
    }),

    ...mapGetters([
      'gameKey',
      'players',
      'isHost',
      'inGame',
    ]),

    assignments(){
      // return this.alignments[this.players.length - this.minPlayers]
      return this.alignments[6 - this.minPlayers]
    }
  },

  methods: {

    shuffle(array){
      // shuffle
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    },

    startGame(){
      // shuffle players
      let players = JSON.parse(JSON.stringify(this.players))
      players = players.concat([
        { userId: "Bob_820310300", name:"Bob", gameKey:this.gameKey },
        { userId: "Tim_82031000", name:"Tim", gameKey:this.gameKey },
        { userId: "Tiny_82031000", name:"Tiny", gameKey:this.gameKey },
        { userId: "Mike_82031000", name:"Mike", gameKey:this.gameKey },
        { userId: "Albert_82031000", name:"Albert", gameKey:this.gameKey }
      ])
      let assignments = JSON.parse(JSON.stringify(this.assignments))
      // shuffle to assign roles
      this.shuffle(players)
      console.log(players)
      let specialRoleCount = 0
      // and assign them to a player
      this.specialRoles.forEach((role, ind) => {
        if(role.use){
          this.$set(players[ind], 'role', role)
          assignments[+ !role.alignment] -= 1
          specialRoleCount++
        }
      })
      // set all normal roles
      for(let i = specialRoleCount; i < players.length; i++){
        this.$set(players[i], 'role', i <= assignments[0] ? this.roles[0] : this.roles[1])
      }
      // shuffle up all the players again
      this.shuffle(players)
      console.log(players)
      // emit to socket
      this.$socket.client.emit('begin_game', { gameKey: this.gameKey, players: players })
    },

    playGame(){
      this.$router.push({
        name: 'play',
        params: { gameKey: this.gameKey }
      })
    },

  }

}

</script>

<style scoped lang="scss">
  .gameboard {
    min-height: 100vh;
  }
</style>
