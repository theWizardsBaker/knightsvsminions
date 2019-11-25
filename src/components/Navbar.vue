<template>
  <nav class="navbar"
       :class="[ inHotSeat ? 'is-danger' : 'is-black' ]"
       role="navigation"
       aria-label="main navigation">

    <div class="navbar-start">
      <!-- navbar items -->
      <div class="navbar-item">
        <p class="small-text">game</p>
        <h3 class="title is-3">{{game}}</h3>
      </div>
    </div>

    <div class="navbar-center is-hidden-mobile">
      <div class="navbar-item">
        <h3 class="title is-marginless is-paddingless is-4 has-text-light">{{name}}</h3>
      </div>
      <div class="navbar-item">
        <span class="tag is-success is-medium is-rounded">
          <b>{{score}} pts</b>
        </span>
      </div>
    </div>

    <div class="navbar-end">
      <!-- navbar items -->
      <div class="navbar-item">
        <slot name="bar-end"></slot>
      </div>
    </div>

    <div class="break is-hidden-tablet">
    </div>

    <div class="navbar-second-row is-hidden-tablet">
      <div class="navbar-item">
        <h3 class="title is-marginless is-paddingless is-4 has-text-light">{{name}}</h3>
      </div>
      <div class="navbar-item">
        <span class="tag is-success is-medium is-rounded">
          <b>{{score}} pts</b>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',

  props: [
    'game',
    'name',
    'score',
    'showScoreBoard',
    'inHotSeat'
  ],

  data () {
    return {

    }
  },

  methods: {
    emitOptions(){
      this.$emit('options')
    }
  }
}
</script>

<style scoped lang="scss">

  .small-text {
    font-variant: small-caps;
    display: block;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    font-weight: bold;
    line-height: 5;
    margin-right: 10px;
  }

  .title {
    line-height: 2;
  }

  @media screen and (min-width: 100px){


    .navbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .navbar-center {
        display: inline-flex;
      }

      .navbar-end {
          display: inline-flex;
          padding-right: 10px;
      }

      .navbar-start, .navbar-item {
        display: inline-flex;
        .title {
          line-height: 2;
        }
      }

      .break {
        flex-basis: 100%;
        height: 0px;
      }

      .navbar-second-row {
        margin: auto;
      }
    }

  }

</style>