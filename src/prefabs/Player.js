class Player extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.collideWorldBounds = true;

      // set player properties
      this.depth = 8;
      this.speed = 200;
      this.runMultiplier = 1.5;
      this.overalls = false;
      this.frameRateDivider = 50;

      // state variables
      this.Jumping = true;
      this.Interacting = false;

      // foot step sounds
      this.sound1 = scene.sound.add('step1', { volume: sfxVol });
      this.sound2 = scene.sound.add('step2', { volume: sfxVol });

      this.footstep = this.scene.time.addEvent({
         delay: 0,
         callback: this.playFootstep,
         callbackScope: this,
         loop: true
      });

      // animations
      this.currentAnim = 'dirtywalk';
      this.dirtyWalk = this.anims.create({
         key: "dirtywalk",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'player/dirtywalk/walk', end: 3 }),
         frameRate: 0,
         repeat: -1
      });

      this.cleanWalk = this.anims.create({
         key: "cleanwalk",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'player/cleanwalk/walk', end: 3 }),
         frameRate: 0,
         repeat: -1
      });

      this.anims.play("dirtywalk", true);

      console.log(this);
   }

   update() {
      // basic move player
      if (keyA.isDown && !this.Interacting) {
         // move left
         this.body.setVelocityX(keyShift.isDown ? -this.runMultiplier * this.speed : -this.speed);
      } else if (keyD.isDown && !this.Interacting) {
         // move right
         this.body.setVelocityX(keyShift.isDown ? this.runMultiplier * this.speed : this.speed);
      } else {
         // stop
         this.body.setVelocityX(0);
      }

      // plays animation and sound at the right rate
      this.playAnimsNSound();

      // flip animation based on direction
      if (this.body.velocity.x > 0) {
         this.flipX = true;
      } else if (this.body.velocity.x < 0) {
         this.flipX = false;
      }
   }

   // plays animation and sound at the right rate
   playAnimsNSound() {
      if (Math.abs(this.body.velocity.x) / this.frameRateDivider != this.dirtyWalk.frameRate) {
         this.dirtyWalk.frameRate = Math.abs(this.body.velocity.x) / this.frameRateDivider;
         this.cleanWalk.frameRate = Math.abs(this.body.velocity.x) / this.frameRateDivider;
         this.footstep.delay = 1000 * 2 / (Math.abs(this.body.velocity.x) / this.frameRateDivider);
         this.anims.pause();
         this.anims.play(this.currentAnim, true);
      }
   }

   // change animation
   changeAnim(anim) {
      this.currentAnim = anim;
      this.anims.pause();
      this.anims.play(this.currentAnim, true);
   }

   playFootstep() {
      //let sound = Math.random() < 0.5 ? this.sound1 : this.sound2;
      this.sound = (this.sound == this.sound1) ? this.sound2 : this.sound1;
      this.sound.play({ volume: sfxVol });
   }
}
