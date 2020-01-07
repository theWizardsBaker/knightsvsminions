<template>
	<div>
    <h3 class="title fancy drop-shadow is-2 has-text-centered">Knights vs Minions</h3>
    <div class="container rules">
      <div class="section">
        <h4 class="subtitle fancy is-4">Overview</h4>
        <p>
          The game consists of 5 rounds; each round has a team building phase and a Quest phase.
          <br/>
          <br/>
          To begin a round, the leader proposes a team to complete a Quest - all other players will either approve the proposed team and move to the quest phase, or reject the proposed team passing leadership to the next player and repeating the process until a team is approved. In the Quest phase those players selected to be on the team will determine if the Quest is succesfull.
        </p>
        <br/>
        <hr/>
        <h4 class="subtitle fancy is-4">Team Assignment</h4>
        <p>
          The leader selects the required number of players to form a team. The leader can be on the team, but is not required to be so.
        </p>
        <br/>
        <hr/>
        <h4 class="subtitle fancy is-4">Team vote</h4>
        <p>
          After appropriate discussion, all other players will vote on the team composition. The leader can be a Minion, or one (or more) of the other players chosen may be.
          <br/>
          <br/>
          If the team is approved, play continues in the quest phase.
          <br/>
          <br/>
          If the team is rejected (a tied vote is also rejection), a new leader is chosen and the team building phase is repeated.
          <br/>
          <br/>
          Minions wins the game if five teams are rejected in a single round.
        </p>
        <br/>
        <hr/>
        <h4 class="subtitle fancy is-4">Quest Phase</h4>
        <p>
          Each player on the quest selects a quest card. The quest fails if one or more fail cards are played.
          <br/>
          <br/>
          The good players must select the quest success card. Minions may select either the quest success (Stephanie) or quest fail card.
        </p>
        <br/>
        <hr/>
        <h4 class="subtitle fancy is-4">End of the game</h4>
        <p>
          The game ends immediately after either 3 succesful or three failed quests. The Minion players win if 3 quests fail or when 5 teams are rejected in a single round.
        </p>
        <br/>
        <hr/>
        <h4 class="subtitle fancy is-4">Assassinate Merlin</h4>
        <p>
          If 3 quests are completed succesfully, the Minion players will have a final opportunity to win the game by correctly naming which of the Knights is Merlin.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'Rules'
}
</script>
<style>
</style>
