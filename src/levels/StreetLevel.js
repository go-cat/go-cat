"use strict";

class StreetLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'StreetLevel' })
    }

    preload() {
        this.load.image('bg', 'assets/images/StreetLevel/street_background.png');
        this.load.image('car', 'assets/images/StreetLevel/car.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png')
    }

    create() {
        super.create();

        const worldheight = this.game.config.height*4;
        this.cameras.main.setBounds(0, 0, this.game.config.width, worldheight);
        this.physics.world.setBounds(0, 0, this.game.config.width, worldheight, true, true, true, true);

        // Our platforms and ground, all static in a group
        let platforms = this.physics.add.staticGroup();

        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        this.cat = this.physics.add.sprite(0, worldheight, 'cat');
        this.cat.setCollideWorldBounds(true);
        this.cat.body.setAllowGravity(0, 0);
        this.cameras.main.startFollow(this.cat);

        this.car = this.physics.add.sprite(0, 50, 'car');
        this.car.body.setAllowGravity(0, 0);

        this.physics.add.collider(this.cat, this.car, ()=>{
            this.scene.start('EndScene');
        });

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

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
