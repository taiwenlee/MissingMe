class Villager extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      //this.setScale(0.1);

      this.json = json;

      // set Villager properties
      this.name = json["name"];  // name of Villager
      this.crop = json["crop"];  // crop that Villager is tied to
      this.interactDistance = 100;  // distance for interaction
      this.narratives = json["narratives"];  // text for interaction
      this.interactable = true;
      this.item = json["item"];  // item to give to player
      this.itemCount = json["item_count"];  // item count to give to player
      this.questType = json["quest_type"];  // quest type

      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text
      this.queststate = "prequest";  // quest state

      //text object
      let firstText = this.narratives[this.queststate][this.index];
      this.textbox = new Textbox(scene, x, y - this.height * this.scale - 10, firstText, {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'left'
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;
      this.textbox.backgroundColor = this.json["textbox"]["background_color"];
      this.textbox.borderColor = this.json["textbox"]["border_color"];

      // interact indicator
      this.indicator = new Textbox(scene, x, y - this.height * this.scale - 25, "SPACE", {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'center',
      });
      this.indicator.setOrigin(0.5, 1);
      this.indicator.backgroundColor = '#ffffff';
      this.indicator.borderColor = this.json["textbox"]["border_color"];
      this.indicator.visible = false;
   }

   update() {
      // basic interact with player (very likely to have major changes)
      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance
         && this.interactable && this.visible) {
         // show indicator if nearby
         if (!this.Interacting) this.indicator.visible = true;
         let intKey = this.keyTap(keySpace);
         if (intKey && !this.Interacting && this.interactable) {
            console.log("Interacting");
            // initiate interaction
            // complete fetch quest if player obtains items
            if (this.questType == "fetch" && this.queststate == "repeatquest"
               && this.scene.inventory.itemName == this.json["quest_data"]["item_type"]
               && this.scene.inventory.itemCount >= this.json["quest_data"]["item_count"]) {
               this.queststate = "completequest";
               console.log(this.queststate);
            }

            this.indicator.visible = false;
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.updateText(this.narratives[this.queststate][this.index++]);
            this.textbox.visible = true;
         } else if (this.Interacting && intKey) {
            // cycles down each interaction text
            if (this.index >= this.narratives[this.queststate].length) {
               // if at end of text, end interaction
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;

               // quest transitions by quest type
               if (this.queststate == "quest" && this.questType == "get") {
                  // give player item
                  if (this.itemCount > 0) this.scene.inventory.addItem(this.item, this.itemCount);
                  this.queststate = "repeatquest";
                  this.scene.children.getByName(this.crop).queststate = "completequest";
               } else if (this.queststate == "quest" && this.questType == "fetch") {
                  // tells player to go fetch items
                  this.queststate = "repeatquest";
                  this.scene.children.getByName(this.crop).visible = false;
                  for (let i = 0; i < this.json["quest_data"]["locations"].length; i++) {
                     let location = this.json["quest_data"]["locations"][i];
                     let item = new Item(this.scene, location["x"], location["y"],
                        this.json["quest_data"]["item_type"], 0, this.json["quest_data"]["item_type"]);
                     console.log(item);
                     this.scene.items.add(item);
                  }
               } else if (this.queststate == "completequest") {
                  this.queststate = "postquest";
                  this.scene.inventory.clear();
                  this.scene.inQuest = false;
                  this.scene.questCount++;
               }

            } else {
               this.updateText(this.narratives[this.queststate][this.index++]);
            }
         }
      } else if (this.indicator.visible) {
         this.indicator.visible = false;
      }
      // update textbox
      this.textbox.update();

      // update indicator
      this.indicator.update();
   }

   // updates textbox
   updateText(json) {
      this.textbox.setText(json["text"]);
      if (json["type"] == "self") {
         this.textbox.backgroundColor = this.json["textbox"]["background_color"];
         this.textbox.borderColor = this.json["textbox"]["border_color"];
         this.textbox.x = this.x;
         this.textbox.y = this.y - this.height * this.scale;
      } else if (json["type"] == "player") {
         this.textbox.backgroundColor = 0x000000;
         this.textbox.borderColor = 0xffffff;
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
