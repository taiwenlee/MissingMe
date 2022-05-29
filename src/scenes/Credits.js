class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // bg
        this.background = this.add.image(0, -3570, 'background').setOrigin(0, 0);
        this.background.scale = 1.5;

        // parallax clouds
        this.clouds1 = this.add.tileSprite(0, 0, 912, 608, 'clouds1').setOrigin(0, 0);
        this.clouds2 = this.add.tileSprite(0, 0, 912, 608, 'clouds2').setOrigin(0, 0);

        // temp scene indicator text
        const tempText = this.add.text(10, 10, "creditsScene");

        // select sound
        this.selectSound = this.sound.add('confirm', { volume: sfxVol });

        // back sound
        this.backSound = this.sound.add('back', { volume: sfxVol });

        // hover sound
        this.hoverSound = this.sound.add('hover', { volume: sfxVol });

        // add credits text
        const creditsText = this.add.text(600, 100 + 12, 'CREDITS', { fill: '#6187ff', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        creditsText.depth = 2;

        // add credits image
        const creditsTitle = this.add.image(600, 100, "ui_atlas", 'creditsHover').setOrigin(0.5);
        creditsTitle.depth = 1;

        this.tweens.add({
            targets: [creditsText, creditsTitle],
            x: 300,
            //scaleX: 1.1,
            duration: 3500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });


        this.creditsBG = this.add.image(game.config.width / 2, 305, "ui_atlas", 'creditsBG').setOrigin(0.5);

        this.jake = this.add.text(game.config.width / 2, 270 - 3, 'JAKE INDGIN', { fill: '#fff571', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        this.taiwen = this.add.text(game.config.width / 2, 310 - 3, 'TAI WEN LEE', { fill: '#fff571', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        this.lily = this.add.text(game.config.width / 2, 350 - 3, 'LILY PHAM', { fill: '#fff571', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        this.rachel = this.add.text(game.config.width / 2, 390 - 3, 'RACHEL TRIEU', { fill: '#fff571', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);

        // add exit text
        const exitText = this.add.text(game.config.width / 2, 500 + 12, 'BACK', { fill: '#6187ff', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        exitText.depth = 2;

        // add back hover
        const exitHover = this.add.image(game.config.width / 2, 500, "ui_atlas", 'creditsHover').setOrigin(0.5);
        exitHover.depth = 1;
        exitHover.alpha = 0;

        // exit button
        const exitButton = this.add.image(game.config.width / 2, 500, "ui_atlas", 'credits').setOrigin(0.5);
        exitButton.setInteractive();
        exitButton.on('pointerdown', () => {
            //pause = false;
            this.hoverSound.stop();
            this.backSound.play({ volume: sfxVol });
            this.scene.stop();
            this.scene.resume("menuScene");
        });
        exitButton.on('pointerover', () => { // reveal hover image
            this.hoverSound.play({ volume: sfxVol });
            exitButton.alpha = 0;
            exitHover.alpha = 1;
            exitText.setFill('#fff571');
        });
        exitButton.on('pointerout', () => {  // return og image
            exitButton.alpha = 1;
            exitHover.alpha = 0;
            exitText.setFill('#6187ff');
        });
        exitButton.input.alwaysEnabled = true; // prevents flickering between two images
        exitButton.depth = 1;

    }

    update() {
        // move clouds
        this.clouds1.tilePositionX += 1;
        this.clouds2.tilePositionX += 0.5;
    }
}
