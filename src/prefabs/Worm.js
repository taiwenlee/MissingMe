class Worm extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
      scene.physics.add.existing(this);

      // state
      this.kicked = false;

      // random move timer
      this.timer = scene.time.addEvent({ delay: 1000, callback: this.randomMoveRecursive, callbackScope: this });

      // start animation
      this.anims.play("worm", true);

   }

   randomMoveRecursive() {
      let random = Phaser.Math.Between(10, 30);
      this.body.setVelocityX(Math.random() > 0.5 ? random : -random);
      let delay = Phaser.Math.Between(1000, 5000);
      this.timer = this.scene.time.addEvent({ delay: delay, callback: this.randomMoveRecursive, callbackScope: this });
   }

   update() {
      // close enough and player is moving
      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 50
         && Math.abs(this.scene.player.body.velocity.x) > 200 && !this.kicked) {
         this.kicked = true;
         let direction = this.scene.player.body.velocity.x > 0 ? 1 : -1;
         this.kick(direction);
      }
   }

   kick(direction) {
      this.scene.addWorm();
      let height = 50;
      let duration = 500;
      // change worm y position
      this.scene.tweens.add({
         targets: this,
         y: this.y - height,
         duration: duration * 2 / 3,
         ease: 'sine.easeOut',
         onComplete: () => {
            this.scene.tweens.add({
               targets: this,
               y: this.y + height,
               duration: duration / 3,
               ease: 'sine.easeIn',
            });
         }
      })
      // change worm x position, scale, and alpha
      this.scene.tweens.add({
         targets: this,
         x: this.x + direction * 400,
         scale: 0.5,
         alpha: 0,
         rotation: direction * Math.PI / 2,
         duration: duration,
         ease: 'Linear',
         onComplete: () => {
            this.timer.destroy();
            this.destroy();
         }
      });

   }

}