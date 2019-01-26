"use strict";

class TreeLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        super.preload();

        // Images
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch_20px.png');
        this.load.image('ground', 'assets/images/TreeLevel/bottom_green_60px.png');
        this.load.image('bird', 'assets/images/bird_flying_left.png');
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('wool', 'assets/images/ball_wool.png');
        this.load.image('birddropping', 'assets/images/bird_dropping.png');
        this.load.image('goal', 'assets/images/StreetLevel/house.png');

        // Sound
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
    }

    create() {
        // This are the bounds of our world
        const worldheight = this.game.config.height*4;
        this.physics.world.setBounds(0, 0, this.game.config.width, worldheight, true, true, true, true);

        // Background
        this.cameras.main.setBackgroundColor('#89C0FF');
        this.cameras.main.setBounds(0, 0, this.game.config.width, worldheight);

        // Our platforms and ground, all static in a group
        const platforms = this.physics.add.staticGroup();

        // Create the ground
        this.ground = this.physics.add.image(this.game.config.width/2, worldheight, 'ground');
        this.ground.body.setAllowGravity(0, 0);

        // Our goal
        this.goal = this.physics.add.image(this.game.config.width-64, worldheight-100, 'goal');
        this.goal.body.setAllowGravity(0, 0);

        // Create the branches
        platforms.create(20, 100, 'branch');
        platforms.create(100, 400, 'branch');
        platforms.create(300, 700, 'branch');
        platforms.create(500, 1000, 'branch');
        platforms.create(50, 1300, 'branch');
        platforms.create(200, 1600, 'branch');
        platforms.create(700, 1900, 'branch');
        platforms.create(100, 2200, 'branch');

        // Our cat
        this.cat = this.physics.add.sprite(100, 0, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;

        // Bird
        this.bird = this.physics.add.sprite(-100, -100, 'bird');
        this.bird.setBounceY(0);
        this.bird.body.allowGravity = false;
        this.bird.body.setCollideWorldBounds(false);
        this.bird.flying = false;

        // Birds do poop
        this.birdpoops = this.physics.add.group();

        // Mice
        this.mice = this.physics.add.group({
            key: 'mouse',
            repeat: 11,
            setXY: { x: 12, y: 20, stepX: 120 },
        });
        this.mice.children.iterate(function (mouse) {
            mouse.body.setCollideWorldBounds(true);
        });

        // Colide events
        // The cat
        this.physics.add.collider(this.cat, platforms);
        this.physics.add.collider(this.cat, this.ground)
        this.physics.add.collider(this.cat, this.mice, (cat, mouse) => {
            this.addScore();
            mouse.disableBody(true, true);
            this.cat.body.stop();
            this.sound.play("meow");
        });
        this.physics.add.collider(this.cat, this.birdpoops, () => {
            this.catDies(this.cat);
        });
        this.physics.add.collider(this.cat, this.goal, () => {
            this.addScore(100);
            this.startNextLevel();
        });
        // The mice
        this.physics.add.collider(this.mice, platforms);
        this.physics.add.collider(this.mice, this.ground);
        // The ground
        this.physics.add.collider(this.ground, this.birdpoops, (ground, poop) => {
            poop.disableBody(true, true);
        });

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        // Mice run
        this.mice.children.iterate(function (mouse) {
            let x = Phaser.Math.Between(1, 3);
            if (x === 1) {
                mouse.setVelocityX(0);
            } else if (x === 2) {
                mouse.setVelocityX(-500);
            } else {
                mouse.setVelocityX(500);
            }
        });

        // Birds fly
        /* Do we have a bird? */
        if (this.bird.flying) {
            /* should he poop? */
            if (Phaser.Math.Between(1, 100) < 3) {
                let birdpoop = this.birdpoops.create(this.bird.x, this.bird.y, 'birddropping');
                birdpoop.setBounceY(0);
                birdpoop.body.allowGravity = true;
                birdpoop.body.setCollideWorldBounds(false);
            }
            /* bird is gone */
            if (this.bird.x < 0 || this.bird.x > this.game.config.width) {
                this.bird.flying = false;
            }
        } else if (Phaser.Math.Between(1, 100) < 10) {
            /* start the bird */
            if (Phaser.Math.Between(1, 2) == 1) {
                this.bird.x = 0;
                this.bird.y = this.cameras.main.scrollY + Phaser.Math.Between(10, 300);
                this.bird.setVelocityX(400);
                this.bird.flipX = true;
            } else {
                this.bird.x = this.game.config.width;
                this.bird.y = this.cameras.main.scrollY + Phaser.Math.Between(10, 300);
                this.bird.setVelocityX(-400);
                this.bird.flipX = false;
            }
            this.bird.flying = true;
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-500);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(500);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && Math.abs(this.cat.body.velocity.y) < 2) {
            this.cat.setVelocityY(-350);
        }
    }
}
