class Textbox {
    constructor(scene, x, y, text, style) {

        // text box properties
        this.padding = 7;
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
        this.wrapWidth = 400;

        // add text
        this.text = scene.add.text(this.x, this.y, text, style);
        this.text.style.wordWrapWidth = this.wrapWidth;
        this.text
        this.text.depth = this.depth + 1;

        // add text box
        this.box = new Phaser.GameObjects.Graphics(scene);
        this.box.depth = this.depth;
        scene.add.existing(this.box);

        // text animation stuff
        this.speed = 0.5; // letter per update
        this.animation = true; // if true, letter and letter will play
        this.index = 0; // current letter
        this.fullText = text; // full text
        this.textLength = text.length; // total length of text

        // finds complete text width and height
        this.text.setText(text);
        this.width = this.text.width;
        this.height = this.text.height;

        if (this.animation) {
            this.text.setText(this.fullText.substring(0, this.index));
        } else {
            this.index = this.textLength;
        }

        this.drawBox();
    }

    update() {
        // check visible and update visibility
        if (this.visible) {
            this.text.visible = true;
            this.box.visible = true;
        } else {
            this.text.visible = false;
            this.box.visible = false;
        }
        // update text locations and wrap
        this.text.style.wordWrapWidth = this.wrapWidth;
        this.text.x = this.x;
        this.text.y = this.y;

        // update text animation
        if (this.animation && this.index < this.textLength) {
            this.index += this.speed;
            this.text.setText(this.fullText.substring(0, this.index));
            // basic prevent of overflow on textbox
            if (this.text.width > this.width) {
                let lastIndex = this.fullText.substring(0, this.index).lastIndexOf(" ");
                this.text.setText(this.fullText.substring(0, lastIndex)
                    + "\n" + this.fullText.substring(lastIndex, this.index));
            }
        } else {
            this.index = this.textLength;
            this.text.setText(this.fullText);
        }

        this.drawBox();
    }

    setText(text) {
        this.index = 0; // reset index
        this.fullText = text; // full text
        this.textLength = text.length; // total length of text
        this.text.setText(text);
        this.width = this.text.width;
        this.height = this.text.height;
        if (this.animation) {
            this.text.setText(this.fullText.substring(0, this.index));
        } else {
            this.index = this.textLength;
            this.text.setText(text);
        }
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
        return this;
    }

    // skips letter by letter animation
    skip() {
        this.index = this.textLength;
        this.text.setText(this.fullText);
    }

    drawBox() {
        // clear box
        this.box.clear();

        // Border Box
        this.box.fillStyle(this.borderColor, 1);
        this.box.fillRoundedRect(this.x - (this.width + this.padding * 2 + this.border * 2) * this.OriginX,
            this.y - (this.height + this.padding * 2 + this.border * 2) * this.OriginY,
            this.width + this.padding * 2 + this.border * 2,
            this.height + this.padding * 2 + this.border * 2,
            this.rounding);

        // Background Box
        this.box.fillStyle(this.backgroundColor, 1);
        this.box.fillRoundedRect(this.x + this.border - (this.width + this.padding * 2 + this.border * 2) * this.OriginX,
            this.y + this.border - (this.height + this.padding * 2 + this.border * 2) * this.OriginY,
            this.width + this.padding * 2,
            this.height + this.padding * 2,
            this.rounding);

        // positions text
        this.text.x = this.x + this.border + this.padding - (this.width + this.padding * 2 + this.border * 2) * this.OriginX;
        this.text.y = this.y + this.border + this.padding - (this.height + this.padding * 2 + this.border * 2) * this.OriginY;
    }

    destroy() {
        this.text.destroy();
        this.box.destroy();
    }
}
