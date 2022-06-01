class Crop extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, json) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);

      this.json = json;

      // set crop properties
      this.name = json["name"];  // name of crop
      this.interactDistance = 150;  // distance for interaction
      this.narratives = json["narratives"];  // text for interaction
      this.interactable = true;
      this.villager = json["villager"];
      this.questType = json["quest_type"];
      this.sound = json["sound"]; // sfx

      // state variables
      this.Interacting = false;
      this.index = 0;            // index for text
      this.queststate = "quest";  // quest state

      //text object
      this.textbox = new Textbox(scene, x, y - this.height * this.scale, "", {
         fontFamily: 'VT323',
         fontSize: '32px',
         color: '#ffffff',
         align: 'left',
      });
      this.textbox.setOrigin(0.5, 1);
      this.textbox.visible = false;
      this.textbox.backgroundColor = this.json["textbox"]["background_color"];
      this.textbox.borderColor = this.json["textbox"]["border_color"];
      this.textbox.scroll = false;
      this.textbox.update();

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
      this.indicator.update();

      // sounds
      this.sound1 = scene.sound.add(json["sound"]["start"]);
      this.sound2 = scene.sound.add(json["sound"]["rest"]);
      this.sound3 = scene.sound.add(json["sound"]["beginQuest"]);
      this.sound4 = scene.sound.add(json["sound"]["doneQuest"]);
   }

   update() {

      if (this.interactable && !(this.scene.inQuest && this.queststate == "quest") && this.visible
         && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < this.interactDistance) {
         // show indicator if nearby
         if (!this.Interacting) this.indicator.visible = true;

         let intKey = keyTap(keySpace);
         if (intKey && !this.Interacting && this.interactable) {

            // initiate interaction
            this.indicator.visible = false;
            this.Interacting = true;
            this.scene.player.Interacting = true;
            this.textbox.visible = true;
            this.updateText(this.narratives[this.queststate][this.index++]);
            this.sound1.play();

         } else if (this.Interacting && intKey) {

            if (this.index >= this.narratives[this.queststate].length && this.textbox.isComplete()) {
               // if at end of text, end interaction
               this.scene.player.Interacting = false;
               this.Interacting = false;
               this.textbox.visible = false;
               this.index = 0;

               // quest state transition (if there was more time, I wouldve detached this from the object)
               if (this.scene.children.getByName(this.villager).queststate == "prequest") {
                  // start quest
                  console.log("quest started");
                  this.scene.inQuest = true;
                  this.scene.children.getByName(this.villager).queststate = "quest";
                  this.queststate = "repeatquest";
                  this.sound3.play();
               } else if (this.queststate == "completequest") {
                  // completes quest
                  this.scene.inQuest = false;
                  this.scene.children.getByName(this.villager).queststate = "postquest";
                  this.interactable = false;
                  this.json["quest_done"] = true;
                  this.scene.questCount++;
                  this.sound4.play();
                  this.changeTexture();
               }
               if (this.interactable == true) {
                  this.interactable = false;
                  this.scene.time.delayedCall(1000, () => {
                     this.interactable = true;
                  }, [], this);
               }

            } else {
               if (this.textbox.isComplete()) {
                  // use item if quest is a get type (rather hard coded to work for overalls)
                  if (this.questType == "get" && ("use" in this.narratives[this.queststate][this.index])) {
                     if (this.narratives[this.queststate][this.index]["use"] == "overalls") this.scene.player.changeAnim("cleanwalk");

                     this.scene.inventory.removeItem(1);
                  }

                  // cycles down to next dialog
                  if (this.narratives[this.queststate][this.index]["type"] == "self") this.sound2.play();
                  this.updateText(this.narratives[this.queststate][this.index++]);
               } else {
                  // skip animations
                  this.textbox.skip();
               }
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

   // changes to alternate texture
   changeTexture() {
      this.setTexture("object_atlas", this.json["alt_texture"]);
   }

   // updates textbox
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
         this.textbox.y = this.scene.player.y + this.scene.player.height * this.scene.player.scale / 2 + 10;
         this.textbox.wrapWidth = 800;
         this.textbox.setOrigin(0.5, 0);
         this.textbox.scroll = false;
      }
   }
}
