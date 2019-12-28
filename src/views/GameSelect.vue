<template>
  <div class="hero is-dark is-medium">
  	<div class="hero-body">
  		<h4 class="fancy-title title is-1 has-text-centered drop-shadow ">
  			Knights <span class="small">vs</span> Minions
  		</h4>
  		<h4 class="fancy-subtitle subtitle is-4 has-text-centered drop-shadow">
  			Start a new game or enter a game key to join another player's game
  		</h4>
	  	<div class="columns is-mobile is-3 is-centered is-multiline">
	  		<div class="column is-narrow-mobile is-narrow-tablet"
	  				 :key="option.name"
	  				 v-for="option in gameOptions"
	  				 >
			  	<card :display="option.display">

			  		<template #title>
              <span class="tag is-medium is-knight fancy drop-shadow" 
                    v-if="option.type === 'knight'">
                {{option.name}}
              </span>
              <span class="tag is-medium is-minion fancy drop-shadow"
                    v-if="option.type === 'minion'">
                {{option.name}}
              </span>
			  			<!-- <span class="title is-4 has-text-black"></span> -->
			  		</template>

			  		<template #content>
			  			<!-- {{option.text}} -->
			  		</template>

			  		<template #footer>
			  			<div class="field" v-if="option.hasOwnProperty('userName')">
			  				<label class="label help">Name</label>
							  <div class="control">
					  			<input type="text"
					  						 name="room"
					  						 v-model="option.userName"
					  						 class="input"
					  						 length="25"
					  						 :disabled="gameSelected"
					  						 :class="{ 'is-danger': option.error }"
					  						 />
	  						</div>
	  					</div>
	  					<div class="field" v-if="!!option.hasOwnProperty('gameKey')">
			  				<label class="label help">Game Key</label>
							  <div class="control">
					  			<input type="text"
					  						 name="room"
					  						 v-model="option.gameKey"
					  						 class="input"
					  						 :disabled="gameSelected"
					  						 :class="{ 'is-danger': option.error }"
					  						 length="10"
					  						 hint="game key"
					  						 />
	  						</div>
	  					</div>


	  					<div class="field">
	  						<div class="control">
					  			<button class="button is-fullwidth"
					  							:disabled="gameSelected"
					  							@click="handleSelection(option)">
					  				{{option.action | capitalize}} Game
					  			</button>
					  		</div>
					  	</div>

			  		</template>

			  	</card>
		  	</div>
	  	</div>
	  	<div class="">
	  		<h3 class="title is-4 has-text-danger has-text-centered">
	  			{{errorMessage}}
	  		</h3>
	  	</div>
      <footer class="has-text-centered fancy">
        <br/>
        <h4 class="subtitle is-3">Beta</h4>
        <h4 class="subtitle is-6">(This probably won't work well)</h4>
      </footer>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'
import { mapGetters } from 'vuex'

export default {

  name: 'GameSelect',

  components: {
  	Card,
  },

  mounted() {
    // set up a nice delay in card flips
  	for(let i = 0; i < this.gameOptions.length; i++){
	  	this.delay(1100 + (i * 300)).then(() => {
		  	this.$set(this.gameOptions[i], 'display', true)
	  	})
  	}

  },

  data () {
    return {
    	gameSelected: false,
    	errorMessage: '',
      gameOptions: [
        {
          name: 'Host Game',
          action: 'create',
          text: 'Create a new game.',
          error: false,
          display: false,
		    	userName: '',
          type: 'knight'
        },
        {
          name: 'Join Game',
          action: 'join',
          text: 'Join another user\'s game.',
          error: false,
          display: false,
        	gameKey: '',
		    	userName: '',
          type: 'minion'
        },
      ]
    }
  },

  watch: {

    gameKey(val){
      // if the user is in a game, navigate to the game
      if(val){
        this.playGame()
      }
    },

  },

  computed: {

    ...mapGetters([
      'gameKey',
    ]),

    // find the selected option
  	selectedOption(){
      return this.gameOptions.find((opt) => opt.selected)
    }
  },

  methods: {

  	handleSelection(option){
      // reset our errors
  		this.errorMessage = ''
			option.error = false
      // check user name is filled
  		if( option.hasOwnProperty('userName') ) {
  			option.error = option.userName == "" || option.userName.length == 0
  		}
      // check game key is filled
  		if( option.hasOwnProperty('gameKey') ) {
  			option.error = option.error || (option.gameKey == "" || option.gameKey.length == 0)
  		}
      // if we're error free
  		if(!option.error){
  			// triger the game has been selected
	  		this.gameSelected = true
	  		// select this option as the one selected
	  		option.selected = true
  			// this[option.action + 'Game']()
  			// get our options
  			let data = {
          userId: null,
          name: option.userName,
          gameKey: option.gameKey,
        }
  			// what action we'll send to the socket
  			let action = option.action === 'create' ? 'create_game' : 'join_game'
  			// emit to socket
		  	this.$socket.client.emit(action, data, (response) => {
          // if there was an error, show it
          if(response.error){
            this.showError(response.data.message)
          } else {

            // add the new elements
            data.userId = response.data.userId
            data.gameKey = response.data.gameKey
            // create the new game
            this.$store.dispatch(option.action === 'create' ? 'newGame' : 'joinGame', data)
          }
        })
  		}
  	},

    playGame(){
      this.$router.push({
        name: 'lobby',
        params: { gameKey: this.gameKey }
      })
    },

    showError(message){
      this.selectedOption.error = true
      this.selectedOption.selected = false
      this.errorMessage = message
      this.gameSelected = false
    },

  }
}
</script>

<style scoped lang="scss">
  .hero {
		min-height: 100vh;

    .small {
      font-size: .7em;
    }

  	.spacer {
  		height: 80px;
  	}

    footer {
    }
  }
</style>
