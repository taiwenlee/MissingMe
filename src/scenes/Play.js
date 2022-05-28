class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   create() {

      // game state
      this.inQuest = false;
      this.questCount = 0;

      // set world size
      this.physics.world.setBounds(0, 0, game.config.width * 5, game.config.height);

      // add skies
      this.yellowBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xe3d48a).setOrigin(0, 0);
      this.yellowBackground.setScrollFactor(0);
      this.pinkBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xa95bb0).setOrigin(0, 0);
      this.pinkBackground.setScrollFactor(0);
      this.purpleBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x3c0791).setOrigin(0, 0);
      this.purpleBackground.setScrollFactor(0);
      this.blueBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x102b94).setOrigin(0, 0);
      this.blueBackground.setScrollFactor(0);

      // parallax clouds
      this.clouds1 = this.add.tileSprite(0, 0, game.config.width * 10, 608, 'clouds1').setOrigin(0, 0);
      this.clouds2 = this.add.tileSprite(0, 0, game.config.width * 10, 608, 'clouds2').setOrigin(0, 0);

      this.saturation = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0, 0);
      this.saturation.alpha = 0.39;
      this.saturation.depth = 1.5;
      this.saturation.setScrollFactor(0);

      // temp scene indicator text
      const tempText = this.add.text(10, 10, "playScene");
      tempText.setScrollFactor(0);

      // temp fps counter
      this.tempFPS = this.add.text(10, 30, "FPS: " + this.game.loop.actualFps);
      this.tempFPS.setScrollFactor(0);

      // controls 
      keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
      keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      // add npc data
      var cache = this.cache.json;
      this.data = cache.get("data");

      // add player
      this.player = new Player(this, game.config.width / 2, game.config.height - 160, 'player', 'run0.png');

      // add camera
      this.cameras.main.setBounds(0, 0, game.config.width * 5, game.config.height);
      this.cameras.main.startFollow(this.player);

      // add inventory
      this.inventory = new Inventory(this, 800, 10);
      this.inventory.setOrigin(0);

      // add floor
      this.createFloor();

      // add NPCs
      this.npcs = this.add.group({
         runChildUpdate: true
      });
      this.vData = this.data["npcs"]["villagers"];
      this.cData = this.data["npcs"]["crops"];
      for (const [key, data] of Object.entries(this.vData)) {
         this.npcs.add(new Villager(this, data["location"]["x"], data["location"]["y"], key, 0, data).setOrigin(0.5, 1));
      }
      for (const [key, data] of Object.entries(this.cData)) {
         this.npcs.add(new Crop(this, data["location"]["x"], data["location"]["y"], key, 0, data).setOrigin(0.5, 1));
      }

      // teddy and tomato tween
      this.tweens.add({
         targets: [this.children.getByName("teddy"), this.children.getByName("tomato")],
         scaleY: 1.05,
         duration: 1000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // walter and watermelon tween
      this.tweens.add({
         targets: [this.children.getByName("walter"), this.children.getByName("watermelon")],
         scaleY: 1.03,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // corinne and carrot tween
      this.tweens.add({
         targets: [this.children.getByName("corinne"), this.children.getByName("carrot")],
         scaleY: 1.02,
         duration: 300,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      this.items = this.add.group({
         classType: Item,
         runChildUpdate: true
      });

      // add sun
      this.sun = this.add.image(game.config.width + 120, game.config.height - 200, 'sun').setOrigin(0.5, 0.5);
      this.sun.depth = 1.5;
      this.sun.setScrollFactor(0);

      // sun tween
      this.tweens.add({
         targets: this.sun,
         duration: 20000,
         repeat: -1,
         angle: 360,
      });

   }

   update() {

      // update player
      this.player.update(this.time, this.delta);

      // update fps counter
      this.tempFPS.setText("FPS: " + this.game.loop.actualFps);

      // move clouds
      this.clouds1.tilePositionX -= 1;
      this.clouds2.tilePositionX -= 0.5;

      if (this.questCount == 1) {
         // brighten scene
         this.tweens.add({
            targets: this.saturation,
            alpha: { value: 0.34, duration: 100, },
         });

         // fade blue
         this.tweens.add({
            targets: this.blueBackground,
            alpha: { value: 0, duration: 300, },
         });

         // move sun up
         this.tweens.add({
            targets: this.sun,
            x: game.config.width - 300,
            y: game.config.height - 350,
            duration: 500,
         });
      }

      if (this.questCount == 2) {
         // brighten scene
         this.tweens.add({
            targets: this.saturation,
            alpha: { value: 0.17, duration: 100, },
         });

         // fade purple
         this.tweens.add({
            targets: this.purpleBackground,
            alpha: { value: 0, duration: 300, },
         });

         // move sun up
         this.tweens.add({
            targets: this.sun,
            x: game.config.width - 500,
            y: game.config.height - 400,
            duration: 500,
         });
      }

      if (this.questCount == 3) {
         // brighten scene
         this.tweens.add({
            targets: this.saturation,
            alpha: { value: 0, duration: 100, },
         });

         // fade pink
         this.tweens.add({
            targets: this.pinkBackground,
            alpha: { value: 0, duration: 300, },
         });

         // move sun up
         this.tweens.add({
            targets: this.sun,
            x: game.config.width - 750,
            y: game.config.height - 500,
            duration: 500,
         });

      }
   }

   createFloor() {
      // add floor
      this.floor = this.add.tileSprite(0, game.config.height - 132, game.config.width * 10, 132, 'floor').setOrigin(0, 0);

      // add to physics
      this.physics.add.existing(this.floor, true);
      this.floor.body.immovable = true;

      // add collision between player and floor
      this.physics.add.collider(this.player, this.floor);
   }
}
