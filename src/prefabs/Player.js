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

      console.log(this.anims);

   }

   update() {
      // basic move player
      if (keyA.isDown && !this.Interacting) {
         this.body.setVelocityX(keyShift.isDown ? -this.runMultiplier * this.speed : -this.speed);
         this.anims.frameRate = keyShift.isDown ? this.runMultiplier * 10 : 10;
      } else if (keyD.isDown && !this.Interacting) {
         this.body.setVelocityX(keyShift.isDown ? this.runMultiplier * this.speed : this.speed);
         this.anims.frameRate = keyShift.isDown ? this.runMultiplier * 10 : 10;
      } else {
         this.body.setVelocityX(0);
         this.anims.pause();
      }

      // flip animation based on direction
      if (this.body.velocity.x > 0) {
         this.flipX = true;
      } else if (this.body.velocity.x < 0) {
         this.flipX = false;
      }

      // play animation
      if (this.overalls) {
         this.anims.play("cleanwalk", true);
      } else {
         this.anims.play("dirtywalk", true);
      }
   }
}
