<template>
  <div class="hero">
    <div class="hero-body">
      <h3 class="title is-2 has-text-centered is-spaced">
        Grail Quests
      </h3>
      <h3 class="subtitle is-5 is-italic has-text-centered">
        3 successes - Knights wins <span class="spacer">&nbsp</span> 3 failures - Minions win
      </h3>
      <br/>
      <div class="castle">
        <div class="columns">
          <div class="column" v-for="index in 5" :key="index">
            <div class="token">
              <div class="quest">&nbsp;Quest&nbsp;{{index}}</div>
              <span class="player-count">4</span>
              <div class="players">Players</div>
            </div>
            <div class="tags has-addons are-medium is-centered">
              <span class="tag is-black">&#128081;</span>
              <span class="tag is-info">?</span>
            </div>
            <br/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircleType from 'circletype';

export default {
  name: 'steps',

  props: {
    players: {
      type: Array,
      default() {
        return []
      }
    }
  },

  mounted(){
    // Instantiate `CircleType` with an HTML element.
    let quests = document.getElementsByClassName('quest')
    for(let i = 0; i < quests.length; i++){
      let circleType = new CircleType(quests[i])
      circleType.radius(80)
    }
    let players = document.getElementsByClassName('players')
    for(let i = 0; i < players.length; i++){
      let circleType = new CircleType(players[i])
      circleType.radius(70).dir(-1)
    }
    // const circleType = new CircleType(document.getElementsByClassName('quest')[0])
  },

  data () {
    return {
      circles: []
    }
  },

  methods: {
  }
}
</script>

<style scoped lang="scss">
  
  .title {
    margin: 20px 0px;
  }

  .spacer {
    width: 30px;
    display: inline-block;
  }

  .castle {

    .token {
      border: 1px solid #00000073;
      border-radius: 50px;
      background-color: #80808061;

      height: 100px;
      width: 100px;
      margin: auto;
      margin-bottom: 50px;
      text-align: center;

      position: relative;

      .quest, .players {
        position: absolute;
        width: 70px;
        left: 13px;
      }

      .quest {
        top: -25px;
      }

      .players {
        bottom: -25px;
      }

      .player-count {
        display: block;
        font-size: 4em;
      }
    }
  }

</style>