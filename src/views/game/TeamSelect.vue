<template>
  <div class="panel is-primary">
    <p class="panel-heading has-text-weight-bold has-text-centered">
      Select {{playerCount}} Players
    </p>
    <a class="panel-block is-link"
       v-for="player in players"
       @click="selectPlayer(player)"
       :diabled="submitted || teamSelected">
      <span class="panel-icon">
        <i :class="[ 'fa', player.selected ? 'fa-check-square' : 'fa-square-o' ]"></i>
      </span>
      {{player.name}}
    </a>
    <a class="panel-block">
      <button class="button is-fullwidth"
              :class="{ 'is-success': !submitted, 'is-loading' : submitted }"
              :disabled="submitted || !teamSelected"
              @click="sendSelections"
              >
        Create Team
      </button>
    </a>
  </div>
</template>

<script>

export default {

  name: 'TeamSelect',

  props: {
    players: {
      type: Array,
      default: () => []
    },
    playerCount: {
      type: Number,
      default: 0
    },
    submitted: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    teamSelected(){
      return this.playerCount === this.players.filter(player => player.selected).length
    },
  },

  methods: {
    selectPlayer(player){
      if(player.selected || !this.teamSelected){
        this.$emit('teamMemberSelected', player)
      }
    },
    sendSelections(){
      this.$emit('selectTeam')
    }
  },

}
</script>

<style scoped lang="scss">
  .panel {
    background-color: white;
    border-radius: 5px;
    color: black;
    .panel-block.is-link {
      color: black;
    }
  }
</style>
