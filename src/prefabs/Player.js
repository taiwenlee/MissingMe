class Player extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.setScale(0.2);

   }

   update(time, delta) {
      // basic move player
      if(keyA.isDown) {
         this.body.setVelocityX(-200);
      } else if(keyD.isDown) {
         this.body.setVelocityX(200);
      } else {
         this.body.setVelocityX(0);
      }

      // basic jump
      if(keyW.isDown) {
         this.body.setVelocityY(-100);
      }

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
