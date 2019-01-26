"use strict";

class TreeLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch_20px.png');
        this.load.image('ground', 'assets/images/TreeLevel/bottom_green_60px.png');
        this.load.image('bird', 'assets/images/bird_flying_left.png');
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('wool', 'assets/images/ball_wool.png');
    }

    create() {
        super.create();

        // This are the bounds of our world
        const worldheight = this.game.config.height*4;
        this.physics.world.setBounds(0, 0, this.game.config.width, worldheight, true, true, true, true);

        // Background
        this.cameras.main.setBackgroundColor('#89C0FF');
        this.cameras.main.setBounds(0, 0, this.game.config.width, worldheight);

        // Our platforms and ground, all static in a group
        const platforms = this.physics.add.staticGroup();

        // Create the ground
        platforms.create(this.game.config.width/2, worldheight, 'ground').setScale(2).refreshBody();

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

        // Birds
        this.birds = this.physics.add.group({
            key: 'bird',
            repeat: 11,
            setXY: { x: 12, y: -10, stepX: 70 },
        });
        this.birds.children.iterate(function (bird) {
            bird.setBounceY(0);
            bird.body.allowGravity = false;
            bird.body.setCollideWorldBounds(true);
        });

        // Mice
        this.mice = this.physics.add.group({
            key: 'mouse',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 120 },
        });
        this.mice.children.iterate(function (mouse) {
            mouse.body.setCollideWorldBounds(true);
        });

        // Colide events
        this.physics.add.collider(this.cat, platforms);
        this.physics.add.collider(this.cat, this.mice);
        this.physics.add.collider(this.cat, this.birds);
        this.physics.add.collider(this.mice, platforms);
        this.physics.add.collider(this.birds, platforms);
    }

    update() {
        super.update();

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
        this.birds.children.iterate(function (bird) {
            let x = Phaser.Math.Between(1, 3);
            if (x === 1) {
                bird.setVelocityX(0);
            } else if (x === 2) {
                bird.setVelocityX(-100);
            } else {
                bird.setVelocityX(100);
            }
            
            let y = Phaser.Math.Between(1, 3);
            if (y === 1) {
                bird.setVelocityY(0);
            } else if (y === 2) {
                bird.setVelocityY(-100);
            } else {
                bird.setVelocityY(100);
            }            
        });           

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
