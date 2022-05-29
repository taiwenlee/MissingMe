let config = {
   type: Phaser.AUTO,
   width: 912,
   height: 608,
   pixelArt: true,
   fps: {
      target: 60,
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
   scene: [Load, Menu, Play, Settings, Credits],
}

// Phaser game object
let game = new Phaser.Game(config);

// controls
let keyA, keyD, keyShift, keySpace;

// background music var
let music;

// set volume
let musicVol = 0.5;
let sfxVol = 0.5;

// returns true once per key press
function keyTap(key) {
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