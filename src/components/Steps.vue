<template>
  <div class="hero">
    <div class="hero-body">
      <h3 class="title is-2 has-text-centered is-spaced fancy-title drop-shadow">
        Grail Quests
      </h3>
      <h3 class="subtitle is-5 is-italic has-text-centered">
        3 successes - <span class="tag is-medium is-knight fancy drop-shadow">Knights</span> win
        <span class="spacer is-hidden-mobile">&nbsp</span> 
        <p class="is-hidden-desktop">
          <br/>
        </p>
        3 failures - <span class="tag is-medium is-minion fancy drop-shadow">Minions</span> win
      </h3>
      <div class="castle">
        <div class="columns is-multiline is-centered is-mobile">
          <div class="column is-auto-desktop is-4-tablet is-6-mobile" v-for="teamSize, index in teams" :key="index">
            <div class="token"
                 :class="{
                  'current-round': index === currentRound,
                  'is-knight': quests[index].success === true,
                  'is-minion': quests[index].success === false,
                  'is-neutral': quests[index].success == null,
                 }"
                 @click="selectTeam(index)">
              <div class="quest">&nbsp;Quest&nbsp;{{index + 1}}</div>
              <span class="player-count" v-if="quests[index].success === null">{{teamSize}}</span>
              <span class="player-count fancy drop-shadow" v-else>
                    {{quests[index].success ? 'K' : 'M'}}
              </span>
              <div class="players">Players</div>
              <span class="fails" v-if="index === 3">2 Fails Required*</span>
            </div>
            <br/>
            <div v-if="index === currentRound">
              <div class="isLeader has-text-centered leader" v-if="isLeader">
                <button class="button is-gold is-centered is-padded" @click="selectTeam(index)">
                  Select Team
                </button>
              </div>
              <div class="leader" v-else>
                <div class="tags has-addons are-medium is-centered">
                  <span class="tag is-black">&#128081;</span>
                  <span class="tag is-info">{{leader.name}}</span>
                </div>
              </div>
            </div>
            <div v-else-if="index < currentRound">
              <div class="leader">
                <div class="tags has-addons are-medium is-centered">
                  <span class="tag is-black">&#128081;</span>
                  <!-- old leader name -->
                  <span class="tag is-info">{{quests[index].leader.name}}</span>
                </div>
              </div>
            </div>
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
    currentRound: {
      type: Number,
      default: 0
    },
    teams: {
      type: Array,
      default() {
        return []
      }
    },
    leader: {
      type: Object,
      default() {
        return {}
      }
    },
    isLeader: {
      type: Boolean,
      default: true
    },
    quests: {
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
    let circleType = new CircleType(document.getElementsByClassName('fails')[0])
    circleType.radius(104).dir(-1)
  },

  data () {
    return {

    }
  },

  computed: {

  },

  methods: {

    selectTeam(round){
      if(this.isLeader){
        this.$emit('selectTeam')
      } else {
        if(this.currentRound < round){
          this.$emit('teamHistory')
        }
      }
    },

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

  .button.is-gold {
    font-weight: bold;
    font-size: .95em;
    background-color: #ffa502;
    border: 3px solid #ffa502;
    &:hover {
      background-color: #dad9d6;
      border: 3px solid #dad9d6;
    }
  }

  .button.is-padded {
    padding: 0px 20px;
  }

  .castle {

    .leader {
      padding: 10px 0;
    }

    .token {

      &.current-round {
        border: 2px inset #d35400;
        color: #ffa502;
        box-shadow: 0 0 15px #d35400;
        text-shadow: 0 0 15px #d35400;
      }


      border: 1px solid #00000073;
      border-radius: 50px;

      &.is-neutral {
        background-color: #80808061;
      }

      height: 100px;
      width: 100px;
      margin: auto;
      margin-top: 50px;
      margin-bottom: 30px;
      text-align: center;

      position: relative;


      .quest, .players, .fails {
        position: absolute;
        width: 70px;
        left: 13px;
      }

      .quest {
        top: -28px;
      }

      .players {
        bottom: -28px;
      }

      .fails {
        bottom: -50px;
        left: -3px;
        width: 100px;
      }

      .player-count {
        display: block;
        font-size: 4em;
        font-weight: bold;
      }
    }
  }

</style>