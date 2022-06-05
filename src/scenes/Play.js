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

      // controls 
      keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
      keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);

      // set world size
      this.physics.world.setBounds(0, 0, game.config.width * 5, game.config.height);

      // add skies
      this.yellowBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xe3d8a3).setOrigin(0, 0).setScrollFactor(0).setDepth(-4);
      this.pinkBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xaa6bb0).setOrigin(0, 0).setScrollFactor(0).setDepth(-3);
      this.purpleBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x654991).setOrigin(0, 0).setScrollFactor(0).setDepth(-2);
      this.blueBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x3a4d99).setOrigin(0, 0).setScrollFactor(0).setDepth(-1);

      // add sun      
      this.sun = this.add.image(game.config.width + 120, game.config.height - 200, 'object_atlas', "sun").setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(-0.6);

      // parallax clouds
      this.clouds1 = this.add.tileSprite(0, 0, game.config.width * 5, 608, 'clouds1').setOrigin(0, 0).setDepth(-0.5);
      this.clouds2 = this.add.tileSprite(0, 0, game.config.width * 5, 608, 'clouds2').setOrigin(0, 0).setDepth(-0.5);

      // add floor
      this.floor = this.add.tileSprite(0, game.config.height - 132, game.config.width * 5, 132, "object_atlas", 'floor').setOrigin(0, 0).setDepth(-0.01);

      // trees
      this.tree0 = this.add.image(0, 479, "object_atlas", 'tree').setOrigin(0, 1).setScale(1.4);
      this.tree1 = this.add.image(game.config.width * 5, 479, "object_atlas", 'tree').setOrigin(1, 1).setScale(1.4);
      this.tree1.flipX = true;
      this.tree2 = this.add.image(1600, 478, "object_atlas", 'bigtree').setOrigin(0.5, 1).setScale(1.4).setDepth(-0.01);
      this.tree2.flipX = true;      
      this.tree3 = this.add.image(3655, 477, "object_atlas", 'bigtree').setOrigin(0.5, 1).setScale(1.2).setDepth(-0.05);
      this.tree4 = this.add.image(3655, 477, "object_atlas", 'bigtree').setOrigin(0.5, 1).setScale(1.2).setDepth(-0.05);

      this.bench0 = this.add.image(2900, 480, "object_atlas", 'bench').setOrigin(0.5, 1).setScale(1).setDepth(-0.01);
      this.bench1 = this.add.image(4430, 480, "object_atlas", 'bench').setOrigin(0.5, 1).setScale(1);

      this.lamp0 = this.add.image(2225, 480, "object_atlas", 'streetlamp').setOrigin(0.5, 1).setScale(1).setDepth(-0.01);
      this.lamp1 = this.add.image(3020, 480, "object_atlas", 'streetlamp').setOrigin(0.5, 1).setScale(1).setDepth(-0.01);
      this.lamp2 = this.add.image(3743, 480, "object_atlas", 'streetlamp').setOrigin(0.5, 1).setScale(1).setDepth(-0.01);

      // add house
      this.house = this.add.image(800, 477, "object_atlas", 'house').setOrigin(0.5, 1).setDepth(-0.01);

      // add shops
      this.tailorShop = this.add.image(4000, 477, "object_atlas", 'tailor').setOrigin(0.5, 1).setDepth(-0.01);
      this.generalStore = this.add.image(2500, 477, "object_atlas", 'generalStore').setOrigin(0.5, 1).setDepth(-0.01);
      this.doctorsOffice = this.add.image(3300, 477, "object_atlas", 'doctors').setOrigin(0.5, 1).setDepth(-0.01);

      // game tint
      this.saturation = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0, 0).setScrollFactor(0).setDepth(1.5).setAlpha(0.39);

      // temp fps counter
      this.tempFPS = this.add.text(10, 90, "FPS: " + this.game.loop.actualFps).setScrollFactor(0);

      // get json data
      this.data = this.cache.json.get("data");

      // add watering can sound
      this.water = this.sound.add('water', { volume: sfxVol });

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

      // add player
      this.player = new Player(this, 940, 481, 'object_atlas', 'player/dirtywalk/walk0').setOrigin(0.5, 1).setDepth(7);

      // add camera
      this.cameras.main.setBounds(0, 0, game.config.width * 5, game.config.height).startFollow(this.player);

      //add worm (temp)
      this.worms = this.add.group({
         classType: Worm,
         runChildUpdate: true,
      });
      this.addWorm();
      this.addWorm();
      this.addWorm();
      this.addWorm();
      this.addWorm();

      // add settings text
      const settingsText = this.add.text(27, 31, 'ESC', { fill: '#79bdfc', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0).setScrollFactor(0).setDepth(2);

      // add settings button
      const settingsButton = this.add.image(12, 10, "ui_atlas", 'cloud').setOrigin(0).setScrollFactor(0).setDepth(1.9).setAlpha(1);

      // add inventory
      this.inventory = new Inventory(this, 897, 15).setOrigin(1, 0);

      // tutorial text
      this.controls = this.add.image(1240, 479, "object_atlas", 'control_sign').setOrigin(0.5, 1).setDepth(-0.01);
      this.tutText = this.add.text(1240, 270, 'WELCOME TO THE FARM!', { fill: '#ffffff', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5, 0);
      this.tutText2 = this.add.text(1245, 310, 'A/D   ... WALK\nSHIFT ... SPRINT\nSPACE ... INTERACT', { fill: '#ffffff', fontFamily: 'VT323', fontSize: 35, align: 'left' }).setOrigin(0.5, 0);

      // add grave
      this.grave = new Grave(this, 200, 477, 'object_atlas', 'grave', this.data["grave"]).setOrigin(0.5, 1);

      // tween
      this.addTweens();

      // intro text
      this.introindex = 0;
      this.introText = new Textbox(this, game.config.width / 2, game.config.height / 2 - 20, this.data["intro"][this.introindex++], {
         fontFamily: 'VT323',
         fontSize: '32px',
         fontStyle: 'italic',
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

      // change screen after delay
      this.time.delayedCall(0, () => {
         this.cameras.main.fadeIn(2000);
      }, [], this);

   }

   update(time, delta) {
      // update fps counter
      this.tempFPS.setText("FPS: " + this.game.loop.actualFps.toFixed(2));

      // move clouds
      this.clouds1.tilePositionX -= 1;
      this.clouds2.tilePositionX -= 0.5;

      // go to setting if ESC is pressed
      if (keyESC.isDown) {
         this.scene.pause().launch("settingsScene", { scene: "playScene" });
      }

      // super secret speed hax code
      if (keyTap(keyH)) {
         this.player.runMultiplier = (this.player.runMultiplier == 1.5) ? 8 : 1.5;
      }

      // sets grave the end state if quests are complete
      if (this.questCount == 3 && this.grave.state != "end") {
         this.grave.state = "end";
      }

      if (this.introComplete) {
         // update player
         this.player.update();
         this.grave.update(time, delta);
      } else {
         // update intro text
         if (keyTap(keySpace)) {

            if (this.introindex < this.data["intro"].length) {
               // update text if incomplete
               this.introText.setText(this.data["intro"][this.introindex++]);
            } else {
               // end intro
               console.log("intro complete");
               this.introText.visible = false;
               this.introComplete = true;
               this.npcs.runChildUpdate = true;
            }
         }
      }

      // checks for end states
      if (this.end1 && !this.end2) {

         // if player is in the area of the farm engage in animation here...
         let tomato = this.children.getByName("tomato");
         let carrot = this.children.getByName("carrot");
         let watermelon = this.children.getByName("watermelon");
         this.npcs.runChildUpdate = false;

         if (Phaser.Math.Distance.Between(this.player.x, this.player.y, tomato.x, tomato.y) < 150) {
            // if near tomato show indicator, if space is pressed, start animation
            this.indicator.x = tomato.x;
            this.indicator.y = tomato.y - tomato.height - 25;
            this.indicator.visible = true;
            if (keyTap(keySpace)) this.endingAnimation(tomato);

         } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, carrot.x, carrot.y) < 150) {
            // if near carrot show indicator, if space is pressed, start animation
            this.indicator.x = carrot.x;
            this.indicator.y = carrot.y - carrot.height - 25;
            this.indicator.visible = true;
            if (keyTap(keySpace)) this.endingAnimation(carrot);

         } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, watermelon.x, watermelon.y) < 150) {
            // if near watermelon show indicator, if space is pressed, start animation
            this.indicator.x = watermelon.x;
            this.indicator.y = watermelon.y - watermelon.height - 25;
            this.indicator.visible = true;
            if (keyTap(keySpace)) this.endingAnimation(watermelon);

         } else {
            // hid indicator if player not near crops
            this.indicator.visible = false;
         }
      }

      // update sun and background tween
      this.updateSunTween();

      // update crop tweens
      this.updateCropTween();
   }

   addWorm() {
      // add worm
      this.worms.add(new Worm(this, Phaser.Math.Between(0, game.config.width * 5), Phaser.Math.Between(480, 490), 'object_atlas', 'worm/worm0', this.data["worm"]));
   }

   endingAnimation(target) {
      this.end2 = true;
      console.log("ending");
      this.player.controllable = false;
      this.player.setVelocityX(0);
      this.indicator.visible = false;
      // this code is probably kind of screwy because im not sure what the intergral of the tween is
      let distance = target.x - this.player.x; // distance between center of player and target
      let w = 80; // desired distance away from target
      let duration = 750; // in ms
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
            // water animation
            let waterXPos = (distance < 0) ? this.player.x - 48 : this.player.x + 48;
            let wateringcan = this.add.sprite(waterXPos, this.player.y - 58, 'object_atlas', 'wateringcan/wateringcan0').setOrigin(0.5, 0).setDepth(6);
            wateringcan.flipX = (distance < 0) ? true : false;
            wateringcan.anims.play('wateringcan', true);
            this.water.play({ volume: sfxVol });
         }
      })

      // tween water volume down
      this.tweens.add({
         targets: this.water,
         volume: 0,
         duration: 7375,
      })

      // change screen after delay
      this.time.delayedCall(duration * 4.5, () => {
         this.cameras.main.fadeOut(4000);
         this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("endScene");
            console.log("ending scene");
         });
      }, [], this);
   }

   addTweens() {
      // teddy tween
      this.tweens.add({
         targets: [this.children.getByName("teddy")],
         scaleY: 1.05,
         duration: 1000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // tomato tween
      this.tomatoTween = this.tweens.add({
         targets: [this.children.getByName("tomato")],
         scaleY: 1.05,
         duration: 1000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // walter tween
      this.tweens.add({
         targets: [this.children.getByName("walter")],
         scaleY: 1.03,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // watermelon tween
      this.watermelonTween = this.tweens.add({
         targets: [this.children.getByName("watermelon")],
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
         this.tomatoTween.remove();
         this.tweens.add({
            targets: [this.children.getByName("tomato")],
            scaleX: 1,
            scaleY: 1,
            duration: 100,
         });
         this.tomatoUpdated = true;
      }

      if (this.data["npcs"]["crops"]["watermelon"]["quest_done"] == true && this.watermelonUpdated == false) {
         console.log("water tween stopped");
         this.watermelonTween.remove();
         this.tweens.add({
            targets: this.children.getByName("watermelon"),
            scaleX: 1,
            scaleY: 1,
            duration: 100,
         });
         this.watermelonUpdated = true;
      }
   }
}
