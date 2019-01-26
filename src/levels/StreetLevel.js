"use strict";

class StreetLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'StreetLevel' })
    }

    preload() {
        super.preload();

        this.load.image('bg', 'assets/images/StreetLevel/street_background.png');
        this.load.image('car', 'assets/images/car.png');
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', { frameWidth: 97, frameHeight: 101 });
        this.load.image('goal', 'assets/images/house_home_transparent.png');
        this.load.image('house', 'assets/images/StreetLevel/house.png');
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('cat_lives', 'assets/images/cat_lives.png');

        this.load.audio('backgroundmusicstreet', 'assets/sounds/songs/Big_Rock.mp3');
        this.load.audio('cat_hit', 'assets/sounds/animals/cat_angry.ogg');
        this.load.audio('meow', 'assets/sounds/animals/cat_meow1.ogg');
    }

    create() {
        // Music!
        this.music = this.sound.add('backgroundmusicstreet');
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        // Set world and camera bounds
        const worldheight = this.game.config.height*4;
        const real_worldheight = 2962;
        this.cameras.main.setBounds(0, 0, this.game.config.width, real_worldheight);
        this.physics.world.setBounds(0, 0, this.game.config.width, real_worldheight, true, true, true, true);

        // Add background (with streets)
        this.add.image(0, 0, 'bg').setOrigin(0, 0);

        // Add houses
        this.housesSprites = this.physics.add.group();

        let houses_conf = [
            {x: 300, y: 480},
            {x: 550, y: 800},
            {x: 100, y: 1185},
            {x: 250, y: 1185},
            {x: 700, y: 1450},
            {x: 550, y: 1580},
            {x: 100, y: 2100},
            {x: 700, y: 2100}
        ];
        for (let i = 0; i < 8; i++) {
            let sprite = this.physics.add.sprite(houses_conf[i].x, houses_conf[i].y, 'house');
            this.housesSprites.add(sprite);
            sprite.body.setAllowGravity(0, 0);
            sprite.body.setImmovable();
            sprite.setSize(80, 110, true);
        }

        // Add cat
        this.cat = this.physics.add.sprite(50, worldheight-49, 'animcat');
        this.cat.setCollideWorldBounds(true);
        this.cat.body.setAllowGravity(0, 0);
        this.cat.setSize(90, 90, true);
        this.cameras.main.startFollow(this.cat);
        this.anims.remove('walk');
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('animcat', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('stand');
        this.anims.create({
            key: 'stand',
            frames: [ { key: 'animcat', frame: 0 } ],
            frameRate: 20,
        });

        // Mice
        this.mice = this.physics.add.group();
        for (let i = 0; i < 20; i++) {
            let x = Phaser.Math.Between(50, this.game.config.width-50);
            let y = Phaser.Math.Between(50, worldheight-50);
            let mouse = this.mice.create(x, y, 'mouse');
            mouse.body.setAllowGravity(0, 0);
        }

        this.physics.add.overlap(this.cat, this.mice, (cat, mouse) => {
            this.addScore();
            mouse.disableBody(true, true);
            try {
                this.sound.play('meow');
            } catch {
                console.log('no audio possible');
            }
        });

        // Add goal
        this.goal = this.physics.add.sprite(this.game.config.width-64, 59, 'goal');
        this.goal.body.setAllowGravity(0, 0);
        this.goal.body.setImmovable();

        this.physics.add.collider(this.cat, this.goal, ()=>{
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        });

        // Add house collision
        this.physics.add.collider(this.cat, this.housesSprites);

        // Add cars
        this.cars = [];
        this.carsSprites = this.physics.add.group();

        let streets_y = [280, 565, 886, 1006, 1266, 1672, 1793, 2179];
        let car_max = 24;

        for (let i = 0; i < car_max; i++) {
            let random_x = Phaser.Math.FloatBetween(0, -200);
            let random_y = streets_y[i%streets_y.length];
            let sprite = this.physics.add.sprite(random_x, random_y + 50, 'car');
            this.carsSprites.add(sprite);
            sprite.body.setAllowGravity(0, 0);
            sprite.body.setVelocityX(Phaser.Math.FloatBetween(100, 300));
            sprite.setSize(90, 35, true);
            this.cars.push(sprite);
        }

        this.physics.add.collider(this.cat, this.carsSprites, () => {
            try {
                this.sound.play('cat_hit');
            } catch {
                console.log('no audio possible');
            }
            this.catDies(this.cat);
        });

        // Add wall in front of hidden room
        this.hiddenwall = this.physics.add.image((800-105)/2, worldheight+150, 'asdf');
        this.hiddenwall.displayHeight = 300;
        this.hiddenwall.displayWidth = 800-105;
        this.hiddenwall.body.allowGravity = false;
        this.hiddenwall.setImmovable();
        this.hiddenwall.visible = false;
        this.physics.add.collider(this.cat, this.hiddenwall);

        // Add hidden extra lives
        this.extra_lives = this.physics.add.sprite(this.game.config.width/2, real_worldheight-131, 'cat_lives');
        this.extra_lives.body.setAllowGravity(0, 0);

        this.physics.add.overlap(this.cat, this.extra_lives, ()=>{
            // TODO this should be a cape or something, also sound
            this.addScore(1000);
        });

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        for (var i = 0; i < this.cars.length; i++) {
            if (this.cars[i].x >= this.game.config.width) {
                this.cars[i].setVelocityX(Math.abs(this.cars[i].body.velocity.x)*-1);
                this.cars[i].flipX = true;
            } else if (this.cars[i].x <= 0) {
                this.cars[i].setVelocityX(Math.abs(this.cars[i].body.velocity.x));
                this.cars[i].flipX = false;
            }
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-350);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand');
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(350);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand');
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed) {
            this.cat.setVelocityY(-350);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityY(0);
            this.cat.anims.play('stand');
        }
    }

    buttonPressedDown(pressed) {
        if (pressed) {
            this.cat.setVelocityY(350);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityY(0);
            this.cat.anims.play('stand');
        }
    }
}
