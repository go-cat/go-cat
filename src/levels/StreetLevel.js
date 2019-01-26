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

        this.physics.add.collider(this.cat, this.car, ()=>{
            this.scene.start('EndScene');
        });
    }

    update() {
        super.update();

        if (this.car.x >= 800) {
            this.car.setVelocityX(-200);
        } else if (this.car.x <= 0) {
            this.car.setVelocityX(200);
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-350);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(350);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed) {
            this.cat.setVelocityY(-350);
        } else {
            this.cat.setVelocityY(0);
        }
    }

    buttonPressedDown(pressed) {
        if (pressed) {
            this.cat.setVelocityY(350);
        } else {
            this.cat.setVelocityY(0);
        }
    }
}
