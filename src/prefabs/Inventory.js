class Inventory {
    constructor(scene, x, y) {

        this.scene = scene;

        // inventory properties
        this.padding = 10;
        this.border = 5;
        this.rounding = 5;
        this.depth = 8;
        this.borderColor = 0xffffff;
        this.backgroundColor = 0x000000;
        this.visible = true;
        this.x = x;
        this.y = y;
        this.OriginX = 0;
        this.OriginY = 0;
        this.width = 32;
        this.height = 32;
        this.style = { fontFamily: 'Arial', fontSize: '14px', color: '#ffffff', align: 'center' };

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
        if(this.visible) {
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
        this.box.fillRoundedRect(this.x - this.width * this.OriginX - this.padding - this.border,
                                this.y - this.height * this.OriginY - this.padding - this.border, 
                                this.width + this.padding * 2 + this.border * 2, 
                                this.height + this.padding * 2 + this.border * 2, 
                                this.rounding);

        // Background Box
        this.box.fillStyle(this.backgroundColor);
        this.box.fillRoundedRect(this.x - this.width * this.OriginX - this.padding,
                                this.y - this.height * this.OriginY - this.padding,
                                this.width + this.padding * 2,
                                this.height + this.padding * 2,
                                this.rounding);

        // item image
        if(this.itemName != "") {
            this.itemImage.setOrigin(0.5);
            this.itemImage.x = this.x + this.width * (0.5 - this.OriginX);
            this.itemImage.y = this.y + this.height * (0.5 - this.OriginY);
        }

        // item count
        if(this.itemCount >= 1) {
            this.itemCountText.setOrigin(0.5);
            this.itemCountText.x = this.x + this.width * (1 - this.OriginX);
            this.itemCountText.y = this.y + this.height * (1 - this.OriginY);
        }
    }

    setOrigin() {
        if(arguments.length == 1) {
            this.text.setOrigin(arguments[0], arguments[0]);
            this.OriginX = arguments[0];
            this.OriginY = arguments[0];
            this.drawBox();
        } else if(arguments.length == 2) {
            this.text.setOrigin(arguments[0], arguments[1]);
            this.OriginX = arguments[0];
            this.OriginY = arguments[1];
            this.drawBox();
        } else {
            console.log("Error: setOrigin requires 1 or 2 arguments");
        }
    }

    addItem(name, count) {
        if(this.itemName == "") {
            this.itemName = name;
            this.itemImage = this.scene.add.image(this.x, this.y, name);
            this.itemImage.setScrollFactor(0);
            this.itemImage.setScale(0.12);
            this.itemImage.depth = this.depth + 1;
            this.itemCountText.visible = true;

        } else if(this.itemName != name) {
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
        this.itemImage.destroy();
        this.itemImage = null;
        this.itemCountText.setText(this.itemCount);
        this.itemCountText.visible = false;
        this.drawInventory();
    }
}