class Load extends Phaser.Scene {
   constructor() {
      super("loadScene");
   }

   preload() {
      // UI assets
      this.load.atlas("ui_atlas", "assets/images/ui_atlas.png", "assets/images/ui_atlas.json");
      this.load.image("clouds1", "./assets/images/clouds1.png");
      this.load.image("clouds2", "./assets/images/clouds2.png");

      // object assets
      this.load.atlas("object_atlas", "./assets/images/object_atlas.png", "./assets/images/object_atlas.json");

      // data(text, etc) assets
      this.load.json("data", "./assets/data.json");

      // audio assets
      this.load.audio('backgroundmusic', 'assets/sounds/MissingMeTheme3.mp3');
      this.load.audio('back', 'assets/sounds/back.mp3');
      this.load.audio('play', 'assets/sounds/clickPlay.mp3');
      this.load.audio('confirm', 'assets/sounds/confirm.mp3');
      this.load.audio('hover', 'assets/sounds/hover.mp3');
      this.load.audio('obtainItem', 'assets/sounds/obtainItem.mp3');
      this.load.audio('questCompleted', 'assets/sounds/questCompleted.mp3');
      this.load.audio('startQuest', 'assets/sounds/startQuest.mp3');
      this.load.audio('teddy1', 'assets/sounds/teddy1.mp3');
      this.load.audio('teddy2', 'assets/sounds/teddy2.mp3');
      this.load.audio('walter1', 'assets/sounds/walter1.mp3');
      this.load.audio('walter2', 'assets/sounds/walter2.mp3');
      this.load.audio('corrine1', 'assets/sounds/corrine1.mp3');
      this.load.audio('corrine2', 'assets/sounds/corrine2.mp3');
      this.load.audio('step1', 'assets/sounds/step1.mp3');
      this.load.audio('step2', 'assets/sounds/step2.mp3');
      this.load.audio('water', 'assets/sounds/watering.mp3');
   }

   create() {
      console.log("Load scene loaded");

      // player animations
      this.anims.create({
         key: "dirtywalk",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'player/dirtywalk/walk', end: 3 }),
         frameRate: 4,
         repeat: -1
      });

      this.anims.create({
         key: "cleanwalk",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'player/cleanwalk/walk', end: 3 }),
         frameRate: 4,
         repeat: -1
      });

      // critter animations
      this.anims.create({
         key: "worm",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'worm/worm', end: 1 }),
         frameRate: 2,
         repeat: -1
      });

      this.anims.create({
         key: "bird",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'bird/bird', end: 1 }),
         frameRate: 2,
         repeat: -1
      });

      this.anims.create({
         key: "wateringcan",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'wateringcan/wateringcan', end: 1 }),
         frameRate: 4,
         repeat: -1
      });

      // start the next scene
      this.scene.start("menuScene");
   }
}
