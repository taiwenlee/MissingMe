class Item extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, type) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      // set crop properties
      this.interactDistance = 100;  // distance for interaction
      this.type = type;  // name of crop
      this.interactable = true;

      // state variables
      this.Interacting = false;

      // interact indicator
      this.indicator = new Textbox(scene, x, y - this.height * this.scale - 25, "SPACE", {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'center',
      });
      this.indicator.setOrigin(0.5, 1);
      this.indicator.backgroundColor = '0x000000';
      this.indicator.borderColor = '0xffffff';
      this.indicator.visible = false;
      this.indicator.animation = false;
      this.indicator.depth = 6;

      this.itemSound = scene.sound.add('obtainItem', { volume: sfxVol });
   }

   update() {
      if (this.interactable &&
         Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {

         // show indicator if nearby
         if (!this.Interacting) this.indicator.visible = true;

         // check for a key press
         let intKey = keyTap(keySpace);

         if (intKey && !this.Interacting) {

            // initiate interaction
            this.indicator.visible = false;
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.scene.inventory.addItem(this.type, 1);
            this.itemSound.play({ volume: sfxVol });
            this.visible = false;

         } else if (this.Interacting && intKey) {
            // end interaction
            this.scene.player.Interacting = false;
            this.destroy();
            return;
         }

      } else if (this.indicator.visible) {
         // hide indicator if not nearby
         this.indicator.visible = false;
      }

      // quick bug fix for player being out of interact distance
      if (this.Interacting && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > this.interactDistance) {
         (this.scene.player.x > this.x) ? this.scene.player.body.setVelocityX(-10) : this.scene.player.body.setVelocityX(10);
      }
   }
}
