<template>
</template>

<script>
import Phaser from "phaser";
import GameScene from "@/components/GameScene.vue";


export default {
  name: "HelloWorld",
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
          default: "arcade",
          arcade: { debug: true },
        },
        scene: GameScene,
      },
      scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      },
      initialize: false,
    };
  },
  methods: {
    createGame(config){
      const game = new Phaser.Game(config);
      this.initialize = true;
    },
  },
  mounted() {
    this.createGame(this.game);
  }
}
</script>
