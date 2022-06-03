class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   create() {

      // game state
      this.inQuest = false;
      this.questCount = 0;
      this.introComplete = false;
      this.tomatoUpdated = false;
      this.watermelonUpdated = false;
      this.end1 = false;  // true if player talks to grave after all quests are done
      this.end2 = false;  // true if player interacts with crop after grave

      // set world size
      this.physics.world.setBounds(0, 0, game.config.width * 5, game.config.height);

      // add skies
      this.yellowBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xe3d8a3).setOrigin(0, 0);
      this.yellowBackground.setScrollFactor(0);
      this.yellowBackground.depth = -4;
      this.pinkBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xaa6bb0).setOrigin(0, 0);
      this.pinkBackground.setScrollFactor(0);
      this.pinkBackground.depth = -3;
      this.purpleBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x654991).setOrigin(0, 0);
      this.purpleBackground.setScrollFactor(0);
      this.purpleBackground.depth = -2;
      this.blueBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x3a4d99).setOrigin(0, 0);
      this.blueBackground.setScrollFactor(0);
      this.blueBackground.depth = -1;

      // parallax clouds
      this.clouds1 = this.add.tileSprite(0, 0, game.config.width * 5, 608, 'clouds1').setOrigin(0, 0);
      this.clouds1.depth = -0.5;
      this.clouds2 = this.add.tileSprite(0, 0, game.config.width * 5, 608, 'clouds2').setOrigin(0, 0);
      this.clouds2.depth = -0.5;

      // game tint
      this.saturation = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0, 0);
      this.saturation.alpha = 0.39;
      this.saturation.depth = 1.5;
      this.saturation.setScrollFactor(0);

      // temp fps counter
      this.tempFPS = this.add.text(10, 90, "FPS: " + this.game.loop.actualFps);
      this.tempFPS.setScrollFactor(0);

      // controls 
      keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
      keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

      // add npc data
      var cache = this.cache.json;
      this.data = cache.get("data");

      // add player
      this.player = new Player(this, 940, 490, 'object_atlas', 'player/dirtywalk/walk0').setOrigin(0.5, 1);

      // add camera
      this.cameras.main.setBounds(0, 0, game.config.width * 5, game.config.height);
      this.cameras.main.startFollow(this.player);

      // add settings text
      const settingsText = this.add.text(27, 31, 'ESC', { fill: '#79bdfc', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0);
      settingsText.depth = 2;
      settingsText.setScrollFactor(0);

      // add settings button
      const settingsButton = this.add.image(12, 10, "ui_atlas", 'cloud').setOrigin(0);
      settingsButton.alpha = 1;
      settingsButton.depth = 1.9;
      settingsButton.setScrollFactor(0);

      // add inventory
      this.inventory = new Inventory(this, 897, 15);
      this.inventory.setOrigin(1, 0);

      // add floor
      this.createFloor();

      // add NPCs
      this.npcs = this.add.group({
         runChildUpdate: false
      });
      this.vData = this.data["npcs"]["villagers"];
      this.cData = this.data["npcs"]["crops"];
      for (const [key, data] of Object.entries(this.vData)) {
         this.npcs.add(new Villager(this, data["location"]["x"], data["location"]["y"], "object_atlas", key, data).setOrigin(0.5, 1));
      }
      for (const [key, data] of Object.entries(this.cData)) {
         this.npcs.add(new Crop(this, data["location"]["x"], data["location"]["y"], "object_atlas", key, data).setOrigin(0.5, 1));
      }

      // tutorial text
      this.controls = this.add.image(1240, 479, "object_atlas", 'control_sign').setOrigin(0.5, 1);
      this.controls.depth = -0.01;
      this.tutText = this.add.text(1240, 270, 'WELCOME TO THE FARM!', { fill: '#ffffff', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5, 0);
      this.tutText2 = this.add.text(1245, 310, 'A/D   ... WALK\nSHIFT ... SPRINT\nSPACE ... INTERACT', { fill: '#ffffff', fontFamily: 'VT323', fontSize: 35, align: 'left' }).setOrigin(0.5, 0);

      // trees
      this.tree0 = this.add.image(0, 479, "object_atlas", 'tree').setOrigin(0, 1);
      this.tree0.scaleX = 1.5;
      this.tree0.scaleY = 1.5;
      this.tree1 = this.add.image(4300, 479, "object_atlas", 'tree').setOrigin(0, 1);
      this.tree1.flipX = true;
      this.tree1.scaleX = 1.5;
      this.tree1.scaleY = 1.5;

      // add house
      this.house = this.add.image(800, 477, 'house').setOrigin(0.5, 1);
      this.house.depth = -0.01;

      // add shops
      this.tailorShop = this.add.image(4000, 477, 'tailorShop').setOrigin(0.5, 1);
      this.tailorShop.depth = -0.01;
      this.generalStore = this.add.image(2500, 477, 'generalStore').setOrigin(0.5, 1);
      this.generalStore.depth = -0.01;
      this.doctorsOffice = this.add.image(3300, 477, 'doctorsOffice').setOrigin(0.5, 1);
      this.doctorsOffice.depth = -0.01;

      // add grave
      this.grave = new Grave(this, 200, 477, 'object_atlas', 'grave', this.data["grave"]).setOrigin(0.5, 1);

      // add sun      
      this.sun = this.add.image(game.config.width + 120, game.config.height - 200, 'object_atlas', "sun").setOrigin(0.5, 0.5);
      this.sun.depth = -0.6;
      this.sun.setScrollFactor(0);

      // tween
      this.addTweens();

      // intro text
      this.introindex = 0;
      this.introText = new Textbox(this, game.config.width / 2, game.config.height / 2 - 20, this.data["intro"][this.introindex++], {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'left'
      }).setOrigin(0.5);
      this.introText.scroll = false;
      this.introText.wrapWidth = 600;
      this.introText.animation = false;

      // interact text
      this.indicator = new Textbox(this, game.config.width / 2, game.config.height / 2 - 20, 'SPACE', {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'left'
      }).setOrigin(0.5);
      this.indicator.wrapWidth = 600;
      this.indicator.animation = false;
      this.indicator.visible = false;
      this.indicator.depth = 7;

   }

   update() {
      if (this.introComplete) {
         // update player
         this.player.update();
         this.grave.update();
      } else {
         if (keyTap(keySpace)) {
            if (this.introindex < this.data["intro"].length) {
               this.introText.setText(this.data["intro"][this.introindex++]);
            } else {
               console.log("intro complete");
               this.introText.visible = false;
               this.introComplete = true;
               this.npcs.runChildUpdate = true;
            }
         }
      }
      if (this.end1 && !this.end2) {
         // if player is in the area of the farm engage in animation here...
         let tomato = this.children.getByName("tomato");
         let carrot = this.children.getByName("carrot");
         let watermelon = this.children.getByName("watermelon");
         this.npcs.runChildUpdate = false;
         if (Phaser.Math.Distance.Between(this.player.x, this.player.y, tomato.x, tomato.y) < 200) {
            this.indicator.x = tomato.x;
            this.indicator.y = tomato.y - tomato.height - 25;
            this.indicator.visible = true;
            if (keyTap(keySpace)) this.endingAnimation(tomato);
         } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, carrot.x, carrot.y) < 200) {
            this.indicator.x = carrot.x;
            this.indicator.y = carrot.y - carrot.height - 25;
            this.indicator.visible = true;
            if (keyTap(keySpace)) this.endingAnimation(carrot);
         } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, watermelon.x, watermelon.y) < 200) {
            this.indicator.x = watermelon.x;
            this.indicator.y = watermelon.y - watermelon.height - 25;
            this.indicator.visible = true;
            if (keyTap(keySpace)) this.endingAnimation(watermelon);
         } else {
            this.indicator.visible = false;
         }
      }

      // sets grave the end state if quests are complete
      if (this.questCount == 3 && this.grave.state != "end") {
         this.grave.state = "end";
      }

      // update fps counter
      this.tempFPS.setText("FPS: " + this.game.loop.actualFps.toFixed(2));

      // move clouds
      this.clouds1.tilePositionX -= 1;
      this.clouds2.tilePositionX -= 0.5;

      // go to setting if ESC is pressed
      if (keyESC.isDown) {
         this.scene.pause().launch("settingsScene", { scene: "playScene" });
      }

      // update sun and background tween
      this.updateSunTween();

      // update crop tweens
      this.updateCropTween();
   }

   endingAnimation(target) {
      this.end2 = true;
      console.log("ending");
      this.player.controllable = false;
      this.player.setVelocityX(0);
      this.indicator.visible = false;
      // this code is probably kind of screwy because im not sure what the intergral of the tween is
      let distance = target.x - this.player.x; // distance between center of player and target
      let w = 60; // desired distance away from target
      let duration = 2000; // in ms
      let move = (distance < 0) ? distance + w : distance - w; // actual location to move to

      // tween player to the correct location by the plant
      this.tweens.add({
         targets: this.player.body.velocity,
         x: move / (duration / 1000),
         duration: duration,
         yoyo: true,
         ease: "sinInOut",
         onComplete: () => {
            this.player.setVelocityX(0);
            this.player.flipX = (target.x - this.player.x > 0) ? true : false;
            console.log(target.x - this.player.x);
         }
      })

      // water animation (missing)

      // change screen after delay
      this.time.delayedCall(duration * 2, () => {
         this.cameras.main.fadeOut(500);
         this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("endScene");
            console.log("ending scene");
         });
      }, [], this);
   }

   createFloor() {
      // add floor
      this.floor = this.add.tileSprite(0, game.config.height - 132, game.config.width * 5, 132, "object_atlas", 'floor').setOrigin(0, 0);

      // add to physics
      this.physics.add.existing(this.floor, true);
      this.floor.body.immovable = true;

      // add collision between player and floor
      this.physics.add.collider(this.player, this.floor);
   }

   addTweens() {
      // teddy tomato tween
      this.tweens.add({
         targets: [this.children.getByName("teddy"), this.children.getByName("tomato")],
         scaleY: 1.05,
         duration: 1000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // walter watermelon tween
      this.tweens.add({
         targets: [this.children.getByName("walter"), this.children.getByName("watermelon")],
         scaleY: 1.03,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // corrine carrot tween
      this.tweens.add({
         targets: [this.children.getByName("corrine"), this.children.getByName("carrot")],
         scaleY: 1.02,
         duration: 300,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // sun tween
      this.tweens.add({
         targets: this.sun,
         duration: 20000,
         repeat: -1,
         angle: 360,
      });
   }

   updateSunTween() {
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
            duration: 900,
         });
      } else if (this.questCount == 2) {
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
            duration: 900,
         });
      } else if (this.questCount == 3) {
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
            duration: 900,
         });
      }
   }

   updateCropTween() {
      if (this.data["npcs"]["crops"]["tomato"]["quest_done"] == true && this.tomatoUpdated == false) {
         this.tweens.add({
            targets: this.children.getByName("tomato"),
            scaleX: 1,
            scaleY: 1,
            duration: 100,
         });
         this.tweens.add({
            targets: this.children.getByName("tomato"),
            scaleY: 1.05,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
         });
         this.tomatoUpdated = true;
      }

      if (this.data["npcs"]["crops"]["watermelon"]["quest_done"] == true && this.watermelonUpdated == false) {
         console.log("water tween stopped");
         this.tweens.add({
            targets: this.children.getByName("watermelon"),
            scaleX: 1,
            scaleY: 1,
            duration: 100,
         });
         this.tweens.add({
            targets: this.children.getByName("watermelon"),
            scaleY: 1.03,
            duration: 400,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
         });
         this.watermelonUpdated = true;
      }
   }
}
