class NPC extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      this.setScale(0.1);

      // set NPC properties
      this.name = json["name"];  // name of NPC
      this.interactDistance = 100;  // distance for interaction
      this.narratives = json["narratives"];  // text for interaction
      this.interactable = true;
      this.item = json["item"];  // item to give to player
      
      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text
      this.queststate = "prequest";  // quest state

      //text object
      this.narrative = this.narratives[this.queststate];
      let firstText = this.narrative[this.index];
      this.textbox = new Textbox(scene, x, y - this.height * this.scale, firstText, {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'center',
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;

      // interact indicator
      this.indicator = scene.add.image(x, y - this.height * this.scale, "indicator").setOrigin(0.5);
      this.indicator.visible = false;
      this.indicator.setScale(0.5);

   }

   update() {
      // basic interact with player (very likely to have major changes)
      if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         // show indicator if nearby
         this.indicator.visible = true;
         let intKey = this.keyTap(keyF);
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

   // update quest state
   updateQuestState(state) {
      switch(state) {
         case 1:
            this.queststate = "prequest";
            break;
         case 2:
            this.queststate = "quest";
            break;
         case 3:
            this.queststate = "repeatquest";
            break;
         case 4:
            this.queststate = "completequest";
            break;
         case 5:
            this.queststate = "postquest";
            break;
         default:
            console.log("Error: invalid quest state");
      }
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