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

   update() {
      // if out of bounds, wrap around
      if (this.x > this.scene.physics.world.bounds.width) {
         this.x = 0;
      } else if (this.x < 0) {
         this.x = this.scene.physics.world.bounds.width;
      }
   }

}