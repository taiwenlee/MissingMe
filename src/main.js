let config = {
   type: Phaser.AUTO,
   width: 912,
   height: 608,
   pixelArt: true,
   fps: {
      target: 30,
      forceSetTimeOut: true
    },
   physics: {
      default: 'arcade',
      arcade: {
         gravity: { y: 200 },
         debug: true
      }
   },
   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
   },
   scene: [Load, Menu, Play],
}

// Phaser game object
let game = new Phaser.Game(config);

// controls
let keyA, keyD, keyW, keyS, keyF, keySpace;

// background music var
let music;