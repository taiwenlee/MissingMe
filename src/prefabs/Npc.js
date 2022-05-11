class NPC extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      
      this.setScale(0.1);

      // set NPC properties
      this.interactDistance = 100;  // distance for interaction

      // state variables
      this.Interacting = false;

   }

   update() {
      // basic interact with player (very likely to have major changes)
      if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance
         && keyF.isDown && !this.Interacting) {
         this.Interacting = true;
         this.scene.player.Interacting = true;
         console.log("interact");
      } else if(this.Interacting && !keyF.isDown) {
         this.scene.player.Interacting = false;
         this.Interacting = false;
      }

   }
}