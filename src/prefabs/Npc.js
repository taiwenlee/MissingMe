class NPC extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      this.setScale(0.1);

      // crop object
      this.crop = new Crop(scene, 80, y, texture, 0, this, json["crop"]);

      // set NPC properties
      this.name = json["name"];  // name of NPC
      this.interactDistance = 100;  // distance for interaction
      this.narratives = json["narratives"];  // text for interaction
      this.interactable = true;
      this.item = json["item"];  // item to give to player
      this.itemCount = json["item_count"];  // item count to give to player
      
      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text
      this.queststate = "prequest";  // quest state

      //text object
      let firstText = this.narratives[this.queststate][this.index];
      this.textbox = new Textbox(scene, x, y - this.height * this.scale * 2, firstText, {
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
      // basic interact with player (very likely to have major changes)
      if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         // show indicator if nearby
         this.indicator.visible = true;
         let intKey = this.keyTap(keySpace);
         if(intKey && !this.Interacting && this.interactable) {
            console.log("Interacting");
            // initiate interaction
            this.Interacting = true;
            this.scene.player.Interacting = true;
            if(this.getQuestState() == 3
               && this.scene.inventory.itemName == this.item 
               && this.scene.inventory.itemCount == this.itemCount) {
               // complete quest if player has item
               this.scene.inventory.clear();
               this.scene.inQuest = false;
               this.setQuestState(4);
            }
            this.textbox.setText(this.narratives[this.queststate][this.index++]);
            this.textbox.visible = true;
         } else if(this.Interacting && intKey) {
            // cycles down each interaction text
            if(this.index >= this.narratives[this.queststate].length) {
               // if at end of text, end interaction
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;
               if(this.getQuestState() == 2 || this.getQuestState() == 4) {
                  this.setQuestState(this.getQuestState() + 1);
               }
            } else {
               this.textbox.setText(this.narratives[this.queststate][this.index++]);
            }
         }
      } else if(this.indicator.visible) {
         this.indicator.visible = false;
      }
      // update textbox
      this.textbox.update();

      // update crop
      this.crop.update();
   }

   // update quest state
   setQuestState(state) {
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

   // return quest state as int
   getQuestState() {
      switch(this.queststate) {
         case "prequest":
            return 1;
         case "quest":
            return 2;
         case "repeatquest":
            return 3;
         case "completequest":
            return 4;
         case "postquest":
            return 5;
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
