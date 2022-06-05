class End extends Phaser.Scene {
   constructor() {
      super("endScene");
   }

   create() {
      // bg
      this.yellowBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xe3d8a3).setOrigin(0, 0);
      this.yellowBackground.depth = -1;

      // parallax clouds
      this.clouds1 = this.add.tileSprite(0, 0, 912, 608, 'clouds1').setOrigin(0, 0);
      this.clouds2 = this.add.tileSprite(0, 0, 912, 608, 'clouds2').setOrigin(0, 0);

      // temp scene indicator text
      //const tempText = this.add.text(10, 10, "endScene");

      // play sound
      this.playSound = this.sound.add('play', { volume: sfxVol });

      // hover sound
      this.hoverSound = this.sound.add('hover', { volume: sfxVol });

      // add floor
      this.createFloor();

      // sun
      this.sun = this.add.image(-128, 100, 'object_atlas', "sun").setOrigin(0.5, 0.5);
      this.sun.depth = -0.5;

      // add ending card
      this.endTitle = this.add.image(game.config.width / 2, 235, "ui_atlas", 'ending').setOrigin(0.5);

      // add characters
      this.mc = this.add.image(game.config.width - 50, 482, "object_atlas", 'player/cleanwalk/walk0').setOrigin(0.5, 1);
      this.corrine = this.add.image(50, 482, "object_atlas", 'corrine').setOrigin(0.5, 1);
      this.teddy = this.add.image(game.config.width / 2 + 280, 482, "object_atlas", 'teddy').setOrigin(0.5, 1);
      this.teddy.flipX = true;
      this.walter = this.add.image(game.config.width / 2 - 280, 482, "object_atlas", 'walter').setOrigin(0.5, 1);
      this.walter.flipX = true;
      this.carrot = this.add.image(game.config.width / 2, 477, "object_atlas", 'carrot').setOrigin(0.5, 1);
      this.tomato = this.add.image(game.config.width / 2 - 150, 477, "object_atlas", 'tomato').setOrigin(0.5, 1);
      this.watermelon = this.add.image(game.config.width / 2 + 150, 477, "object_atlas", 'watermelon').setOrigin(0.5, 1);

      // tween characters
      this.addTweens();

      // add menu text
      const menuText = this.add.text(game.config.width / 2, 375 + 12, 'MENU', { fill: '#f76a8a', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
      menuText.depth = 2;

      // add back hover
      const menuHover = this.add.image(game.config.width / 2, 375, "ui_atlas", 'playHover').setOrigin(0.5);
      menuHover.depth = 1;
      menuHover.alpha = 0;

      // exit button
      const menuButton = this.add.image(game.config.width / 2, 375, "ui_atlas", 'play').setOrigin(0.5);
      menuButton.setInteractive();
      menuButton.on('pointerdown', () => {
         //pause = false;
         this.hoverSound.stop();
         this.playSound.play({ volume: sfxVol });
         this.scene.stop();
         this.scene.start("menuScene");
      });
      menuButton.on('pointerover', () => { // reveal hover image
         this.hoverSound.play({ volume: sfxVol });
         menuButton.alpha = 0;
         menuHover.alpha = 1;
         menuText.setFill('#fff571');
      });
      menuButton.on('pointerout', () => {  // return og image
         menuButton.alpha = 1;
         menuHover.alpha = 0;
         menuText.setFill('#f76a8a');
      });
      menuButton.input.alwaysEnabled = true; // prevents flickering between two images
      menuButton.depth = 1;

      //add creatures
      this.creatures = this.add.group({
         runChildUpdate: true,
      });
      for (let i = 0; i < 3; i++) {
         this.creatures.add(new Bird(this, Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(30, 300), 'object_atlas', 'bird/bird0', this.data["bird"]).setDepth(-1));
      }

      // change screen after delay
      this.time.delayedCall(0, () => {
         this.cameras.main.fadeIn(4000);
      }, [], this);    
   }

   update() {
      // move clouds
      this.clouds1.tilePositionX -= 1;
      this.clouds2.tilePositionX -= 0.5;
   }

   createFloor() {
      // add floor
      this.floor = this.add.tileSprite(0, game.config.height - 132, 912, 132, "object_atlas", 'floor').setOrigin(0, 0);

      // add to physics
      this.physics.add.existing(this.floor, true);
      this.floor.body.immovable = true;

      // add collision between player and floor
      this.physics.add.collider(this.player, this.floor);
   }

   addTweens() {
      // teddy tomato tween
      this.tweens.add({
         targets: [this.teddy, this.tomato],
         scaleY: 1.05,
         duration: 1000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // walter watermelon tween
      this.tweens.add({
         targets: [this.walter, this.watermelon],
         scaleY: 1.03,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // corrine carrot tween
      this.tweens.add({
         targets: [this.corrine, this.carrot],
         scaleY: 1.02,
         duration: 300,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // mc tween
      this.tweens.add({
         targets: this.mc,
         scaleY: 1.01,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // tween end card
      this.tweens.add({
         targets: this.endTitle,
         y: 260,
         duration: 2000,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      // sun tween
      this.tweens.add({
         targets: this.sun,
         x: 912 + 128,
         angle: 360,
         duration: 20000,
         repeat: -1,
      });
   }
}

