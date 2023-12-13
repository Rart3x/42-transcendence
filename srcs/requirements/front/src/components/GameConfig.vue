<script lang="ts">

  import Phaser from 'phaser'
  import GameScene from './GameScene.vue'

  export default {
    name: 'GameConfig',
    data() {
      return {
        game: {
          type: Phaser.AUTO,
          fullscreenTarget: 'game',
          roundPixels: true,
          scale: {
            parent: 'game',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            mode: Phaser.Scale.FIT,
          },
          dom :{
            createContainer: true
          },
          width: 1000,
          height: 800,
          physics: {
            default: 'matter',
            matter : {debug: false}
          },
          scene: GameScene
        },
        initialize: true,
      }
    },
    methods: {
      createGame(config : any){
        const game = new Phaser.Game(config);
        this.initialize = true;
      }
    },
    mounted() {
      this.createGame(this.game);
    },
  }
</script>