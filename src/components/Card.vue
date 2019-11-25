<template>
  <div class="card-container">
    <div class="card" :class="{ flip: display }" >
      <div class="box card-front">
        <div class="playing-card-outline" >
          <h4 class="title is-5 has-text-dark" >
            <slot name="title"></slot>
          </h4>
          <div class="playing-card-content">
            <slot name="content"></slot>
          </div>
          <div class="playing-card-footer">
            <slot name="footer">
            </slot>
          </div>
        </div>
      </div>
      <div class="box card-backing" >

      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: 'playing-card',

  props: {
    display:{
      type: Boolean,
      default: false
    },
    alignment: {
      type: String,
      default: null
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
    position: relative;
    -webkit-perspective: 1000;
       -moz-perspective: 1000;
            perspective: 1000;



    .card {
      &.flip {
        -webkit-transform: rotateY(180deg);
           -moz-transform: rotateY(180deg);
                transform: rotateY(180deg);
      }

      -webkit-transition: 0.8s;
         -moz-transition: 0.8s;
           -o-transition: 0.8s;
              transition: 0.8s;
      -webkit-transform-style: preserve-3d;
         -moz-transform-style: preserve-3d;
              transform-style: preserve-3d;
         -webkit-transform: translateZ(1px);

      position: relative;

      min-height: 350px;
      width: 250px;
      margin-bottom: 0px;
      padding: 0px;

    }

    .card-front {
      -webkit-transform: rotateY(180deg);
         -moz-transform: rotateY(180deg);
              transform: rotateY(180deg);
      -webkit-backface-visibility: visible;
         -moz-backface-visibility: visible;
              backface-visibility: visible;



      .goodguy {
        background: #3585ca;
        background: -moz-linear-gradient(top,  #3585ca 0%, #3585ca 49%, #29669b 100%);
        background: -webkit-linear-gradient(top,  #3585ca 0%,#3585ca 49%,#29669b 100%);
        background: linear-gradient(to bottom,  #3585ca 0%,#3585ca 49%,#29669b 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3585ca', endColorstr='#29669b',GradientType=0 );
      }

      .badguy {
        background: #aa4032;
        background: -moz-linear-gradient(top, #aa4032 0%, #aa4032 50%, #34240f 100%);
        background: -webkit-linear-gradient(top, #aa4032 0%,#aa4032 50%,#34240f 100%);
        background: linear-gradient(to bottom, #aa4032 0%,#aa4032 50%,#34240f 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#aa4032', endColorstr='#34240f',GradientType=0 );
      }

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
        padding-bottom: 15px;
        border-radius: 5px;

        .title {
          padding: 10px;
          padding-top: 15px;
          margin: 0px;
          text-align: center;
        }

        .playing-card-brand {
          color: #B8ADAA;
          position: absolute;
          bottom: -6px;
          right: -3px;
          padding: 0px;
          background-color: white;
          padding-left: 7px;
          padding-right: 4px;
          font-weight: bold;
          font-variant: small-caps;
          line-height: 15px;
        }

        .playing-card-content {
          padding: 10px;
          height: 100%;
          display: inline-flex;
          align-items: stretch;
          text-align: center;
        }

        .playing-card-footer{
          padding: 0px 10px;
        }
      }

    }

    /*vectorlady.com*/
    .card-backing {

      -webkit-backface-visibility: hidden;
         -moz-backface-visibility: hidden;
              backface-visibility: hidden;

      z-index: 2;
      -webkit-transform: rotateY(0);
         -moz-transform: rotateY(0);
              transform: rotateY(0);

      background-color: black;
      font-variant: small-caps;

      .logo {
        position: absolute;
        bottom: 20px;
        right: 20px;
        font-size: 4em;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    }
  }
</style>