<template>
  <div>
    <h3 class="title is-2 fancy has-text-centered"
        :class="[
          !!rejected ? 'has-text-success' : 'has-text-danger',
          (rejected === null || rejected === undefined) ? 'is-invisible' : ''
        ]">
      {{!!rejected ? 'Approved' : 'Rejected'}}
    </h3>
    <br/>
    <div class="columns is-multiline is-mobile is-centered">
      <div class="column is-narrow" v-for="vote in votes">
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
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import VoteCard from '@/components/VoteCard'

export default {

  name: 'VoteReveal',

  components: {
    VoteCard
  },

  props: {
    votes: {
      type: Array,
      default: () => []
    },
    rejected: {
      type: Boolean,
      default: null
    }
  },

}
</script>

<style scoped lang="scss">

</style>
