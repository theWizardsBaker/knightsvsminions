<template>
  <div class="gameboard hero is-dark">
    <div class="hero-body">
      <div>
        <!-- main navigation and options menu -->
        <h3 class="subtitle has-text-centered help">game key</h3>
        <h3 class="title is-1 has-text-centered">{{gameKey}}</h3>
        <div class="paper">
          <div class="player-list">
            <div v-for="player, index in playerList">
              <h3 class="subtitle">
                <span class="help">{{index + 1}}. </span>
                {{player}}
              </h3>
            </div>
          </div>
          <!-- <img src="../assets/paper.png" /> -->
        </div>
        <div v-if="isHost && playerList.length > 4">
          <button class="button">
            Start Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {

  name: 'Lobby',

  components: {
  },


  data () {
    return {
      playerList: [
        "Hilma Quint",
        "Lillia Hirsh",
        "Louisa Higley",
        "Todd Keisler",
        "Angla Sweeten",
        "Rufus Stucker",
        "Nenita Mcelrath",
        "Madalene Romito",
        "Kimberely Mcduffie",
        "Lillia Hirsh",
        "Louisa Higley",
        "Todd Keisler",
        "Angla Sweeten",
        "Rufus Stucker",
        "Nenita Mcelrath",
        "Madalene Romito",
        "Kimberely Mcduffie",
        "Lillia Hirsh",
        "Louisa Higley",
        "Todd Keisler",
      ]
    }
  },

  computed: {
    ...mapGetters({
      gameKey: 'gameKey',
      players: 'players',
      isHost: 'isHost'
    }),
  },

}

</script>

<style scoped lang="scss">
  .gameboard {
    min-height: 100vh;
    .help {
      font-variant: small-caps;
    }

    .paper {
      position: relative;
      max-width: 600px;
      margin: auto;
      font-family: 'Kaushan Script', cursive;
      background-image: url('../assets/paper.png');
      background-repeat: no-repeat;
      background-attachment: local;
      background-position: top center;
      background-size: contain;
      padding: 50px;

      .player-list {
        height: 500px;
        overflow: auto;
        text-align: center;
        .subtitle{
          font-size: 2em;
          color: black;
        }
      }
      img {
        display: block;
        margin: auto;
        max-height: 900px;
      }
    }
  }
</style>
