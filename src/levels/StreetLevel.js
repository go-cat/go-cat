"use strict";

class StreetLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'StreetLevel' })
    }

    preload() {
        this.load.image('grass', 'assets/images/StreetLevel/grass.png');
        this.load.image('car', 'assets/images/StreetLevel/car.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png')
    }

    create() {
        super.create();

        // Our platforms and ground, all static in a group
        let platforms = this.physics.add.staticGroup();

        this.add.image(0, 0, 'grass').setOrigin(0, 0);

        this.cat = this.physics.add.sprite(100, 0, 'cat');
        this.cat.setCollideWorldBounds(true);
        this.cat.body.setAllowGravity(0, 0);

        this.car = this.physics.add.sprite(0, 50, 'car');
        this.car.body.setAllowGravity(0, 0);

        /* Initialize the keys */
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (this.car.x >= 800) {
            this.car.setVelocityX(-200);
        } else if (this.car.x <= 0) {
            this.car.setVelocityX(200);
        }

        /* react to key presses */
        if (this.leftKey.isDown) {
            this.cat.x -= 5;

            if (this.cat.flipX == false) {
                this.cat.flipX = true;
            }
        }

        if (this.rightKey.isDown) {
            this.cat.x += 5;

            if (this.cat.flipX == true) {
                this.cat.flipX = false;
            }
        }

        if (this.upKey.isDown) {
            this.cat.y -= 5;
        }
        if (this.downKey.isDown) {
            this.cat.y += 5;
        }
    }
}
