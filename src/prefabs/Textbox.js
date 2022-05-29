class Textbox {
    constructor(scene, x, y, text, style) {

        // text box properties
        this._padding = 7;
        this._border = 5;
        this._rounding = 5;
        this._depth = 8;
        this._borderColor = "0xffffff";
        this._backgroundColor = "0x000000";
        this._visible = true;
        this._x = x;
        this._y = y;
        this._OriginX = 0;
        this._OriginY = 0;
        this._wrapWidth = 400;
        this._speed = 0.5; // letter per update
        this._animation = true; // if true, letter and letter will play
        this._scroll = true; // if true, text will scroll

        // add text
        this.text = scene.add.text(this.x, this.y, text, style);
        this.text.style.wordWrapWidth = this.wrapWidth;
        this.text.setScrollFactor(this.scroll);
        this.text.depth = this.depth + 1;

        // add text box
        this.box = new Phaser.GameObjects.Graphics(scene);
        this.box.depth = this.depth;
        this.box.setScrollFactor(this.scroll);
        scene.add.existing(this.box);

        // text animation stuff
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

    set padding(value) {
        this._padding = value;
        this.drawBox();
    }

    get padding() {
        return this._padding;
    }

    set border(value) {
        this._border = value;
        this.drawBox();
    }

    get border() {
        return this._border;
    }

    set rounding(value) {
        this._rounding = value;
        this.drawBox();
    }

    get rounding() {
        return this._rounding;
    }

    set depth(value) {
        this._depth = value;
        this.box.depth = value;
        this.text.depth = value + 1;
    }

    get depth() {
        return this._depth;
    }

    set borderColor(color) {
        this._borderColor = color;
        this.drawBox();
    }

    get borderColor() {
        return this._borderColor;
    }

    set backgroundColor(color) {
        this._backgroundColor = color;
        this.drawBox();
    }

    get backgroundColor() {
        return this._backgroundColor;
    }

    set visible(bool) {
        this._visible = bool;
        if (this.visible) {
            this.text.visible = true;
            this.box.visible = true;
        } else {
            this.text.visible = false;
            this.box.visible = false;
        }
    }
    get visible() {
        return this._visible;
    }

    set x(value) {
        this._x = value;
        this.drawBox();
    }

    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
        this.drawBox();
    }

    get y() {
        return this._y;
    }

    set OriginX(value) {
        this._OriginX = value;
        this.drawBox();
    }

    get OriginX() {
        return this._OriginX;
    }

    set OriginY(value) {
        this._OriginY = value;
        this.drawBox();
    }

    get OriginY() {
        return this._OriginY;
    }

    set wrapWidth(value) {
        this._wrapWidth = value;
        this.text.style.wordWrapWidth = value;
        this.text.setText(this.fullText);
        this.width = this.text.width;
        this.height = this.text.height;
        this.text.setText(this.fullText.substring(0, this.index));
        this.drawBox();
    }

    get wrapWidth() {
        return this._wrapWidth;
    }

    set speed(value) {
        this._speed = value;
    }

    get speed() {
        return this._speed;
    }

    set animation(value) {
        this._animation = value;
        if (!this.animation) {
            this.index = this.textLength;
            this.update();
        }
    }

    get animation() {
        return this._animation;
    }

    set scroll(value) {
        this._scroll = value;
        this.text.setScrollFactor(value);
        this.box.setScrollFactor(value);
    }

    get scroll() {
        return this._scroll;
    }

    update() {
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
