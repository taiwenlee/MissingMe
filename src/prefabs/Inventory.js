class Inventory {
    constructor(scene, x, y) {

        this.scene = scene;

        // inventory properties
        this.border = 5;
        this.rounding = 5;
        this.depth = 8;
        this.borderColor = 0xffffff;
        this.backgroundColor = 0x000000;
        this.visible = true;
        this.x = x + 30;
        this.y = y + 5;
        this.OriginX = 0;
        this.OriginY = 0;
        this.width = 64;
        this.height = 64;
        this.style = { fontFamily: 'VT323', fontSize: '20px', color: '#ffffff', align: 'center' };

        // item properties
        this.itemName = "";
        this.itemCount = 0;
        this.itemImage = null;
        this.itemCountText = this.scene.add.text(this.x, this.y, this.itemCount, this.style);
        this.itemCountText.setScrollFactor(0);
        this.itemCountText.depth = this.depth + 2;
        this.itemCountText.visible = false;

        // inventory box
        this.box = new Phaser.GameObjects.Graphics(scene);
        this.box.depth = this.depth;
        scene.add.existing(this.box);
        this.box.setScrollFactor(0);


        this.drawInventory();

    }

    update() {
        if (this.visible) {
            this.box.visible = true;
        } else {
            this.box.visible = false;
        }
        this.drawInventory();
    }

    drawInventory() {
        // clear box
        this.box.clear();

        // Border Box
        this.box.fillStyle(this.borderColor);
        this.box.fillRoundedRect(this.x - this.width * this.OriginX - this.border,
            this.y - this.height * this.OriginY - this.border,
            this.width + this.border * 2,
            this.height + this.border * 2,
            this.rounding);

        // Background Box
        this.box.fillStyle(this.backgroundColor);
        this.box.fillRoundedRect(this.x - this.width * this.OriginX,
            this.y - this.height * this.OriginY,
            this.width,
            this.height,
            this.rounding);

        // item image
        if (this.itemName != "" && this.itemCount > 0) {
            this.itemImage.setOrigin(0.5);
            this.itemImage.x = this.x + this.width * (0.5 - this.OriginX);
            this.itemImage.y = this.y + this.height * (0.5 - this.OriginY);
        }

        // item count
        if (this.itemCount > 0) {
            this.itemCountText.setOrigin(0.5);
            this.itemCountText.x = this.x + this.width * (0.9 - this.OriginX);
            this.itemCountText.y = this.y + this.height * (0.9 - this.OriginY);
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
    }

    addItem(name, count) {
        if (this.itemName == "" && this.itemCount == 0) {
            this.itemName = name;
            this.itemImage = this.scene.add.image(this.x, this.y, "object_atlas", name);
            this.itemImage.setScrollFactor(0);
            this.itemImage.depth = this.depth + 1;
            this.itemCountText.visible = true;

        } else if (this.itemName != name) {
            console.log("Error: item already exists");
            return;
        }
        this.itemCount += count;
        this.itemCountText.setText(this.itemCount);
        this.drawInventory();
    }

    clear() {
        this.itemName = "";
        this.itemCount = 0;
        if (this.itemImage) this.itemImage.destroy();
        this.itemImage = null;
        this.itemCountText.setText(this.itemCount);
        this.itemCountText.visible = false;
        this.drawInventory();
    }
}
