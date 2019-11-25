<template>
  <div class="box" :class="{ 'selectable': selectable }" @click="select">
    <div class="selection" v-show="isSelected">
      <span class="icon">
        <i class="fa fa-check-circle fa-3x"></i>
      </span>
    </div>
    <div class="answer-outline">
      <div class="content">
        <h3 class="title is-5 has-text-dark" v-show="revealed">
          <div v-if="isHotSeatPlayer">
            <span class="tag is-success is-medium">
              <span class="icon">
                <i class="fa fa-check">
                </i>
              </span>
              <span>{{name}}</span>
            </span>
          </div>
          <span v-if="!isHotSeatPlayer">
            {{name}}
          </span>
        </h3>
        <h3 class="title is-6 has-text-dark" v-show="!revealed">
          <span class="tag is-white">
            <i class="fa fa-question-circle fa-2x" aria-hidden="true"></i>
          </span>
        </h3>
        <span class="tag is-gold extraPoints is-medium" v-show="extraPoints && revealed">
          <span class="icon is-medium">
            <i class="fa fa-star fa-lg"></i>
          </span>
          <span>
            +2 Points
          </span>
        </span>

        <span class="tag is-success extraPoints is-medium" v-show="correct && revealed">
          <span class="icon is-medium">
            <i class="fa fa-star fa-lg"></i>
          </span>
          <span>
            Guessed HotSeat
          </span>
        </span>

        <slot name="text">
          <p>
           {{text}}
          </p>
        </slot>
      </div>
      <div class="answer-brand">
        answer
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'player-guess',

  props: [
    'name',
    'text',
    'revealed',
    'selectable',
    'isSelected',
    'isHotSeatPlayer',
    'extraPoints',
    'correct'
  ],

  data () {
    return {
    }
  },

  methods: {
    select(){
      if(this.selectable){
        this.$emit('selected')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .is-gold {
    background-color: #d4af37;
  }

  .box {
    position: relative;
    padding: 8px;
    width: 100%;

    .hotseat-player {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      position: absolute;
      border: 10px solid #23d160;
      border-radius: 5px;
      z-index: 200;
      opacity: .9
    }

    &.selectable:hover {
      cursor: pointer;
    }

    .selection {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: 3;

      background-color: #008000b0;
      color: white;

      text-align: center;

      border-radius: 5px;
      padding: 3em;
    }

    .answer-outline {

      .title {
        margin-bottom: 10px;
      }

      padding: 10px;
      border: 2px solid #B8ADAA;
      border-radius: 5px;
      position: relative;
      min-height: 130px;

      .extraPoints {
        position: absolute;
        top: -23px;
        right: -31px;
      }
    }

    .answer-brand {
      color: #B8ADAA;
      position: absolute;
      bottom: -5px;
      right: -5px;
      background-color: white;
      padding-right: 5px;
      padding-left: 5px;
      font-weight: bold;
      font-variant: small-caps;
    }
  }
</style>