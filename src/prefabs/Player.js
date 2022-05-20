class Player extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.collideWorldBounds = true;

      this.setScale(0.2);

      // set player properties
      this.depth = 10;
      this.speed = 300;
      this.jumpSpeed = 200;

      // state variables
      this.Jumping = true;
      this.Interacting = false;

   }

   update() {
      // basic move player
      if(keyA.isDown && !this.Interacting) {
         this.body.setVelocityX(-this.speed);
      } else if(keyD.isDown && !this.Interacting) {
         this.body.setVelocityX(this.speed);
      } else {
         this.body.setVelocityX(0);
      }

      /*// basic jump
      if(keySpace.isDown && !this.Jumping && !this.Interacting) {
         this.Jumping = true;
         this.body.setVelocityY(-this.jumpSpeed);
      } else if(this.body.touching.down) {
         this.Jumping = false;
      } else {
         this.Jumping = true;
      }*/


      // flip animation based on direction
      if(this.body.velocity.x > 0) {
         this.flipX = false;
      } else if(this.body.velocity.x < 0) {
         this.flipX = true;
      }

      // play animation
      this.anims.play('run', true);
   }
}
