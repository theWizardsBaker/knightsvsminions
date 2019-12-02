<template>
  <div class="gameboard hero is-dark">
    <div class="hero-body">
      <div>
        <!-- main navigation and options menu -->
        <h3 class="subtitle has-text-centered help">game key</h3>
        <h3 class="title is-1 has-text-centered">{{gameKey}}</h3>
        <player-list :players="players"/>
        <br/>
        <div>
          <div class="buttons is-centered" v-if="isHost && players.length">
            <button class="button is-success" @click="startGame">
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerList from '@/components/PlayerList.vue'
import { mapGetters } from 'vuex'

export default {

  name: 'Lobby',

  components: {
    PlayerList
  },

  data () {
    return {

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
    ...mapGetters([
      'gameKey',
      'players',
      'isHost',
      'inGame',
    ]),
  },

  methods: {

    startGame(){
      // emit to socket
      this.$socket.client.emit('begin_game', { gameKey: this.gameKey })
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
