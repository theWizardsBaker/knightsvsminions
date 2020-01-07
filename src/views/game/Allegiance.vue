<template>
  <div>
    <div class="columns is-centered is-mobile">
      <div class="column is-narrow">
        <card :display="display">
          <template #title>
            <span class="tag is-medium  fancy drop-shadow"
                  :class="[ allegiance ? 'is-knight' : 'is-minion' ]">
              {{role}}
            </span>
          </template>
          <template #content>
            <p class="fancy">
              {{ allegiance ? 'Loyal to the Round Table' : 'Disloyal to the Round Table' }}
            </p>
            <div v-if="showMinionList">
              <br/>
              <div class="cohorts">{{ allegiance ? 'Minions' : 'cohorts' }}</div>
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
</template>

<script>
import Card from '@/components/Card.vue'

export default {

  name: 'Allegiance',

  components: {
  	Card,
  },

  props: {
    display: {
      type: Boolean,
      default: false
    },
    allegiance: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      default: 'no one'
    },
    minions: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      minionCharacterList: [
        'Merlin',
        'Minion',
        'Mordrid',
        'Morgana',
        'Oberon'
      ]
    }
  },

  computed: {
    showMinionList(){
      return this.minionCharacterList.includes(this.role)
    }
  },

}
</script>

<style scoped lang="scss">

</style>
