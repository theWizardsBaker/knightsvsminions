<template>
  <div class="hero">
    <div class="hero-body">
      <h3 class="title is-2 has-text-centered is-spaced fancy-title drop-shadow">
        Rejected Teams
      </h3>
      <h3 class="subtitle is-5 has-text-centered is-italic">
        5 rejected teams - <span class="tag is-medium is-minion fancy drop-shadow">Minions</span> win
      </h3>
      <br/>
      <br/>
      <div class="container">
        <div class="columns">
          <div class="column is-centered">
            <div class="votes">
              <div class="columns is-multiline is-mobile is-centered">
                <div class="column is-narrow" v-for="index in 5" :key="index">
                  <div class="token" :class="[ !!rejected[index - 1] ? 'is-minion' : 'is-neutral' ]">
                    <span class="quest">Quest</span>
                    <span class="player-count fancy drop-shadow" v-if="!!rejected[index - 1]">M</span>
                  </div>
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
  name: 'votes',

  props: {
    rejected: {
      type: Array,
      default() {
        return []
      }
    },

  },

  mounted(){
    // Instantiate `CircleType` with an HTML element.
    let quests = document.getElementsByClassName('quest')
    for(let i = 0; i < quests.length; i++){
      let circleType = new CircleType(quests[i])
      circleType.radius(80)
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

  .votes {

    .token {
      border: 1px solid #00000073;
      border-radius: 50px;

      &.is-neutral {
        background-color: #80808061;
      }


      height: 60px;
      width: 60px;
      margin: auto;
      margin-bottom: 50px;
      text-align: center;

      position: relative;

      &.is-rejected {
        background-color: #b62525;
      }

      .quest {
        font-size: .8em;
        position: absolute;
        width: 70px;
        left: -7px;
        top: -25px;
      }

      .player-count {
        display: block;
        font-size: 2em;
        margin-top: 4px;
      }
    }
  }

</style>