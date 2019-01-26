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
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cat.body.setAllowGravity(0,0);

        this.car = this.physics.add.image(0, 50, 'car');
        this.car.body.setAllowGravity(0,0);
        this.target = new Phaser.Math.Vector2();
        this.target.x=800;
        this.target.y=50;
        this.physics.moveToObject(this.car, this.target, 200);
    }

    update() {
        var distance = Phaser.Math.Distance.Between(this.car.x, this.car.y, this.target.x, this.target.y);

        if (this.car.body.speed > 0)
        {
            // distanceText.setText('Distance: ' + distance);

            //  4 is our distance tolerance, i.e. how close the source can get to the target
            //  before it is considered as being there. The faster it moves, the more tolerance is required.
            if (distance < 4)
            {
                // this.car.body.reset(this.target.x, this.target.y);
                // this.car.body.reset(0, 50);
                this.car.body.x = 0;
                this.car.body.y = 50;
            }
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
