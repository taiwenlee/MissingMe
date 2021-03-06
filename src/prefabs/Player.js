class Player extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.collideWorldBounds = true;

      // set player properties
      this.depth = 8;
      this.speed = 200;
      this.runMultiplier = 1.8;
      this.overalls = false;
      this.frameRateDivider = 40;
      this.controllable = true;
      this.interactable = true;

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

      // tween
      this.tween = this.scene.tweens.add({
         targets: this,
         scaleY: 1.01,
         duration: 400,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      this.anims.play("dirtywalk", true);
      this.anims.pause(this.anims.currentAnim.frames[0]);
      this.footstep.paused = true;
   }

   update() {
      // basic move player
      if (keyA.isDown && !this.Interacting && this.controllable && !(keyD.isDown && this.body.velocity.x > 0)) {

         // move left
         this.tween.pause();
         this.body.setVelocityX(keyShift.isDown ? -this.runMultiplier * this.speed : -this.speed);

      } else if (keyD.isDown && !this.Interacting && this.controllable && !(keyA.isDown && this.body.velocity.x < 0)) {

         // move right
         this.tween.pause();
         this.body.setVelocityX(keyShift.isDown ? this.runMultiplier * this.speed : this.speed);

      } else if (this.controllable) {

         // slow player down when no keys are pressed
         if (Math.abs(this.body.velocity.x) > 1) {
            this.body.setVelocityX((this.body.velocity.x) * 0.7);
         } else {
            this.body.setVelocityX(0);
         }

         // play idle animation
         this.tween.resume();

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
   // probably a lot of things wrong with it
   playAnimsNSound() {
      if (this.body.velocity.x == 0) {
         // idle
         this.anims.pause();
         this.anims.setCurrentFrame(this.anims.currentAnim.frames[0]);
         this.footstep.paused = true;

      } else if (this.anims.frameRate != (Math.abs(this.body.velocity.x) / this.frameRateDivider)) {
         // player in motion

         // tracker for fps
         this.anims.frameRate = Math.abs(this.body.velocity.x) / this.frameRateDivider; // tracks fps

         // update animation and sound delays (not sure if this is the best way to do it)
         this.anims.msPerFrame = 1000 / (Math.abs(this.body.velocity.x) / this.frameRateDivider);
         this.footstep.delay = 1000 * 2 / (Math.abs(this.body.velocity.x) / this.frameRateDivider);

         // limts fps to a range of 2-100
         if (this.anims.msPerFrame > 500) this.anims.msPerFrame = 500;
         if (this.anims.msPerFrame < 10) this.anims.msPerFrame = 10;
         if (this.footstep.delay > 500) this.footstep.delay = 500;
         if (this.footstep.delay < 10) this.footstep.delay = 10;

         // if previously paused, restart the animation and sound
         if (this.anims.isPaused) {
            this.anims.play(this.currentAnim, true);
            this.footstep.paused = false;
         }
      }
   }

   // change animation
   changeAnim(anim) {
      this.currentAnim = anim;
      this.anims.pause();
      this.anims.play(this.currentAnim, true);
   }

   playFootstep() {
      //this.sound = Math.random() < 0.5 ? this.sound1 : this.sound2;
      this.sound = (this.sound == this.sound1) ? this.sound2 : this.sound1;
      this.sound.play({ volume: sfxVol });
   }
}
