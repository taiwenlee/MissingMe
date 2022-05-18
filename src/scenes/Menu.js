class Menu extends Phaser.Scene {
   constructor() {
      super("menuScene");
   }

   create() {
      // background music
      if(!music) {
         music = this.sound.add('backgroundmusic', {volume: 0.5});
         music.setLoop(true);
         music.play();
      }

      // temp scene indicator text
      const tempText = this.add.text(10, 10, "menuScene");

      // add play text
      const playText = this.add.text(game.config.width/2,  game.config.height/2 + 7, 'Play', {fill: '#f76a8a', fontFamily: 'VT323', fontSize: 40, align: 'center'}).setOrigin(0.5);
      playText.depth = 1;
      
      // add play hover image
      const playHover = this.add.image(game.config.width/2,  game.config.height/2, 'playHover').setOrigin(0.5);
      playHover.alpha = 0;
      //playHover.scale = 0.15; // scaling for the button

      // play button
      const playButton = this.add.image(game.config.width/2, game.config.height/2, 'play').setOrigin(0.5);
      playButton.setInteractive();
      playButton.on('pointerdown', () => {
         this.time.delayedCall(100, () => {
            this.scene.start("playScene");
         });
      });
      playButton.on('pointerover', () => { // reveal hover image
         playButton.alpha = 0;
         playHover.alpha = 1;
         playText.setFill('#fff571');
      });
      playButton.on('pointerout', () => {  // return og image
         playButton.alpha = 1;
         playHover.alpha = 0;
         playText.setFill('#f76a8a');
      });
      playButton.input.alwaysEnabled = true; // prevents flickering between two images
      //playButton.scale = 0.15; // scaling for the button

   }

   update() {

   }
}
