class NPC extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, text) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      this.setScale(0.1);

      // set NPC properties
      this.interactDistance = 100;  // distance for interaction
      this.interactText = text["interaction"];  // text for interaction

      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text

      //text object
      let firstText = this.interactText[this.index]["text"];
      this.textbox = new Textbox(scene, x, y - this.height * this.scale, firstText, {
         fontFamily: 'Arial',
         fontSize: '32px',
         color: '#ffffff',
         align: 'center',
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;

   }

   update() {
      // basic interact with player (very likely to have major changes)
      if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         let intKey = this.keyTap(keyF);
         if(intKey && !this.Interacting) {
            console.log("Interacting");
            // initiate interaction
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.textbox.visible = true;
            this.textbox.setText(this.interactText[this.index++]["text"]);
         } else if(this.Interacting && intKey) {
            // cycles down each interaction text
            if(this.index >= this.interactText.length) {
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;
            } else {
               this.textbox.setText(this.interactText[this.index++]["text"]);
            }
         }
      }


      // update textbox
      this.textbox.update();
   }

   // returns true once per key press
   keyTap(key) {
      // added a holding var to key for tap logic
      if(key.holding == null) {
         key.holding = false;
      }
      
      if(key.isUp && key.holding) { // if key is up reset holding
         key.holding = false;
         return false;
      } else if(key.isDown && !key.holding) {   // register first down press
         key.holding = true;
         return true;
      } else{ // if holding or already reset
         return false;
      } 
   }
}