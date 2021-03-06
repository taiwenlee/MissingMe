class Settings extends Phaser.Scene {
    constructor() {
        super("settingsScene");
    }

    create(data) {
        // bg
        this.blueBackground = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x3a4d99).setOrigin(0, 0);

        // parallax clouds
        this.clouds1 = this.add.tileSprite(0, 0, 912, 608, 'clouds1').setOrigin(0, 0);
        this.clouds2 = this.add.tileSprite(0, 0, 912, 608, 'clouds2').setOrigin(0, 0);

        // temp scene indicator text
        //const tempText = this.add.text(10, 10, "ui_atlas", "settingsScene");

        // select sound
        this.selectSound = this.sound.add('confirm', { volume: sfxVol });

        // back sound
        this.backSound = this.sound.add('back', { volume: sfxVol });

        // hover sound
        this.hoverSound = this.sound.add('hover', { volume: sfxVol });

        // music vol text
        this.musicVolText = this.add.text(270 + 75, 245 + 12, (musicVol * 100).toFixed(0), { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'right' }).setOrigin(1, 0.5);
        this.musicVolText.depth = 2;

        // sfx vol text
        this.sfxVolText = this.add.text(270 + 75, 360 + 12, (sfxVol * 100).toFixed(0), { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'right' }).setOrigin(1, 0.5);
        this.sfxVolText.depth = 2;

        // add settings text
        const settingsText = this.add.text(300, 100 + 12, 'SETTINGS', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        settingsText.depth = 2;

        // add settings image
        const settingsTitle = this.add.image(300, 100, "ui_atlas", 'settingsHover').setOrigin(0.5);
        settingsTitle.depth = 1;

        this.tweens.add({
            targets: [settingsText, settingsTitle],
            x: 600,
            //scaleX: 1.1,
            duration: 3500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        // add exit text
        const exitText = this.add.text(game.config.width / 2, 500 + 12, 'BACK', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        exitText.depth = 2;

        // add back hover
        const exitHover = this.add.image(game.config.width / 2, 500, "ui_atlas", 'settingsHover').setOrigin(0.5);
        exitHover.depth = 1;
        exitHover.alpha = 0;

        // exit button
        const exitButton = this.add.image(game.config.width / 2, 500, "ui_atlas", 'settings').setOrigin(0.5);
        exitButton.setInteractive();
        exitButton.on('pointerdown', () => {
            //pause = false;
            this.hoverSound.stop();
            this.backSound.play({ volume: sfxVol });
            this.scene.resume(data["scene"]).stop();
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
            exitText.setFill('#b480ef');
        });
        exitButton.input.alwaysEnabled = true; // prevents flickering between two images
        exitButton.depth = 1;

        // music title image
        const musicTitle = this.add.image(275, 245, "ui_atlas", 'settingsHover').setOrigin(0.5);
        musicTitle.flipX = true;
        musicTitle.depth = 1;

        // add music text
        const musicText = this.add.text(173 + 75, 245 + 12, 'MUSIC:', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        musicText.depth = 2;

        // add music up text
        const musicUpText = this.add.text(680, 245 + 12, '+', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        musicUpText.depth = 2;

        // add music vol up hover
        const musicUpHover = this.add.image(680, 245, "ui_atlas", 'vol1Hover').setOrigin(0.5);
        musicUpHover.alpha = 0;
        musicUpHover.depth = 1;

        // music volume up button
        const musicVolumeUpButton = this.add.image(680, 245, "ui_atlas", 'vol1').setOrigin(0.5);
        musicVolumeUpButton.setInteractive();
        musicVolumeUpButton.on('pointerdown', () => {
            this.hoverSound.stop();
            this.selectSound.play({ volume: sfxVol });
            if (musicVol <= 1) {
                musicVol += 0.1;
            }
            musicVol = Math.min(1, musicVol);
            music.setVolume(musicVol);
            this.musicVolText.setText((musicVol * 100).toFixed(0));
        });
        musicVolumeUpButton.on('pointerover', () => { // reveal hover image
            this.hoverSound.play({ volume: sfxVol });
            musicVolumeUpButton.alpha = 0;
            musicUpHover.alpha = 1;
            musicUpText.setFill('#fff571');
        });
        musicVolumeUpButton.on('pointerout', () => {  // return og image
            musicVolumeUpButton.alpha = 1;
            musicUpHover.alpha = 0;
            musicUpText.setFill('#b480ef');
        });
        musicVolumeUpButton.input.alwaysEnabled = true; // prevents flickering between two images
        musicVolumeUpButton.depth = 1;

        // add music down text
        const musicDownText = this.add.text(600, 245 + 12, '-', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        musicDownText.depth = 2;

        // add music vol down hover
        const musicDownHover = this.add.image(600, 245, "ui_atlas", 'vol2Hover').setOrigin(0.5);
        musicDownHover.depth = 1;
        musicDownHover.alpha = 0;

        // music volume down button
        const musicVolumeDownButton = this.add.image(600, 245, "ui_atlas", 'vol2').setOrigin(0.5);
        musicVolumeDownButton.setInteractive();
        musicVolumeDownButton.on('pointerdown', () => {
            this.hoverSound.stop();
            this.backSound.play({ volume: sfxVol });
            if (musicVol >= 0) {
                musicVol -= 0.1;
            }
            musicVol = Math.max(0, musicVol);
            music.setVolume(musicVol);
            this.musicVolText.setText((musicVol * 100).toFixed(0));
        });
        musicVolumeDownButton.on('pointerover', () => { // reveal hover image
            this.hoverSound.play({ volume: sfxVol });
            musicVolumeDownButton.alpha = 0;
            musicDownHover.alpha = 1;
            musicDownText.setFill('#fff571');
        });
        musicVolumeDownButton.on('pointerout', () => { // return og image
            musicVolumeDownButton.alpha = 1;
            musicDownHover.alpha = 0;
            musicDownText.setFill('#b480ef');
        });
        musicVolumeDownButton.input.alwaysEnabled = true; // prevents flickering between two images
        musicVolumeDownButton.depth = 1;

        // sfx title image
        const sfxTitle = this.add.image(275, 360, "ui_atlas", 'settingsHover').setOrigin(0.5);
        sfxTitle.flipX = true;
        sfxTitle.depth = 1;

        // add sfx text
        const sfxText = this.add.text(160 + 75, 360 + 12, 'SFX:', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        sfxText.depth = 2;

        // add sfx up text
        const sfxUpText = this.add.text(680, 360 + 12, '+', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        sfxUpText.depth = 2;

        // add sfx vol up hover
        const sfxUpHover = this.add.image(680, 360, "ui_atlas", 'vol1Hover').setOrigin(0.5);
        sfxUpHover.alpha = 0;
        sfxUpHover.depth = 1;

        // sfx volume up button
        const sfxVolumeUpButton = this.add.image(680, 360, "ui_atlas", 'vol1').setOrigin(0.5);
        sfxVolumeUpButton.setInteractive();
        sfxVolumeUpButton.on('pointerdown', () => {
            this.hoverSound.stop();
            this.selectSound.play({ volume: sfxVol });
            if (sfxVol <= 1) {
                sfxVol += 0.1;
            }
            sfxVol = Math.min(1, sfxVol);
            this.sfxVolText.setText((sfxVol * 100).toFixed(0));
        });
        sfxVolumeUpButton.on('pointerover', () => { // reveal hover image
            this.hoverSound.play({ volume: sfxVol });
            sfxVolumeUpButton.alpha = 0;
            sfxUpHover.alpha = 1;
            sfxUpText.setFill('#fff571');
        });
        sfxVolumeUpButton.on('pointerout', () => {  // return og image
            sfxVolumeUpButton.alpha = 1;
            sfxUpHover.alpha = 0;
            sfxUpText.setFill('#b480ef');
        });
        sfxVolumeUpButton.input.alwaysEnabled = true; // prevents flickering between two images
        sfxVolumeUpButton.depth = 1;

        // add sfx down text
        const sfxDownText = this.add.text(600, 360 + 12, '-', { fill: '#b480ef', fontFamily: 'VT323', fontSize: 35, align: 'center' }).setOrigin(0.5);
        sfxDownText.depth = 2;

        // add sfx vol down hover
        const sfxDownHover = this.add.image(600, 360, "ui_atlas", 'vol2Hover').setOrigin(0.5);
        sfxDownHover.depth = 1;
        sfxDownHover.alpha = 0;

        // sfx volume down button
        const sfxVolumeDownButton = this.add.image(600, 360, "ui_atlas", 'vol2').setOrigin(0.5);
        sfxVolumeDownButton.setInteractive();
        sfxVolumeDownButton.on('pointerdown', () => {
            this.hoverSound.stop();
            this.backSound.play({ volume: sfxVol });
            if (sfxVol >= 0) {
                sfxVol -= 0.1;
            }
            sfxVol = Math.max(0, sfxVol);
            this.sfxVolText.setText((sfxVol * 100).toFixed(0));
        });
        sfxVolumeDownButton.on('pointerover', () => { // reveal hover image
            this.hoverSound.play({ volume: sfxVol });
            sfxVolumeDownButton.alpha = 0;
            sfxDownHover.alpha = 1;
            sfxDownText.setFill('#fff571');
        });
        sfxVolumeDownButton.on('pointerout', () => { // return og image
            sfxVolumeDownButton.alpha = 1;
            sfxDownHover.alpha = 0;
            sfxDownText.setFill('#b480ef');
        });
        sfxVolumeDownButton.input.alwaysEnabled = true; // prevents flickering between two images
        sfxVolumeDownButton.depth = 1;
    }

    update() {
        // move clouds
        this.clouds1.tilePositionX += 1;
        this.clouds2.tilePositionX += 0.5;
    }
}
