class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   create() {
      // temp scene indicator text
      const tempText = this.add.text(10, 10, "playScene");

      // controls 
      keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      // add texts
      var cache = this.cache.json;
      this.text = cache.get("text");  

      // add player
      this.player = new Player(this, game.config.width/2, game.config.height/2, 'player', 'run0.png');

      // add camera
      this.cameras.main.setBounds(0, 0, game.config.width * 10, game.config.height);
      this.cameras.main.startFollow(this.player);
 
      // add floor
      this.createFloor();

      // add NPCs
      this.npcs = this.add.group({
         classType: NPC,
         runChildUpdate: true
      });
      this.npcsText = this.text["npcs"];
      this.npc0 = new NPC(this, game.config.width/2, game.config.height - 50, 'npc0', 0, this.npcsText["npc0"]);
      this.npcs.add(this.npc0);


   }

   update() {

      // update player
      this.player.update(this.time, this.delta);


   }

   createFloor() {
      // add floor
      this.floor = this.add.tileSprite(0, game.config.height - 32, game.config.width * 10, 32, 'floor').setOrigin(0, 0);
      this.floor.tileScaleX = .5;
      this.floor.tileScaleY = .5;
      // add to physics
      this.physics.add.existing(this.floor, true);
      this.floor.body.immovable = true;

      // add collision between player and floor
      this.physics.add.collider(this.player, this.floor);
   }
}