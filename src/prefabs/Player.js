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

      // state variables
      this.Jumping = true;
      this.Interacting = false;

      // foot step sounds
      this.sound1 = scene.sound.add('step1', { volume: sfxVol });
      this.sound2 = scene.sound.add('step2', { volume: sfxVol });

      this.frameRate = 4;
      this.delay = 500;
      this.footstep = this.scene.time.addEvent({
         delay: 500,
         callback: this.playFootstep,
         callbackScope: this,
         loop: true
      });
      this.footstep.paused = true;

      // animations
      this.dirtyWalk = this.anims.create({
         key: "dirtywalk",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'player/dirtywalk/walk', end: 3 }),
         frameRate: this.frameRate,
         repeat: -1
      });

      this.cleanWalk = this.anims.create({
         key: "cleanwalk",
         frames: this.anims.generateFrameNames("object_atlas", { prefix: 'player/cleanwalk/walk', end: 3 }),
         frameRate: this.frameRate,
         repeat: -1
      });

   }

   update() {
      // basic move player
      if (keyA.isDown && !this.Interacting) {
         this.body.setVelocityX(keyShift.isDown ? -this.runMultiplier * this.speed : -this.speed);
         if (keyShift.isDown && this.dirtyWalk.frameRate != this.runMultiplier * this.frameRate) {
            this.dirtyWalk.frameRate = this.runMultiplier * this.frameRate;
            this.cleanWalk.frameRate = this.runMultiplier * this.frameRate;
            this.footstep.delay = this.delay / this.runMultiplier;
            this.anims.pause();
         } else if (!keyShift.isDown && this.dirtyWalk.frameRate != this.frameRate) {
            this.dirtyWalk.frameRate = this.frameRate;
            this.footstep.delay = this.delay;
            this.anims.pause();
         }
         this.footstep.paused = false;
      } else if (keyD.isDown && !this.Interacting) {
         this.body.setVelocityX(keyShift.isDown ? this.runMultiplier * this.speed : this.speed);

         if (keyShift.isDown && this.dirtyWalk.frameRate != this.runMultiplier * this.frameRate) {
            this.dirtyWalk.frameRate = this.runMultiplier * this.frameRate;
            this.cleanWalk.frameRate = this.runMultiplier * this.frameRate;
            this.footstep.delay = this.delay / this.runMultiplier;
            this.anims.pause();
         } else if (!keyShift.isDown && this.dirtyWalk.frameRate != this.frameRate) {
            this.dirtyWalk.frameRate = this.frameRate;
            this.footstep.delay = this.delay;
            this.anims.pause();
         }
         this.footstep.paused = false;
      } else {
         this.body.setVelocityX(0);
         this.footstep.paused = true;
         this.anims.pause();
      }

      // flip animation based on direction
      if (this.body.velocity.x > 0) {
         this.flipX = true;
      } else if (this.body.velocity.x < 0) {
         this.flipX = false;
      }

      if (this.overalls) {
         this.anims.play("cleanwalk", true);
      } else {
         this.anims.play("dirtywalk", true);
      }
   }

   playFootstep() {
      //let sound = Math.random() < 0.5 ? this.sound1 : this.sound2;
      this.sound = (this.sound == this.sound1) ? this.sound2 : this.sound1;
      this.sound.play({ volume: sfxVol });
   }
}
