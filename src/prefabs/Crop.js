class Crop extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      this.setScale(0.1);

      // set crop properties
      this.name = json["name"];  // name of crop
      this.interactDistance = 100;  // distance for interaction
      this.narratives = json["narratives"];  // text for interaction
      this.interactable = true;
      this.villager = json["villager"];
      this.questType = json["quest_type"];

      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text
      this.queststate = "quest";  // quest state

      //text object
      this.textbox = new Textbox(scene, x, y - this.height * this.scale * 2, this.narratives[this.queststate][this.index], {
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

      if (this.interactable && !(this.scene.inQuest && this.queststate == "quest")
         && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         // show indicator if nearby
         this.indicator.visible = true;
         let intKey = this.keyTap(keySpace);
         if (intKey && !this.Interacting && this.interactable) {
            console.log("Interacting");
            // initiate interaction
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.textbox.visible = true;
            this.updateText(this.narratives[this.queststate][this.index++]);
         } else if (this.Interacting && intKey) {
            // cycles down each interaction text
            if (this.index >= this.narratives[this.queststate].length) {
               // if at end of text, end interaction
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;
               // state transition
               if (this.scene.children.getByName(this.villager).queststate == "prequest") {
                  console.log("quest started");
                  this.scene.inQuest = true;
                  this.scene.children.getByName(this.villager).queststate = "quest";
                  this.queststate = "repeatquest";
               } else if (this.queststate == "completequest") {
                  this.scene.inQuest = false;
                  this.scene.children.getByName(this.villager).queststate = "postquest";
                  this.interactable = false;
                  // depending on quest type, do something
                  if (this.questType == "get") {
                     this.scene.inventory.clear();
                     console.log("get complete");
                  }
               }
            } else {
               console.log(this.narratives[this.queststate][this.index]);
               this.updateText(this.narratives[this.queststate][this.index++]);
            }
         }
      } else if (this.indicator.visible) {
         this.indicator.visible = false;
      }
      // update textbox
      this.textbox.update();
   }

   // updates textbox
   updateText(json) {
      this.textbox.setText(json["text"]);
      if (json["type"] == "self") {
         this.textbox.x = this.x;
         this.textbox.y = this.y - this.height * this.scale;
      } else if (json["type"] == "player") {
         this.textbox.x = this.scene.player.x;
         this.textbox.y = this.scene.player.y - this.scene.player.height * this.scene.player.scale;
      }
   }

   // returns true once per key press
   keyTap(key) {
      // added a holding var to key for tap logic
      if (key.holding == null) {
         key.holding = false;
      }

      if (key.isUp && key.holding) { // if key is up reset holding
         key.holding = false;
         return false;
      } else if (key.isDown && !key.holding) {   // register first down press
         key.holding = true;
         return true;
      } else { // if holding or already reset
         return false;
      }
   }
}
