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
      this.clouds1 = this.add.tileSprite(0, 0, 912, 608, 'clouds1').setOrigin(0, 0);
      this.clouds2 = this.add.tileSprite(0, 0, 912, 608, 'clouds2').setOrigin(0, 0);

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
      this.player = new Player(this, game.config.width / 2, game.config.height - 60, 'player', 'run0.png');

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
      this.villager0 = new Villager(this, 30, 577, 'villager0', 0, this.vData["villager0"]).setOrigin(1); // corrine
      this.npcs.add(this.villager0);
      this.villager1 = new Villager(this, 200, 577, 'villager1', 0, this.vData["villager1"]).setOrigin(1); // teddy
      this.npcs.add(this.villager1);
      this.villager2 = new Villager(this, 300, 577, 'villager2', 0, this.vData["villager2"]).setOrigin(1); // walter
      this.npcs.add(this.villager2);
      this.crop0 = new Crop(this, 500, 577, 'crop0', 0, this.cData["crop0"]).setOrigin(1);
      this.npcs.add(this.crop0);
      this.crop1 = new Crop(this, 600, 577, 'crop1', 0, this.cData["crop1"]).setOrigin(1);
      this.npcs.add(this.crop1);
      this.crop2 = new Crop(this, 700, 577, 'crop2', 0, this.cData["crop2"]).setOrigin(1);
      this.npcs.add(this.crop2);

      // villager0 and crop0 tween
      this.tweens.add({
         targets: [this.villager0, this.crop0],
         scaleY: 1.1,
         duration: 1200,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // villager1 and crop1 tween
      this.tweens.add({
         targets: [this.villager1, this.crop1],
         scaleY: 1.1,
         duration: 1500,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // villager2 and crop2 tween
      this.tweens.add({
         targets: [this.villager2, this.crop2],
         scaleY: 1.1,
         duration: 2000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      this.items = this.add.group({
         classType: Item,
         runChildUpdate: true
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
      this.floor = this.add.tileSprite(0, game.config.height - 32, game.config.width * 10, 32, 'floor').setOrigin(0, 0);
      this.floor.tileScaleX = .5;
      this.floor.tileScaleY = .5;
      // add to physics
      this.physics.add.existing(this.floor, true);
      this.floor.body.immovable = true;

      // add collision between player and floor
      this.physics.add.collider(this.player, this.floor);
   }
}
