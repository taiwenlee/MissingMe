class Crop extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, npc, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      this.setScale(0.1);
      this.npc = npc;

      // set crop properties
      this.name = json["name"];  // name of crop
      this.interactDistance = 100;  // distance for interaction
      this.narrative = json["narrative"];  // text for interaction
      this.interactable = true;

      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text

      //text object
      this.textbox = new Textbox(scene, x, y - this.height * this.scale * 2, this.narrative[this.index], {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'center',
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;

      // interact indicator
      this.indicator = scene.add.image(x, y - this.height * this.scale / 2 - 10, "indicator").setOrigin(0.5, 1);
      this.indicator.visible = false;
   }

   update() {

      if(!this.scene.inQuest && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         // show indicator if nearby
         this.indicator.visible = true;
         let intKey = this.keyTap(keySpace);
         if(intKey && !this.Interacting && this.interactable) {
            console.log("Interacting");
            // initiate interaction
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.textbox.visible = true;
            this.textbox.setText(this.narrative[this.index++]);
         } else if(this.Interacting && intKey) {
            // cycles down each interaction text
            if(this.index >= this.narrative.length) {
               // if at end of text, end interaction
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;
               if(this.npc.getQuestState() == 1) {
                  console.log("quest started");
                  this.scene.inQuest = true;
                  this.npc.setQuestState(2);
               }
            } else {
               this.textbox.setText(this.narrative[this.index++]);
            }
         }
      } else if(this.indicator.visible) {
         this.indicator.visible = false;
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
