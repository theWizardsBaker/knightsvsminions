<template>
<nav class="panel" :class="{ 'full-height': fullHeight }">
  <div class="panel-block">
    <div class="panel-row">
      <div class="panel-section heading">
        Hot Seat
      </div>
      <div class="panel-section heading">
        Player
      </div>
      <div class="panel-section heading">
        Score
      </div>
      <div class="panel-section heading">
        Round Points
      </div>
    </div>
    <template v-for="player in players">
      <div class="panel-row" :class="{ 'has-hotseat': player.hotseat }">
        <div class="panel-section hotseat">
            <span class="icon is-large has-text-danger" v-show="player.userId === hotSeatPlayer.userId">
              <i class="fa fa-fire fa-lg"></i>
            </span>
        
              <!--           <span class="hot-seat-marker" v-show="player.hotseat">
                          &#128293;
                        </span>
               -->        
        </div>
        <div class="panel-section">
          {{player.name}}
        </div>
        <div class="panel-section">
          <span>
            {{player.score}}
          </span>
        </div>
        <div class="panel-section">
          <span class="tag is-success is-small score-change" v-show="player.scoreChange > 0">
            <span class="icon is-medium has-text-white">
              <i class="fa fa-plus fa-sm"></i>
            </span>
            <span>
             <b>{{player.scoreChange}}</b>
            </span>
          </span>
        </div>
      </div>
    </template>
  </div>
</nav>
</template>

<script>
export default {
  
  name: 'scoreboard',

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
.panel {
  background-color: white;

  &.full-height {
    min-height: 100vh;
    height: 100%;
  }

  .panel-block {
    display: table;
    width: 100%;
    margin: 0px;
    padding: 0px;

    .panel-row {
      display: table-row;

      & + .has-hotseat {
        background-color: lightgrey;
      }

      .panel-section {
        text-align: center;
        align-items: center;
        color: #363636;
        display: flex;
        justify-content: flex-start;
        padding: .5em .75em;
        display: table-cell;

        &.heading {
            background-color: #f5f5f5;
            font-weight: bold;
        }
      }

      &:not(:last-child) .panel-section {
        border-bottom: 1px solid #dbdbdb;
      }

    }

  }


  .panel-block, .panel-heading, .panel-tabs {
      border-bottom: 1px solid #dbdbdb;
      border-left: 1px solid #dbdbdb;
      border-right: 1px solid #dbdbdb;
  }
}

.score-change {
  padding: 0px 10px 0px 15px;
  line-height: .7em;
  i {
    font-size: .8em;
  }
  b {
    font-size: 1.2em;
  }
}
.hotseat {
  text-align: center; 
  .hot-seat-marker {
    font-size: 1em;
    margin: auto;
  }
}

.section {
  padding: 20px
}
</style>