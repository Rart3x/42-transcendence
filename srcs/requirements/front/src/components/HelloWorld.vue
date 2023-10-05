<template>
</template>

<script lang="ts">

import Phaser from 'phaser'
import GameScene from '@/components/GameScene.vue'

export default {
  name: 'HelloWorld',
  data() {
    return {
      game: {
        type: Phaser.AUTO,
        scale: {
          parent: "game",
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        width: 1000,
        height: 800,
        physics: {
          default: 'matter',
          matter : {debug: true}
        },
        scene: GameScene
      },
      initialize: false
    }
  },
  methods: {
    createGame(config : any){
      console.log(config);
      const game = new Phaser.Game(config);
      this.initialize = true;
    }
  },
  mounted() {
    this.createGame(this.game);
  }
}
</script>
