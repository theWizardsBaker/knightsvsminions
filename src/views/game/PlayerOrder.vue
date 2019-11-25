<template>
  <article class="panel is-primary">
    <p class="panel-heading">
      Player Order
    </p>
    <a class="panel-block hoverable" v-for="player, index in players" @click="setOrder(player)">
      <span class="tag is-primary is-rounded">
        <template v-if="player.newOrder !== null">
          <b>{{player.newOrder + 1}}</b>
        </template>
        <template v-else>
          &nbsp;-&nbsp;
        </template>
      </span>
      <span class="name">{{player.name}}</span>
    </a>
    <div class="panel-block">
      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button" 
                  :class="{ 'is-disabled': !complete, 'is-success': complete }" 
                  :disabled="!complete"
                  @click="saveOrder">
            Save Order
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script>

export default {
  
  name: 'player-order',

  props: [
    'players'
  ],

  created(){
    this.players.forEach( player => {
      this.$set(player, 'newOrder', null)
    })
  },

  data () {
    return {
      currentOrder: 0
    }
  },

  computed: {
    complete(){
      return this.players.reduce((accum, player) => {
        return accum && player.newOrder !== null
      }, true)
    }
  },

  methods: {
    setOrder(player){
      if(player.newOrder === null){
        this.$set(player, 'newOrder', this.currentOrder)
        this.currentOrder++
      } else {
        let removedNumber = player.newOrder
        this.players.forEach(player => {
          if(player.newOrder && player.newOrder > removedNumber){
            player.newOrder --
          }
        })
        this.$set(player, 'newOrder', null)
        this.currentOrder--
      }
    },
    saveOrder(){
      // this.players.forEach(player => {
      //   this.$set(player, 'order', player.newOrder)
      // })
      let playerOrder = {}
      this.players.forEach((player) => {
        playerOrder[player.userId] = player.newOrder
      })
      this.$emit('complete')
      this.$emit('playerOrder', playerOrder)
    }
  }
}
</script>

<style scoped lang="scss">
.panel {
  margin: 0 4em;
  .panel-block {
    background-color: white;
    .field {
      width: 100%;
    }
    &.hoverable:hover {
      background-color: lightgrey;
    }
    .tag {
      margin-right: 30px;
    }
  }
}

</style>
