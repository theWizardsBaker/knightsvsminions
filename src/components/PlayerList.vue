<template>
  <div class="paper">
    <div class="player-list">
      <div v-for="player, index in players">
        <h3 class="subtitle">
          <span class="help">{{index + 1}}. </span>
          {{player.name}}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
  name: 'playerlist',

  props: {
    'players': Array,
    'hotSeatPlayer': {
      type: Object,
      default(){
        return { userId: '' }
      }
    },
    'fullHeight': {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
    }
  }

}
</script>

<style scoped lang="scss">
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

    .help {
      font-variant: small-caps;
    }
    .player-list {
      height: 500px;
      overflow: auto;
      text-align: center;
      .help {
        display: inline-block;
      }
      .subtitle{
        font-size: 2em;
        color: rgba(60, 74, 133, 1);
      }
    }
    img {
      display: block;
      margin: auto;
      max-height: 900px;
    }
  }
</style>