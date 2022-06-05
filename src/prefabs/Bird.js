class Bird extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
      scene.physics.add.existing(this);

      // set velocity
      this.setVelocityX(100);

      // start animation
      this.anims.play("bird", true);

   }

   randomMoveRecursive() {
      let random = Phaser.Math.Between(10, 30);
      this.body.setVelocityX(Math.random() > 0.5 ? random : -random);
      let delay = Phaser.Math.Between(1000, 5000);
      this.timer = this.scene.time.addEvent({ delay: delay, callback: this.randomMoveRecursive, callbackScope: this });
   }

   update() {
      // if out of bounds, wrap around
      if (this.x > this.scene.physics.world.bounds.width) {
         this.x = 0;
      } else if (this.x < 0) {
         this.x = this.scene.physics.world.bounds.width;
      }
   }

}