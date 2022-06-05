class Inventory {
    constructor(scene, x, y) {

        this.scene = scene;

        // inventory properties
        this.border = 5;
        this.rounding = 5;
        this.depth = 8;
        this.borderColor = 0xffffff;
        this.backgroundColor = 0x000000;
        this._visible = true;
        this.x = x;
        this.y = y;
        this.OriginX = 0;
        this.OriginY = 0;
        this.width = 64;
        this.height = 64;
        this.style = { fontFamily: 'VT323', fontSize: '20px', color: '#ffffff', align: 'center' };

        // item properties
        this.itemName = "";
        this._itemCount = 0;
        this.itemImage = this.scene.add.image(this.x, this.y, "object_atlas", "");
        this.itemImage.visible = false;
        this.itemImage.setScrollFactor(0);
        this.itemImage.depth = this.depth + .1;
        // count text
        this.itemCountText = this.scene.add.text(this.x, this.y, this.itemCount, this.style);
        this.itemCountText.setScrollFactor(0);
        this.itemCountText.depth = this.depth + .2;
        this.itemCountText.visible = false;

        // inventory box
        this.box = new Phaser.GameObjects.Graphics(scene);
        this.box.depth = this.depth;
        scene.add.existing(this.box);
        this.box.setScrollFactor(0);

        // tween
        // item tween
        this.tween = null;
        this.tweenImage = this.scene.add.image(this.x, this.y, "object_atlas", "");
        this.tweenImage.visible = false;
        this.tweenImage.depth = this.depth + .2;
        this.tweenImage.setScrollFactor(0);

        this.drawInventory();

    }

    set visible(value) {
        this._visible = value;
        this.box.visible = value;
        this.drawInventory();
    }

    get visible() {
        return this._visible;
    }

    set itemCount(value) {
        this._itemCount = value;
        this.drawInventory();
    }

    get itemCount() {
        return this._itemCount;
    }

    drawInventory() {
        // clear box
        this.box.clear();

        // Border Box
        this.box.fillStyle(this.borderColor);
        this.box.fillRoundedRect(this.x - (this.width + this.border * 2) * this.OriginX,
            this.y - (this.height + this.border * 2) * this.OriginY,
            this.width + this.border * 2,
            this.height + this.border * 2,
            this.rounding);

        // Background Box
        this.box.fillStyle(this.backgroundColor);
        this.box.fillRoundedRect(this.x + this.border - (this.width + this.border * 2) * this.OriginX,
            this.y + this.border - (this.width + this.border * 2) * this.OriginY,
            this.width,
            this.height,
            this.rounding);

        // item image
        if (this.itemName != "" && this.itemCount > 0) {
            this.itemImage.setOrigin(0.5);
            this.itemImage.x = this.x + (this.width + this.border * 2) * (0.5 - this.OriginX);
            this.itemImage.y = this.y + (this.height + this.border * 2) * (0.5 - this.OriginY);

        }

        // item count
        if (this.itemCount > 0) {
            this.itemCountText.setOrigin(0.5);
            this.itemCountText.x = this.x + (this.width + this.border * 2) * (0.8 - this.OriginX);
            this.itemCountText.y = this.y + (this.height + this.border * 2) * (0.2 - this.OriginY);
        } else {
            this.itemCountText.visible = false;
        }
    }

    setOrigin() {
        if (arguments.length == 1) {
            this.OriginX = arguments[0];
            this.OriginY = arguments[0];
            this.drawInventory();
        } else if (arguments.length == 2) {
            this.OriginX = arguments[0];
            this.OriginY = arguments[1];
            this.drawInventory();
        } else {
            console.log("Error: setOrigin requires 1 or 2 arguments");
        }
        return this;
    }

    setDepth(value) {
        this.depth = value;
        return this;
    }

    addItem(name, count) {
        if (this.itemName == "" && this.itemCount == 0) {
            this.itemName = name;
            this.itemImage.setTexture("object_atlas", name);
            this.tweenImage.setTexture("object_atlas", name);
            this.addTween();
        } else if (this.itemName != name) {
            console.log("Error: another item already exists");
            return;
        }

        // animation for adding item
        this.tweenImage.setOrigin(0.5);
        this.tweenImage.x = game.config.width / 2;
        this.tweenImage.y = game.config.height / 2;
        this.tweenImage.scaleX = 1.5;
        this.tweenImage.scaleY = 1.5;
        this.tweenImage.visible = true;
        this.scene.time.delayedCall(1000, function () {
            this.tweenImage.visible = false;
            this.itemImage.visible = true;
            this.itemCountText.visible = true;
            this.itemCount += count;
            this.itemCountText.setText(this.itemCount);
        }, [], this);
        this.tween.restart();
    }

    removeItem(count) {
        if (this.itemCount == 0) {
            console.log("Error: item does not exist");
            return;
        }
        this.itemCount -= count;
        if (this.itemCount == 0) {
            this.clear();
            return;
        }
        this.itemCountText.setText(this.itemCount);
        this.drawInventory();
    }

    clear() {
        this.itemName = "";
        this.itemCount = 0;
        this.itemImage.visible = false;
        this.itemCountText.setText(this.itemCount);
        this.itemCountText.visible = false;
        this.drawInventory();
    }

    addTween() {
        this.tween = this.scene.tweens.add({
            targets: this.tweenImage,
            scaleY: 1,
            scaleX: 1,
            x: this.x + (this.width + this.border * 2) * (0.5 - this.OriginX),
            y: this.y + (this.height + this.border * 2) * (0.5 - this.OriginY),
            duration: 1000,
            ease: 'Back.easeIn',
            angle: 360,
        });
    }
}
