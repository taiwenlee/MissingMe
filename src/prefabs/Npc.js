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
      let intKey = this.keyTap(keyF);
      if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance
         && intKey && !this.Interacting) {
         this.Interacting = true;
         this.scene.player.Interacting = true;
         console.log("interact");
      } else if(this.Interacting && intKey) {
         console.log("stop interact");
         this.scene.player.Interacting = false;
         this.Interacting = false;
      }

   }

   // checks if key is pressed down then released
   keyTap(key) {
      if(key.holding == null) {
         key.holding = false;
      }
      if(key.isUp) {
         key.holding = false;
         return false;
      } else if(key.isDown && !key.holding) {
         key.holding = true;
         return true;
      } else {
         return false;
      }
   }
}