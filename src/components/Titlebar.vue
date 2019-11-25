<template>
  <nav class="navbar is-info is-fixed-bottom" role="navigation" aria-label="main navigation">
    <div class="navbar-start">
      <!-- navbar items -->
      <div class="navbar-item is-active">
        <h3 class="title is-marginless is-paddingless is-4 has-text-light">{{title}}</h3>
      </div>
      <div class="navbar-item">
        <h3 class="subtitle is-marginless is-paddingless is-5 has-text-light">{{text}}</h3>
      </div>
    </div>
    <div class="navbar-end">
      <div class="navbar-item continue-button"
           v-if="showButton">
          <div class="field is-grouped">
            <p class="control">
              <a class="button is-success"
                 :class="{ 'is-loading': loading }"
                 :disabled="loading"
                 @click="handleClick">
                <span>
                  {{button.text}}
                </span>
                <span class="icon">
                  <i class="fa fa-step-forward"></i>
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'titlebar',

  props: [
    'title',
    'text',
    'showButton',
    'button',
    'loading'
  ],

  data () {
    return {

    }
  },

  methods: {
    handleClick(){
      this.$emit('continue')
    }
  }
}
</script>

<style scoped lang="scss">
  .is-active {
    background-color: hsl(217, 71%, 53%);
    padding-right: 20px;
  }
  .navbar-end {
    .continue-button {
      padding: 0;
      .field {
        height: 100%;
        width: 100%;
        .control {
          width: 100%;
          .button {
            width: 100%;
            height: 100%;
            border-radius: 0px;
            padding: 20px 40px;
          }
        }
      }
    }
  }
</style>