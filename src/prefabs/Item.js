class Item extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, type) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      // set crop properties
      this.interactDistance = 100;  // distance for interaction
      this.type = type;  // name of crop

      // state variables
      this.Interacting = false;

      // text object
      this.textbox = new Textbox(scene, x, y - this.height * this.scale * 2, "You obtained item!", {
         fontFamily: 'VT323',
         fontSize: '40px',
         color: '#FFFFFF',
         align: 'center',
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;
      this.textbox.animation = false;

      // interact indicator
      this.indicator = scene.add.image(x, y - this.height * this.scale / 2 - 10, "indicator").setOrigin(0.5, 1);
      this.indicator.visible = false;
      this.indicator.animation = false;

      this.itemSound = scene.sound.add('obtainItem', { volume: sfxVol });
   }

   update() {
      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         // show indicator if nearby
         if (!this.Interacting) this.indicator.visible = true;
         let intKey = keyTap(keySpace);
         if (intKey && !this.Interacting) {
            // initiate interaction
            this.indicator.visible = false;
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.textbox.visible = true;
            this.textbox.setText("You obtained item!");
            this.scene.inventory.addItem(this.type, 1);
            this.itemSound.play();
            this.visible = false;
         } else if (this.Interacting && intKey) {
            this.scene.player.Interacting = false;
            this.textbox.destroy();
            this.destroy();
         }
      } else if (this.indicator.visible) {
         this.indicator.visible = false;
      }

      // update textbox
      this.textbox.update();
   }
}
