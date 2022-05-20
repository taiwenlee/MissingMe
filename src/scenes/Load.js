class Load extends Phaser.Scene {
   constructor() {
      super("loadScene");
   }

   preload() {
      // UI assets
      this.load.image("select", "./assets/images/select.png");
      this.load.image("play", "./assets/images/play.png");
      this.load.image("playHover", "./assets/images/playHover.png");
      this.load.image("settings", "./assets/images/settings.png");
      this.load.image("settingsHover", "./assets/images/settingsHover.png");
      this.load.image("credits", "./assets/images/credits.png");
      this.load.image("creditsHover", "./assets/images/creditsHover.png");
      this.load.image("item0", "./assets/images/npc0.png");
      this.load.image("indicator", "./assets/images/select.png");
      
      // object assets
      this.load.atlas("player", "./assets/images/player.png", "./assets/images/player.json");
      this.load.image("floor", "./assets/images/floor.png");
      this.load.image("npc0", "./assets/images/npc0.png");  // TODO: change to texture atlas
      this.load.image("npc1", "./assets/images/npc1.png");  // TODO: change to texture atlas

      // text assets
      this.load.json("text", "./assets/text.json");

      // audio assets
      this.load.audio('backgroundmusic', 'assets/sounds/MissingMeTheme3.wav');
   }

   create() {
      console.log("Load scene loaded");

      // animations
      this.anims.create({
         key: "run",
         frames: this.anims.generateFrameNames("player", {prefix: 'run', suffix: '.png', end: 7}),
         frameRate: 10,
         repeat: -1
      });

      this.scene.start("menuScene");
   }
}
