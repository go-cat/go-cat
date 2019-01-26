"use strict";

class StreetLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'StreetLevel' })
    }

    preload() {
        this.load.image('bg', 'assets/images/StreetLevel/street_background.png');
        this.load.image('car', 'assets/images/car.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png')
        this.load.image('goal', 'assets/images/StreetLevel/house.png');
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

        this.goal = this.physics.add.sprite(this.game.config.width-64, 59, 'goal');
        this.goal.body.setAllowGravity(0, 0);

        this.physics.add.collider(this.cat, this.goal, ()=>{
            this.scene.start('EndScene');
        });

        this.cars = this.physics.add.group({
            key: 'car',
            repeat: 20,
            setXY: { x: 0, y: 150, stepY: 100 }
        });

        this.cars.children.iterate(function (child) {
            child.body.setAllowGravity(0, 0);
            child.setVelocityX(Phaser.Math.FloatBetween(100, 200));
        });

        this.physics.add.collider(this.cat, this.cars, ()=>{
            this.scene.start('EndScene');
        });

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        this.cars.children.iterate(function (child) {
            if (child.x >= 800) {
                child.setVelocityX(Math.abs(child.body.velocity.x)*-1);
                child.flipX = true;
            } else if (child.x <= 0) {
                child.setVelocityX(Math.abs(child.body.velocity.x));
                child.flipX = false;
            }
        });
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
