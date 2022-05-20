class Settings extends Phaser.Scene {
    constructor() {
       super("settingsScene");
    }

    create() {
        // temp scene indicator text
        const tempText = this.add.text(10, 10, "settingsScene");
    }
}
