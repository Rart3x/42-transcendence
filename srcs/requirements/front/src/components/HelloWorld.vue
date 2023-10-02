<template>
  <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
</template>

<script>
import Phaser from "phaser";
import GameScene from "@/components/GameScene.vue";

export default {
  name: "HelloWorld",
  data() {
    return {
      parent: "body",
      game: {
        type: Phaser.AUTO,
        // width: 1000,
        // height: 800,
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
    createGame(config) {
      const game = new Phaser.Game(config);
      this.initialize = true;
    },
  },
  mounted() {
    this.createGame(this.game);
  },
};
</script>
