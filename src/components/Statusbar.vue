<template>
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
    <div class="navbar-start">
      <!-- navbar items -->
      <div class="navbar-item">
        <h3 class="title is-marginless is-paddingless is-4 has-text-light">{{game}}</h3>
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
        <a class="button is-info">
          <span class="icon is-large">
            <i class="fa fa-times fa-lg"></i>
          </span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'statusbar',

  props: [
    'game',
    'score'
  ],

  data () {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
  @media screen and (min-width: 100px){

    .navbar {
      justify-content: space-between;
      .navbar-end {
          float:right
      }

      .navbar-start, .navbar-item {
        display: inline-flex;
        .title {
          line-height: inherit;
        }
      }
    }

  }

</style>