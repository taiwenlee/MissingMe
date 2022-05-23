class Menu extends Phaser.Scene {
   constructor() {
      super("menuScene");
   }

   create() {
      // background music
      if(!music) {
         music = this.sound.add('backgroundmusic', {volume: musicVol});
         music.setLoop(true);
         music.play();
      }

      // hover sound
      this.hoverSound = this.sound.add('hover', {volume: sfxVol});

      // play sound
      this.playSound = this.sound.add('play', {volume: sfxVol});

      // select sound
      this.selectSound = this.sound.add('confirm', {volume: sfxVol});

      // temp scene indicator text
      const tempText = this.add.text(10, 10, "menuScene");

      // add play text
      const playText = this.add.text(game.config.width/2,  game.config.height/2 + 12, 'PLAY', {fill: '#f76a8a', fontFamily: 'VT323', fontSize: 40, align: 'center'}).setOrigin(0.5);
      playText.depth = 1;
      
      // add play hover image and watering can
      const playHover = this.add.image(game.config.width/2,  game.config.height/2, 'playHover').setOrigin(0.5);
      playHover.alpha = 0;
      const selectPlay = this.add.image(game.config.width/2 - 35,  game.config.height/2 - 70, 'select').setOrigin(0.5);
      selectPlay.alpha = 0;

      // play button
      const playButton = this.add.image(game.config.width/2, game.config.height/2, 'play').setOrigin(0.5);
      playButton.setInteractive();
      playButton.on('pointerdown', () => {
         this.hoverSound.stop();
         this.playSound.play({volume: sfxVol});
         this.time.delayedCall(100, () => {
            this.scene.start("playScene");
         });
      });
      playButton.on('pointerover', () => { // reveal hover image
         this.hoverSound.play({volume: sfxVol});
         playButton.alpha = 0;
         playHover.alpha = 1;
         selectPlay.alpha = 1;
         playText.setFill('#fff571');
      });
      playButton.on('pointerout', () => {  // return og image
         playButton.alpha = 1;
         playHover.alpha = 0;
         selectPlay.alpha = 0;
         playText.setFill('#f76a8a');
      });
      playButton.input.alwaysEnabled = true; // prevents flickering between two images

      // add settings text
      const settingsText = this.add.text(game.config.width/2 - 200,  game.config.height/2 + 12, 'SETTINGS', {fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center'}).setOrigin(0.5);
      settingsText.depth = 1;
      
      // add settings hover image and watering can
      const settingsHover = this.add.image(game.config.width/2 - 200,  game.config.height/2, 'settingsHover').setOrigin(0.5);
      settingsHover.alpha = 0;
      const selectSettings = this.add.image(game.config.width/2 - 200 - 35,  game.config.height/2 - 70, 'select').setOrigin(0.5);
      selectSettings.alpha = 0;

      // settings button
      const settingsButton = this.add.image(game.config.width/2 - 200, game.config.height/2, 'settings').setOrigin(0.5);
      settingsButton.setInteractive();
      settingsButton.on('pointerdown', () => {
         this.hoverSound.stop();
         this.selectSound.play({volume: sfxVol});
         this.scene.pause().launch("settingsScene");
      });
      settingsButton.on('pointerover', () => { // reveal hover image
         this.hoverSound.play({volume: sfxVol});
         settingsButton.alpha = 0;
         settingsHover.alpha = 1;
         selectSettings.alpha = 1;
         settingsText.setFill('#fff571');
      });
      settingsButton.on('pointerout', () => {  // return og image
         settingsButton.alpha = 1;
         settingsHover.alpha = 0;
         selectSettings.alpha = 0;
         settingsText.setFill('#b480ef');
      });
      settingsButton.input.alwaysEnabled = true; // prevents flickering between two images

      // add credits text
      const creditsText = this.add.text(game.config.width/2 + 200,  game.config.height/2 + 12, 'CREDITS', {fill: '#6187ff', fontFamily: 'VT323', fontSize: 35, align: 'center'}).setOrigin(0.5);
      creditsText.depth = 1;
      
      // add credits hover image and watering can
      const creditsHover = this.add.image(game.config.width/2 + 200,  game.config.height/2, 'creditsHover').setOrigin(0.5);
      creditsHover.alpha = 0;
      const selectCredits = this.add.image(game.config.width/2 + 200 - 35,  game.config.height/2 - 70, 'select').setOrigin(0.5);
      selectCredits.alpha = 0;

      // credits button
      const creditsButton = this.add.image(game.config.width/2 + 200, game.config.height/2, 'credits').setOrigin(0.5);
      creditsButton.setInteractive();
      creditsButton.on('pointerdown', () => {
         this.hoverSound.stop();
         this.selectSound.play({volume: sfxVol});
         this.scene.pause().launch("creditsScene");
      });
      creditsButton.on('pointerover', () => { // reveal hover image
         this.hoverSound.play({volume: sfxVol});
         creditsButton.alpha = 0;
         creditsHover.alpha = 1;
         selectCredits.alpha = 1;
         creditsText.setFill('#fff571');
      });
      creditsButton.on('pointerout', () => {  // return og image
         creditsButton.alpha = 1;
         creditsHover.alpha = 0;
         selectCredits.alpha = 0;
         creditsText.setFill('#6187ff');
      });
      creditsButton.input.alwaysEnabled = true; // prevents flickering between two images

   }
}
