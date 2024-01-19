<script lang="ts">

  import Phaser from 'phaser';
  import { Game, Scale} from 'phaser'
  import BootScene from './BootScene.vue';
  import LobbyScene from './LobbyScene.vue';
  import GameScene from './GameScene.vue';
  import EndGameScene from './EndGameScene.vue';
  
  export default {
    name: 'GameConfig',
    data() {
      return {
        game: {
          type: Phaser.CANVAS,
          fullscreenTarget: 'game',
          roundPixels: true,
          scale: {
            parent: 'game',
            autoCenter: Scale.CENTER_BOTH,
            mode: Scale.FIT,
          },
          audio: {
            disableWebAudio: true
          },
          dom :{
            createContainer: true
          },
          width: 1000,  
          height: 800,
          physics: {
            default: 'matter',
            matter : { debug: false }
          },
          scene: [BootScene, LobbyScene, GameScene, EndGameScene],
          disableContextMenu: true,
        },
        initialize: true,
      }
    },
    methods: {
      createGame(config : any){
        const game = new Game(config);
        this.initialize = true;
      }
    },
    mounted() {
      this.createGame(this.game);
    },
  }
</script>