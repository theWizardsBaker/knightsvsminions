<template>
  <div class="gameboard hero is-dark">
    <!-- main navigation and options menu -->
    <navbar :name="player.name"
            :leader="isLeader"
            >
      <template #bar-end>
        <div class="buttons">
          <button class="button is-medium"
                  :class="{ 'is-light': popup.show, 'is-dark': !popup.show }"
                  @click="openMenu()">
            <span class="icon">
              <i class="fa fa-gear" aria-hidden="true"></i>
            </span>
          </button>
        </div>
      </template>
    </navbar>

    <!-- pop up helper -->
    <popup :display="popup.show" @close="popupClose" :closeable="popup.closeable">
      <!-- <div style="position: absolute; left: 0">{{currentQuest}}</div> -->
      <!-- options menu -->
      <option-menu :options="game.options"
                   @optionClick="handleOptionClick"
                   v-if="popup.showMenu">
        <template #title>Options</template>
      </option-menu>
      <div v-else-if="display.endgame" class="container has-text-centered">
        <h3 class="title is-1 fancy-title has-text-centered" v-if="game.minionWins > game.knightWins">
          Minions Win!
        </h3>
        <div v-else>
          <h3 class="title is-1 fancy-title has-text-centered">
            Knights Win!
          </h3>
          <h3 class="title is-5 tag is-black has-text-centered">
            However,
            <br/>
            If Minions can guess Merlin, they win...
          </h3>
        </div>
      </div>
      <div class="section" v-else-if="popup.allegiance">
        <div class="is-centered has-text-centered container" 
             @mousedown="display.allegiance = true" 
             @mouseup="display.allegiance = false">
          <h3 class="title is-4 tag is-black">Press and Hold to Flip</h3>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow">
              <card :display="display.allegiance">
                <template #title>
                  <span class="tag is-medium is-knight fancy drop-shadow" v-if="allegiance">{{role.name}}</span>
                  <span class="tag is-medium is-minion fancy drop-shadow" v-else>{{role.name}}</span>
                </template>
                <template #content>
                  <p class="fancy" v-if="allegiance">
                    Loyal to the Round Table
                  </p>
                  <p class="fancy" v-else>
                    Disloyal to the Round Table
                  </p>
                  <div v-if="!allegiance || role.name === 'Merlin'">
                    <br/>
                    <div class="cohorts" v-if="role.name === 'Merlin'">Minions</div>
                    <div class="cohorts" v-else>cohorts</div>
                    <ul class="minion-list">
                      <li v-for="minion in minions">
                        <span class="fancy">{{minion.name}}</span>
                      </li>
                    </ul>
                  </div>
                </template>
              </card>
            </div>
          </div>
        </div>
      </div>
      <div class="section" v-else-if="popup.selectTeam">
        <article class="panel is-primary">
          <p class="panel-heading has-text-weight-bold has-text-centered">
            Select {{teamSize[game.round]}} Players
          </p>
          <a class="panel-block is-link"
             v-for="player in players"
             @click="selectPlayer(player)"
             :diabled="!teamSelection">
            <span class="panel-icon">
              <i class="fa"
                 aria-hidden="true"
                 :class="[ player.selected ? 'fa-check-square' : 'fa-square-o' ]"
                 >
              </i>
            </span>
            {{player.name}}
          </a>
          <a class="panel-block">
            <button class="button is-fullwidth"
                    :class="{ 'is-success': teamSelection, 'is-loading' : game.submittedSelections }"
                    :disabled="!teamSelection || game.submittedSelections"
                    @click="sendSelections"
                    >
              Create Team
            </button>
          </a>
        </article>
      </div>
      <div class="section" v-else-if="popup.vote">
        <div class="player-list-vote">
          <player-list :players="currentQuest.team">
            <h3 class="title is-2 has-text-centered has-text-black">
              &#128081; {{leader.name}}
            </h3>
            <h3 class="subtitle is-4 has-text-centered has-text-black quest-vote-list">
              Quest {{game.round + 1}}
            </h3>
          </player-list>
        </div>
        <br/>
        <!-- v-if="!isLeader" -->
        <div class="columns is-centered is-mobile" >
          <div class="column has-text-centered is-3-desktop is-5-mobile">
            <button class="button is-danger is-large"
                    :class="{ 'is-disabled': !display.vote }"
                    :disabled="!display.vote"
                    @click="vote(false)">
              <span class="icon">
                <i class="fa fa-close" aria-hidden="true"></i>
              </span>
              <span>Reject</span>
            </button>
          </div>
          <div class="column has-text-centered is-3-desktop is-5-mobile">
            <button class="button is-large is-success"
                    :class="{ 'is-disabled': !display.vote }"
                    :disabled="!display.vote"
                    @click="vote(true)">
              <span class="icon">
                <i class="fa fa-check" aria-hidden="true"></i>
              </span>
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
      <div class="section" v-else-if="popup.votereveal">
        <h3 class="title is-2 fancy has-text-centered"
            :class="[this.currentQuest.reject ? 'has-text-danger' : 'has-text-success']"
            :style="{visibility: (this.currentQuest.reject === true || this.currentQuest.reject === false) ? 'visible' : 'hidden'}">
          {{!!this.currentQuest.reject ? 'Rejected' : 'Approved'}}
        </h3>
        <div class="columns is-multiline is-mobile">
          <div class="column is-3-desktop is-4-mobile" v-for="vote in currentQuest.vote">
            <vote-card :display="vote.display">
              <div class="token has-text-centered" >
                <span class="icon is-large">
                  <span class="fa-stack fa-2x">
                    <i class="fa fa-circle fa-stack-2x"
                       :class="[vote.vote ? 'has-text-success' : 'has-text-danger']"></i>
                    <i class="fa fa-stack-1x has-text-white"
                       :class="[vote.vote ? 'fa-check' : 'fa-close']"></i>
                  </span>
                </span>
                <br/>
                <span class="has-text-weight-bold">{{vote.vote ? 'Approve' : 'Reject'}}</span>
              </div>
            </vote-card>
          </div>
        </div>
        <!-- v-if="!isLeader" -->
        <div class="has-text-centered" >
          <button class="button is-medium" 
                  :style="{
                    visibility: (display.picks && (this.currentQuest.reject === true || this.currentQuest.reject === false)) ? 'visible' : 'hidden' }"
                  @click="voteTally()">
            Continue
          </button>
        </div>
        <!-- v-if="!isLeader" -->
        <div class="has-text-centered" >
          <button class="button is-medium" :style="{ visibility: !display.revealing  ? 'visible' : 'hidden' }" @click="revealPicks()">
            Reveal Votes
          </button>
        </div>
      </div>
      <div class="section" v-else-if="popup.quest">
        <div v-if="onQuest">
          <h3 class="title is-3 fancy-title has-text-centered">
            Quest Success
          </h3>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow" v-for="decision in ['success', 'fail']">
              <card :display="game.quest === decision || game.quest === null" 
                    :select="true" 
                    :selected="game.quest === decision"
                    @selected="game.quest = decision">
                <template #title>
                  <span class="tag is-medium fancy drop-shadow" 
                        :class="[decision === 'success' ? 'is-success' : 'is-danger' ]">
                    <template v-if="decision === 'success'">
                      Success
                    </template>
                    <template v-else>
                      Fail
                    </template>
                  </span>
                </template>
                <template #content>
                  <div>
                    <img v-if="decision === 'success'"
                         class="image"
                         src="../assets/grail-cup-success.png" />
                    <img v-else
                         class="image"
                         src="../assets/grail-cup-fail.png" />
                  </div>
                </template>
              </card>
            </div>
          </div>
          <div class="has-text-centered">
            <button class="button is-medium"
                    :class="{ disabled: game.quest === null }"
                    :disabled="game.quest === null"
                    v-show="!display.quest"
                    @click="saveQuestOutcome()">
              Continue
            </button>
          </div>
        </div>
        <div v-else>
          <h3 class="title is-3 fancy-title has-text-centered">
            Quest in Progress
          </h3>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow" v-for="team, index in currentQuest.team">
              <card :display="false" />
            </div>
          </div>
        </div>
      </div>
      <div class="section" v-else-if="popup.questResults">
        <h3 class="title is-3 fancy-title has-text-centered">
          Quest Result
        </h3>
        <div class="columns is-centered is-mobile">
          <div class="column is-narrow" v-for="result, index in currentQuest.results">
            <card :display="result.reveal">
                <template #title>
                  <span class="tag is-medium fancy drop-shadow"
                        :class="[result.success ? 'is-success' : 'is-danger' ]">
                    {{ result.success ? 'Success' : 'Fail' }}
                  </span>
                </template>
                <template #content>
                  <div>
                    <img v-if="result.success"
                         class="image"
                         src="../assets/grail-cup-success.png" />
                    <img v-else
                         class="image"
                         src="../assets/grail-cup-fail.png" />
                  </div>
                </template>
              </card>
          </div>
        </div>
        <div class="has-text-centered" v-if="!isLeader">
          <button class="button is-medium"
                  :style="{ visibility: display.questResults  ? 'visible' : 'hidden' }"
                  v-show="!display.questEnd"
                  @click="revealQuest()">
            Reveal Quest
          </button>
          <button class="button is-medium"
                   v-show="display.questEnd"
                  :style="{ visibility: display.questEnd  ? 'visible' : 'hidden' }"
                  @click="questResults()">
            Continue
          </button>
        </div>
      </div>
    </popup>


    <div class="game">
      <div class="game-display">
        <div class="columns">
          <div class="column" >
            <steps :leader="leader"
                   :teams="teamSize"
                   :currentRound="game.round"
                   :quests="game.quests"
                   @selectTeam="selectTeam"
                   @teamHistory="teamHistory"
                   />
            <votes :rejected="currentQuest.rejected"/>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import Popup from '@/components/Popup'
import Navbar from '@/components/Navbar'
import Titlebar from '@/components/Titlebar'
import OptionMenu from '@/components/OptionMenu'
import ConfirmBox from '@/components/ConfirmBox'
import Steps from '@/components/Steps'
import Votes from '@/components/Votes'
import PlayerList from '@/components/PlayerList'
import Card from '@/components/Card'
import VoteCard from '@/components/VoteCard'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {

  name: 'Play',

  components: {
    Card,
  	Navbar,
    Popup,
    Titlebar,
    OptionMenu,
    ConfirmBox,
    Steps,
    PlayerList,
    Votes,
    VoteCard,
  },

  created(){
    window.addEventListener('beforeunload', this.leaving)
    document.addEventListener('keyup', (event) => {
        if (event.keyCode === 27) {
            // this.popup.show = false;
            this.popupClose()
        }
    });
    this.popup.show = true
    this.popup.allegiance = true
  },

  beforeDestroy(){
    window.removeEventListener('beforeunload', this.leaving)
    document.removeEventListener('keyup', (event) => {
        if (event.keyCode === 27) {
            this.popup.show = false;
        }
    });
  },

  data () {
    return {

      display: {
        endgame: false,
        allegiance: false,
        vote: false,
        picks: false,
        voteResults: false,
        revealing: false,
        quest: false,
        questResults: false,
      },

      popup: {
        show: true,
        showMenu: false,
        allegiance: true,
        selectTeam: false,
        vote: false,
        votereveal: false,
        closeable: true,
        quest: false,
        questResults: false,
        questEnd: false,
      },

      game: {

        round: 0,

        stage: 0,

        knightWins: 0,

        minionWins: 0,

        quest: null,

        quests: [
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          }
        ],

        submittedSelections: false,

        questTeamSize: [
          [2,3,2,3,3], //5 players
          [2,3,4,3,4], //6
          [2,3,3,4,4], //7
          [3,4,4,5,5], //8
          [3,4,4,5,5], //9
          [3,4,4,5,5], //10
          [4,5,5,6,6], //11
          [4,5,5,6,6], //12
        ],

        stages: [
          {
            name: 'selectTeam',
            directions: {
              title: "Select",
              text: "The Leader selects a team"
            },
            display: {
              revealing: false,
              questEnd: false,
              popup: {
                show: false,
                allegiance: false,
                closeable: true
              }
            },
          },
          {
            name: 'vote',
            directions: {
              title: "Vote",
              text: "Approve or Reject the Leader's team"
            },
            display: {
              vote: true,
              popup: {
                selectTeam: false,
                allegiance: false,
                vote: true,
                closeable: false
              }
            },
          },
          {
            name: 'reveal-vote',
            directions: {
              title: "Results",
              text: "Results of the vote"
            },
            display: {
              revealing: false,
              vote: false,
              popup: {
                vote: false,
                votereveal: true
              }
            }
          },
          {
            name: 'quest',
            directions: {
              title: "Quest",
              text: "The team embarks on the quest",
            },
            display: {
              popup: {
                quest: true,
                votereveal: false
              }
            },
          },
          {
            name: 'reveal-quest',
            directions: {
              title: "Quest Reveal",
              text: "Results of the quest",
            },
            display: {
              quest: false,
              questResults: true,
              popup: {
                quest: false,
                questResults: true
              }
            },
          },
          {
            name: 'quest-tally',
            directions: {
              title: "Score",
              text: "Results of the quest",
            },
            display: {
              questEnd: false,
              popup: {
                questResults: false,
                show: false
              }
            },
          },
          // {
          //   name: 'score',
          //   directions: {
          //     title: "Score",
          //     text: "Recieve points for your answer"
          //   },
          //   display: {

          //   }
          // }
        ],

        options: [
          {
            text: 'Game Rules',
            icon: 'fa-book',
            action: 'scoring',
          },
          {
            text: 'Check Allegiance',
            icon: 'fa-user',
            action: 'allegiance',
          }
        ],

      }
    }
  },

  watch: {

    currentStage(){
      this.setDisplay()
    },

    connected: {
      immediate: true,
      handler(val){
        if(!val){
          this.$router.replace({ path: '/' })
        }
      }
    },

    'currentQuest.vote'(val, oldVal) {
      if(val.length === 1 && this.popup.vote){
        // add fake votes for testing
        val.push({ player: 'gil_123', vote: true})
        val.push({ player: 'gil_123', vote: false})
        val.push({ player: 'gil_123', vote: false})
        this.advanceStage()
      }
    },


    'currentQuest.results'(val) {
      try {
        if(val.length === 1){
          this.advanceStage()
        }
        if(val.length === this.teamSize[this.game.round]){
          this.advanceStage()
        }
      } catch(e){
        console.log(val, this.teamSize[this.game.round])
      }
    }

  },

  computed: {

    // get the states from the store
    ...mapState({
      minPlayers: ({game})=> game.minPlayers,
      maxPlayers: ({game})=> game.maxPlayers,
    }),

    ...mapGetters([
      'isHost',
      'player',
      'leader',
      'gameKey',
      'players',
      'isLeader',
      'connected',
      'allegiance',
      'role',
    ]),

    playerInfo(){
      if(!!this.player){
        return {
          name: this.player.name,
          userId: this.player.userId
        }
      }
    },

    currentStage(){
      return this.game.stages[this.game.stage]
    },

    minions() {
      return this.players.filter(player => !player.role.alignment)
    },

    knights() {
      return this.players.filter(player => player.role.alignment)
    },

    teamSize() {
      return this.game.questTeamSize[this.players.length - this.minPlayers]
    },

    teamSelection(){
      return this.teamSize[this.game.round] === this.players.filter(player => player.selected).length
    },

    currentQuest(){
      return this.game.quests[this.game.round]
    },

    onQuest(){
      return true
    },

    isEndGame(){
      let endGame = false
      // if minions won by rejection
      if(this.currentQuest.rejected.length === 5){
        endGame = true
      }
      // if one team won by votes
      if(this.knightWins >= 3 || this.minionWins >= 3){
        endGame = true
      }

      return endGame
    },
  },

  sockets: {

    team_selected(data){
      this.$set(this.currentQuest, 'leader', JSON.parse(JSON.stringify(this.leader)))
      this.$set(this.currentQuest, 'team', data.team)
      this.advanceStage()
    },

    player_vote(data){
      this.$set(this.currentQuest.vote, this.currentQuest.vote.length, {
        player: data.player,
        vote: data.decision
      })
    },

    picks_revealed(){
      // set up a nice delay in card flips
      for(let i = 0; i < this.currentQuest.vote.length; i++){
        this.delay(200 + (i * 800)).then(() => {
          this.$set(this.currentQuest.vote[i], 'display', true)
        })
      }
      // delay the result
      this.delay(200 + (this.currentQuest.vote.length * 1000)).then(() => {
        // do this for the leader
        this.display.picks = true
        this.tallyVoteResutls()
      })
    },

    team_vote(data){
      if(data.rejected){
        this.currentQuest.rejected.push({
          leader: this.leader,
          team: this.currentQuest.team,
        })
        let reject = JSON.parse(JSON.stringify(this.currentQuest.rejected))
        // reset
        this.startRound()
        // add the rejected
        this.currentQuest.rejected = reject
        // reset stage
        this.advanceStage(1, true)
      } else {
        // move forward with the mission
        this.advanceStage()
      }
    },

    quest_outcome(data){
      this.currentQuest.results.push({
        success: data.quest === 'success',
        reveal: false
      })
    },

    quest_reveal(data){
      // delay the result
      for(let i = 0; i < this.currentQuest.results.length; i++){
        this.delay(200 + (i * 800)).then(() => {
          this.$set(this.currentQuest.results[i], 'reveal', true)
        })
      }
      this.display.questResults = false
      this.display.questEnd = true
    },

  },

  methods: {

    ...mapActions([
      'incrementRound',
      'nextLeader'
    ]),

    questResults(){
      let questSuccess = this.currentQuest.results.reduce((total, result) => {
        return (total && result.success)
      }, true)
      this.$set(this.currentQuest, 'success', questSuccess)
      this.advanceStage(1, true)
    },

    revealQuest(){
      this.$socket.client.emit('reveal_quest', {
        gameKey: this.gameKey
      })
    },

    saveQuestOutcome(){
      // emit to socket
      this.$socket.client.emit('submit_quest', {
        gameKey: this.gameKey,
        quest: this.game.quest
      })
      this.display.quest = true
    },

    teamHistory(){

    },

    startRound(){
      if(this.isEndGame){
        this.display.endgame = true 
        this.popup.show = true
        this.popup.closeable = false
      } else {
        // reset the quests
        this.$set(this.game.quests, this.game.round, {
          team: [],
          rejected: [],
          vote: [],
          results: [],
          success: null,
          reject: null
        })
        // restart submittingSelections
        this.game.submittedSelections = false
        // remove the quest
        this.game.quest = null
        // next leader
        this.nextLeader()
      }
    },

    setDisplay(){
      // hide all display elements
      for (const [key, value] of Object.entries(this.currentStage.display)) {
        if(key === 'popup'){
          for (const [popup_key, popup_value] of Object.entries(this.currentStage.display.popup)) {
            this.popup[popup_key] = popup_value
          }
        } else {
          this.display[key] = value
        }
      }
    },

    selectTeam() {
      this.$store.dispatch('clearPlayerSelections')
      this.$set(this.popup, 'show', true)
      this.$set(this.popup, 'selectTeam', true)
      this.$set(this.popup, 'closeable', true)
    },

    selectPlayer(player) {
      if(!this.teamSelection || player.selected){
        this.$store.dispatch('playerSelect', player.userId)
      }
    },

    sendSelections(){
      this.game.submittedSelections = true
      // emit to socket
      this.$socket.client.emit('submit_team', {
        gameKey: this.gameKey,
        team: this.players.filter(player => player.selected)
      })
    },

    vote(decision){
      if(this.display.vote){
        this.$socket.client.emit('vote', {
          gameKey: this.gameKey,
          player: this.player.userId,
          decision: decision
        })
          this.display.vote = false
      }
    },

    revealPicks() {
      this.display.revealing = true
      this.$socket.client.emit('reveal_picks', {
        gameKey: this.gameKey
      })
    },

    tallyVoteResutls(){
      let successes = this.currentQuest.vote.filter(vote => vote.vote)
      this.currentQuest.reject = !(successes.length > (this.currentQuest.vote.length - successes.length))
    },

    voteTally() {
      this.display.picks = false
      // go back and get a new leader
      this.$socket.client.emit('team_result', {
        gameKey: this.gameKey,
        rejected: this.currentQuest.reject
      })
    },

    leaving(){
      // this.quitGame()
    },

    titlebarClick(){
      this.display.loading = true
      this[this.currentStage.button.action]()
    },

    advanceRound(increment = 1){
      if(this.currentQuest.success){
        this.game.knightWins++
      } else {
        this.game.minionWins++
      }

      if(this.game.stage < this.game.quests.length){
        this.game.round += increment
        this.startRound()
      }
    },

    advanceStage(increment = 1, restart = false){
      if(!this.isEndGame){
        let len = this.game.stages.length
        if(this.game.stage === len - 1 || restart){
         this.game.stage = 0
         if(!restart){
           this.advanceRound()
         }
        } else {
          this.game.stage += increment
        }
      }
    },


    popupClose(){
      if(this.popup.closeable){
        for(let pop in this.popup){
          this.popup[pop] = false
        }
      }
    },

    handleOptionClick(action){
      // set point maximum
      switch(action){
        case 'allegiance':
          this.popup.showMenu = false
          this.popup.closeable = true
          this.popup.allegiance = true
        break;
      }

    },

    openMenu(){
      this.popup.show = true
      this.popup.showMenu = true
      this.popup.closeable = true
    }

  }
}
</script>

<style scoped lang="scss">

  @import "@/styles/slide-right-animation.scss";

  .slide-right-enter-active {
    animation: slideInRight .5s;
  }
  .slide-right-leave-active {
    animation: slideOutRight .4s reverse;
  }

  .token {
    margin-top: 20px;
  }

  .player-list-vote {
    .quest-vote-list {
      margin: 10px 0;
    }
  }

  .panel-block {
    background-color: white;
    th {
      white-space: nowrap;
    }
  }

  .image {
    padding: 20px;
    height: 300px;
  }

  .score {
    .subtitle {
      font-variant: small-caps;
      margin-bottom: 1.5em;
      padding-bottom: .5em;
      border-bottom: 1px solid grey;
    }
    .points{
      background-color: #363636;
      color: whitesmoke;
      padding: 10px;
      width: 15em;
      border-radius: 6px;
      margin: auto;

      .plus {
        margin-bottom: 15px;
        margin-right: 3px;
        display: inline-block;
        font-size: .7em;
        vertical-align:middle;
      }

      .pts {
        font-size: .5em;
        padding-left: 5px;
      }
    }
  }

  .cohorts {
    font-variant: small-caps;
    font-weight: bold;
    padding-bottom: 5px;
  }

  .minion-list {
    font-weight: bold;
    font-color: black;
    font-size: 1.2em;
  }

  .gameboard {
    /*min-width: 100vw;*/
    position: relative;
    padding: 0;
    display: flex;
    flex-direction: column;

    .game {

      padding: 0 4em;
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .game-display {

        .section {
          padding: 2em;
          padding-bottom: 5em;
          &:first-child {
            padding-bottom: 4em;
          }
        }

        .button{
          &.is-centered {
            margin: auto;
          }
        }

        .columns {
          position: relative;

          .playerlist {
            padding: 4em;
          }

          .floating-playerlist {
            z-index: 205;
            background-color: #00000045;
            position: absolute;
            height: 100%;
            min-height: 100vh;
            width: 100%;
            top: 10px;
            left: 0;
          }
        }
      }
    }
  }



</style>
