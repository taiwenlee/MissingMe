let config = {
   type: Phaser.AUTO,
   width: 912,
   height: 608,
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
