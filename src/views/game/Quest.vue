<template>
  <div>
    <!-- for those on the quest -->
    <div v-if="onQuest">
      <h3 class="title is-3 fancy-title has-text-centered">
        Your Quest
      </h3>
      <br/>
      <div class="columns is-centered is-mobile is-multiline">
        <div class="column is-narrow" 
             v-for="decision in ['success', 'fail']" 
             @click="questDecision(decision)">
          <card :display="quest === decision || quest === null"
                :select="true"
                :selected="quest === decision"
                >
            <template #title>
              <span class="tag is-medium fancy drop-shadow"
                    :class="[decision === 'success' ? 'is-success' : 'is-danger' ]">
                {{ decision === 'success' ? 'Success' : 'Fail' }}
              </span>
            </template>
            <template #content>
              <div>
                <img class="image" :src="images[decision]" />
              </div>
            </template>
          </card>
        </div>
      </div>
      <br/>
      <div class="has-text-centered">
        <button class="button is-medium"
                :class="{ disabled: quest === null }"
                :disabled="quest === null"
                v-show="quest !== null"
                @click="saveQuestOutcome()">
          Select Card
        </button>
      </div>
    </div>
    <!-- and those not on the quest -->
    <div v-else>
      <h3 class="title is-3 fancy-title has-text-centered">
        Quest in Progress
      </h3>
      <div class="columns is-centered is-mobile is-multiline">
        <div class="column is-narrow" v-for="teamMember, index in team">
          <card :display="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'

export default {

  name: 'Quest',

  components: {
    Card
  },

  props: {
    team: {
      type: Array,
      default: () => []
    },
    quest: {
      type: String,
      default: false
    },
    onQuest: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      images: {
        success: require('@/assets/grail-cup-success.png'),
        fail: require('@/assets/grail-cup-fail.png'),
      },
      saved: false,
    }
  },

  watch: {
    quest(val){
      this.saved = false
    }
  },

  methods: {
    saveQuestOutcome(){
      if(!this.saved){
        this.saved = true
        this.$emit('saveQuestOutcome', this.quest)
      }
    },
    questDecision(decision){
      if(!this.saved){
        this.$emit('questDecision', decision)
      }
    }
  }

}
</script>

<style scoped lang="scss">

</style>
