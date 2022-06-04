class Villager extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      //this.setScale(0.1);

      this.json = json;

      // set Villager properties
      this.name = json["name"];  // name of Villager
      this.crop = json["crop"];  // crop that Villager is tied to
      this.interactDistance = 150;  // distance for interaction
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
      this.textbox = new Textbox(scene, x, y - this.height * this.scale - 10, "", {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'left'
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;
      this.textbox.backgroundColor = this.json["textbox"]["background_color"];
      this.textbox.borderColor = this.json["textbox"]["border_color"];
      this.textbox.scroll = false;

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
      this.indicator.animation = false;
      this.indicator.depth = 6;

      // sounds
      this.sound1 = scene.sound.add(json["sound"]["start"]);
      this.sound2 = scene.sound.add(json["sound"]["rest"]);
      this.sound3 = scene.sound.add(json["sound"]["beginQuest"]);
      this.sound4 = scene.sound.add(json["sound"]["doneQuest"]);
      this.itemSound = scene.sound.add('obtainItem', { volume: sfxVol });

      // fetch item class group
      this.fetchItems = this.scene.add.group({
         classType: Item,
         runChildUpdate: true
      });
      // add fetch items if necessary
      if (this.questType && "quest_data" in json) {
         for (let i = 0; i < this.json["quest_data"]["locations"].length; i++) {
            let location = this.json["quest_data"]["locations"][i];
            let item = new Item(this.scene, location["x"], location["y"],
               "object_atlas", this.json["quest_data"]["item_type"], this.json["quest_data"]["item_type"]).setOrigin(0.5, 1);
            item.interactable = false;
            this.fetchItems.add(item);

         }
      }

      // item tween
      /*this.scene.tweens.add({
         targets: this.fetchItems.getChildren(),
         scaleY: 1.02,
         duration: 300,
         ease: 'Sine.easeInOut',
         yoyo: true,
         repeat: -1,
      });*/
   }

   update(time, delta) {
      // interaction with player
      if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance
         && this.interactable && this.visible) {
         // show indicator if nearby
         if (!this.Interacting) this.indicator.visible = true;

         let intKey = keyTap(keySpace);
         if (intKey && !this.Interacting && this.interactable) {

            // complete fetch quest if player obtains items
            if (this.questType == "fetch" && this.queststate == "repeatquest"
               && this.scene.inventory.itemName == this.json["quest_data"]["item_type"]
               && this.scene.inventory.itemCount >= this.json["quest_data"]["item_count"]) {
               this.queststate = "completequest";
               console.log(this.queststate);
            }

            // initiate interaction
            this.indicator.visible = false;
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.updateText(this.narratives[this.queststate][this.index++]);
            this.textbox.visible = true;

            // play sound
            this.sound1.play({ volume: sfxVol });

         } else if (this.Interacting && intKey) {

            if (this.index < this.narratives[this.queststate].length || !this.textbox.isComplete()) {
               if (this.textbox.isComplete()) {
                  // use item if quest is a fetch type (rather hard coded)
                  if (this.questType == "fetch" && ("use" in this.narratives[this.queststate][this.index])) {
                     this.scene.inventory.removeItem(1);
                  }

                  // cycles down to next dialogue
                  if (this.narratives[this.queststate][this.index]["type"] == "self") this.sound2.play({ volume: sfxVol });
                  this.updateText(this.narratives[this.queststate][this.index++]);

               } else {
                  // skip animations
                  this.textbox.skip();
               }

            } else {
               // if at end of text, end interaction
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;

               // transitions quest state
               this.questTransition();

               // disables interaction for a bit
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

   // quest transition
   questTransition() {
      // quest state transition (if there was more time, I wouldve detached this from the object)
      if (this.queststate == "quest" && this.questType == "get") {

         // give player item
         if (this.itemCount > 0) this.scene.inventory.addItem(this.item, this.itemCount);
         this.queststate = "repeatquest";
         this.itemSound.play({ volume: sfxVol });
         this.scene.children.getByName(this.crop).queststate = "completequest";

      } else if (this.queststate == "quest" && this.questType == "fetch") {
         // tells player to go fetch items
         this.queststate = "repeatquest";
         this.scene.children.getByName(this.crop).interactable = false;
         this.scene.children.getByName(this.crop).changeTexture();
         this.fetchItems.getChildren().forEach(item => {
            item.interactable = true;
         });
      } else if (this.queststate == "completequest") {
         // if complete state, end quest
         this.queststate = "postquest";
         this.scene.inQuest = false;
         this.scene.questCount++;
         this.sound4.play({ volume: sfxVol });
      }
   }

   // updates textbox with text based on current speaker
   updateText(json) {
      this.textbox.setText(json["text"]);
      if (json["type"] == "self") {
         this.textbox.backgroundColor = this.json["textbox"]["background_color"];
         this.textbox.borderColor = this.json["textbox"]["border_color"];
         this.textbox.x = this.x;
         this.textbox.y = this.y - this.height * this.scale - 20;
         this.textbox.wrapWidth = 400;
         this.textbox.setOrigin(0.5, 1);
         this.textbox.scroll = true;
      } else if (json["type"] == "player") {
         this.textbox.backgroundColor = 0x000000;
         this.textbox.borderColor = 0xffffff;
         this.textbox.x = game.config.width / 2;
         this.textbox.y = 500;
         this.textbox.wrapWidth = 800;
         this.textbox.setOrigin(0.5, 0);
         this.textbox.scroll = false;
      }
   }
}
