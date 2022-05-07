let config = {
   type: Phaser.AUTO,
   width: 825,
   height: 480,
   physics: {
      default: 'arcade',
   },
   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
   },
   scene: [Load, Menu, Play],
}

// Phaser game object
let game = new Phaser.Game(config);
