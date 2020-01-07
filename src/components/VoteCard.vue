<template>
  <div class="card-container">
    <div class="card">
      <div class="card-inner" :class="{ flip: display }" >
        <div class="box card-front">
          <div class="playing-card-outline" >
            <slot></slot>
          </div>
        </div>
        <div class="box card-backing" >
          <div class="backing">
            <img class="branding" src="../assets/small_dragon.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'vote-card',

  props: {
    display:{
      type: Boolean,
      default: false
    }
  },

  data () {
    return {

    }
  }

}
</script>

<style scoped lang="scss">
/*'*/

  .card-container{
    -webkit-perspective: 1000;
       -moz-perspective: 1000;
            perspective: 1000;

    .card {

      .card-inner {
        text-align: center;
        justify-content: center;

        -webkit-transition: 0.8s;
           -moz-transition: 0.8s;
             -o-transition: 0.8s;
                transition: 0.8s;
        -webkit-transform-style: preserve-3d;
           -moz-transform-style: preserve-3d;
                transform-style: preserve-3d;

        height: 140px;
        width: 140px;
        position: relative;
        margin-bottom: 0px;
        padding: 0px;

        &.flip {
          -webkit-transform: rotateY(180deg);
             -moz-transform: rotateY(180deg);
                  transform: rotateY(180deg);
        }

        .card-front {
          -moz-transform: scale(-1, 1);
          -o-transform: scale(-1, 1);
          -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
          padding-top: 10px;
        }


        .card-front, .card-backing {

          display: inline-flex;
          align-items: stretch;

          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          padding: 8px;

          .playing-card-outline {
            display: flex;
            flex-direction: column; 
            position: relative;
            width: 100%;
            padding-top: 18px;
            padding-bottom: 15px;
            border-radius: 5px;


            .title {
              padding: 10px;
              padding-top: 15px;
              margin: 0px;
              text-align: center;
              border-bottom: 2px solid whitesmoke;
            }

            .playing-card-brand {
              color: #B8ADAA;
              position: absolute;
              bottom: -6px;
              right: -3px;
              padding: 0px;
              padding-left: 7px;
              padding-right: 4px;
              font-weight: bold;
              font-variant: small-caps;
              line-height: 15px;
            }

            .playing-card-content {
              padding: 10px;
              height: 100%;
              align-items: stretch;
              text-align: center;
              p {
                font-weight: bold;
                color: black;
              }
            }

            .playing-card-footer{
              padding: 0px 10px;
            }
          }

        }

        /*vectorlady.com*/
        .card-backing {
          background-color: #191970;
          -webkit-backface-visibility: hidden;
             -moz-backface-visibility: hidden;
                  backface-visibility: hidden;

          .branding {
            width: 100%;
            padding-top: 12px;
          }
        }
      }

    }
  }
</style>