class Grave extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      // set crop properties
      this.interactDistance = 100;  // distance for interaction
      this.ending = false;
      this.json = json;
      this.interactable = true;

      // state variables
      this.Interacting = false;
      this.state = "start";
      this.index = 0;            // index for text

      // text object
      this.textbox = new Textbox(scene, game.config.width / 2, 500, this.json[this.state][0], {
         fontFamily: 'VT323',
         fontStyle: 'italic',
         fontSize: '35px',
         color: '#ffffff',
         align: 'left',
      });
      this.textbox.setOrigin(0.5, 0);
      this.textbox.scroll = false;
      this.textbox.visible = false;
      this.textbox.wrapWidth = 800;


      // interact indicator
      this.indicator = new Textbox(scene, x, y - this.height * this.scale - 25, "SPACE", {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'center',
      });
      this.indicator.setOrigin(0.5, 1);
      this.indicator.backgroundColor = 0x000000;
      this.indicator.borderColor = 0xffffff;
      this.indicator.visible = false;
      this.indicator.animation = false;
      this.indicator.depth = 6;
   }

   update(time, delta) {
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
            this.textbox.visible = true;
            this.textbox.setText(this.json[this.state][this.index++]);

         } else if (this.Interacting && intKey) {
            if (this.index < this.json[this.state].length || !this.textbox.isComplete()) {
               // cycles down to next dialogue
               if (this.textbox.isComplete()) {
                  this.textbox.setText(this.json[this.state][this.index++]);
               } else {
                  // skip animations
                  this.textbox.skip();
               }

            } else {
               // end dialogue
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;

               // transitions dialogue
               if (this.state == "start") this.state = "repeat";
               if (this.state == "end") this.scene.end1 = true;

               // disableds interaction for a bit
               if (this.interactable == true) {
                  this.interactable = false;
                  this.scene.time.delayedCall(1000, () => {
                     this.interactable = true;
                  }, [], this);
               }
            }
         }
      } else if (this.indicator.visible) {
         // hide indicator if not nearby
         this.indicator.visible = false;
      }

      // quick bug fix for player being out of interact distance
      if (this.Interacting && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > this.interactDistance) {
         (this.scene.player.x > this.x) ? this.scene.player.body.setVelocityX(-10) : this.scene.player.body.setVelocityX(10);
      }

      // update textbox
      if (this.textbox.visible) this.textbox.update(time, delta);
   }
}
