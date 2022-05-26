class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   create() {

      // game state
      this.inQuest = false;

      // set world size
      this.physics.world.setBounds(0, 0, game.config.width * 5, game.config.height);

      // add background
      this.background = this.add.image(0, -3570, 'background').setOrigin(0, 0);
      this.background.scale = 1.5;
      this.background.setScrollFactor(0);

      // parallax clouds
      this.clouds1 = this.add.tileSprite(0, 0, game.config.width * 10, 608, 'clouds1').setOrigin(0, 0);
      this.clouds2 = this.add.tileSprite(0, 0, game.config.width * 10, 608, 'clouds2').setOrigin(0, 0);

      // temp scene indicator text
      const tempText = this.add.text(10, 10, "playScene");
      tempText.setScrollFactor(0);

      // temp fps counter
      this.tempFPS = this.add.text(10, 30, "FPS: " + this.game.loop.actualFps);
      this.tempFPS.setScrollFactor(0);

      // controls 
      keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
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
      this.villager0 = new Villager(this, 50, 477, 'villager0', 0, this.vData["villager0"]).setOrigin(0.5, 1); // corrine
      this.npcs.add(this.villager0);
      this.villager1 = new Villager(this, 200, 477, 'villager1', 0, this.vData["villager1"]).setOrigin(0.5, 1); // teddy
      this.npcs.add(this.villager1);
      this.villager2 = new Villager(this, 350, 477, 'villager2', 0, this.vData["villager2"]).setOrigin(0.5, 1); // walter
      this.npcs.add(this.villager2);
      this.crop0 = new Crop(this, 500, 477, 'crop0', 0, this.cData["crop0"]).setOrigin(0.5, 1);
      this.npcs.add(this.crop0);
      this.crop1 = new Crop(this, 660, 477, 'crop1', 0, this.cData["crop1"]).setOrigin(0.5, 1);
      this.npcs.add(this.crop1);
      this.crop2 = new Crop(this, 800, 477, 'crop2', 0, this.cData["crop2"]).setOrigin(0.5, 1);
      this.npcs.add(this.crop2);

      // villager0 and crop0 tween
      this.tweens.add({
         targets: [this.villager0, this.crop0],
         scaleY: 1.02,
         duration: 300,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // villager1 and crop1 tween
      this.tweens.add({
         targets: [this.villager1, this.crop1],
         scaleY: 1.03,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // villager2 and crop2 tween
      this.tweens.add({
         targets: [this.villager2, this.crop2],
         scaleY: 1.05,
         duration: 1000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      this.items = this.add.group({
         classType: Item,
         runChildUpdate: true
      });

      // add sun
      this.sun = this.add.image(game.config.width / 2, 100, 'sun').setOrigin(0.5, 0.5);
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
