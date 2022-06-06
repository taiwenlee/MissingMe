class Item extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, type) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      // set crop properties
      this.interactDistance = 100;  // distance for interaction
      this.type = type;  // name of crop
      this.interactable = true;

      // interact indicator
      this.indicator = this.scene.add.image(this.x, this.y - this.height - 10, "object_atlas", "indicator");
      this.indicator.setOrigin(0.5, 1);
      this.indicator.visible = false;
      this.indicator.depth = 6;

      this.scene.tweens.add({
         targets: this.indicator,
         y: this.y - this.height - 20,
         duration: 500,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });

      this.itemSound = scene.sound.add('obtainItem', { volume: sfxVol });
   }

   update() {
      if (this.interactable && this.scene.player.interactable &&
         Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {

         // show indicator if nearby
         this.indicator.visible = true;

         // check for a key press
         let intKey = keyTap(keySpace);

         if (intKey) {
            this.indicator.visible = false;
            this.scene.inventory.addItem(this.type, 1);
            this.itemSound.play({ volume: sfxVol });
            this.destroy();
            return;
         }

      } else if (this.indicator.visible) {
         // hide indicator if not nearby
         this.indicator.visible = false;
      }
   }
}
