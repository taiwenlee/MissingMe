class Textbox {
    constructor(scene, x, y, text, style) {

        // text box properties
        this.padding = 5;
        this.border = 5;
        this.rounding = 5;
        this.depth = 8;
        this.borderColor = "0xffffff";
        this.backgroundColor = "0x000000";
        this.visible = true;
        this.x = x;
        this.y = y;
        this.OriginX = 0;
        this.OriginY = 0;


        // add text
        this.text = scene.add.text(this.x, this.y, text, style);
        this.text.depth = this.depth + 1;

        // add text box
        this.box = new Phaser.GameObjects.Graphics(scene);
        this.box.depth = this.depth;
        scene.add.existing(this.box);

        this.drawBox();
    }

    update() {
        if (this.visible) {
            this.text.visible = true;
            this.box.visible = true;
        } else {
            this.text.visible = false;
            this.box.visible = false;
        }

        this.text.x = this.x;
        this.text.y = this.y;
        this.drawBox();

    }

    setText(text) {
        this.text.setText(text);
        this.drawBox();
    }

    setOrigin() {
        if (arguments.length == 1) {
            this.OriginX = arguments[0];
            this.OriginY = arguments[0];
            this.drawBox();
        } else if (arguments.length == 2) {
            this.OriginX = arguments[0];
            this.OriginY = arguments[1];
            this.drawBox();
        } else {
            console.log("Error: setOrigin requires 1 or 2 arguments");
        }

    }

    drawBox() {
        // clear box
        this.box.clear();

        // Border Box
        this.box.fillStyle(this.borderColor, 1);
        this.box.fillRoundedRect(this.x - (this.text.width + this.padding * 2 + this.border * 2) * this.OriginX,
            this.y - (this.text.height + this.padding * 2 + this.border * 2) * this.OriginY,
            this.text.width + this.padding * 2 + this.border * 2,
            this.text.height + this.padding * 2 + this.border * 2,
            this.rounding);

        // Background Box
        this.box.fillStyle(this.backgroundColor, 1);
        this.box.fillRoundedRect(this.x + this.border - (this.text.width + this.padding * 2 + this.border * 2) * this.OriginX,
            this.y + this.border - (this.text.height + this.padding * 2 + this.border * 2) * this.OriginY,
            this.text.width + this.padding * 2,
            this.text.height + this.padding * 2,
            this.rounding);

        // positions text
        this.text.x = this.x + this.border + this.padding - (this.text.width + this.padding * 2 + this.border * 2) * this.OriginX;
        this.text.y = this.y + this.border + this.padding - (this.text.height + this.padding * 2 + this.border * 2) * this.OriginY;
    }

    destroy() {
        this.text.destroy();
        this.box.destroy();
    }
}
