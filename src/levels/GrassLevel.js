"use strict";

class GrassLevel extends BaseLevelScene {
    constructor() {
        super({key: 'GrassLevel'})
    }

    preload() {
        super.preload();

        this.load.tilemapTiledJSON("grass_map", "assets/maps/GrassLevel/world.json");
        this.load.image('grass_tiles', "assets/images/GrassLevel/sprites_grass.png");
        this.load.spritesheet('animmouse', 'assets/images/mouse_left_animated.png', { frameWidth: 30, frameHeight: 20 } );
        this.load.image('bomb', 'assets/images/GrassLevel/bomb.png');
        this.load.image('empty', 'assets/images/GrassLevel/empty.png');
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', {frameWidth: 97, frameHeight: 101});
        this.load.image('grass_goal', 'assets/images/house_home_transparent.png');

        // Audio
        this.load.audio('backgroundmusicgrass', 'assets/sounds/music/Hamster_March.ogg');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
    }

    create() {
        this.inAir = false;
        // Music!
        this.music = this.sound.add('backgroundmusicgrass');
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        // layer and map for the Tilemap
        let map = this.make.tilemap({key: "grass_map", tileWidth: 32, tileHeight: 32});
        let tileset = map.addTilesetImage("grassTileset", "grass_tiles");

        let dynamicLayer2 = map.createDynamicLayer("background2", tileset, 0, 0);
        let dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        let collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);
        collisionLayer.setCollisionByProperty({collides: true});

        this.physics.world.setBounds(0, 0, 6784, 576, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 6784, 576);

        // Variables
        this.dogSpeed = 30;
        this.dogSart = 400;
        this.millis = 0;

        // The player and its settings
        this.cat = this.physics.add.sprite(100, 400, 'animcat');
        this.cameras.main.startFollow(this.cat);
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cat.body.gravity.y = 300;
        this.cat.scaleY = 0.6;
        this.cat.scaleX = 0.6;
        this.anims.remove('idle');
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('animcat', {start: 1, end: 1}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('walk');
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('animcat', {start: 1, end: 4}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('stand');
        this.anims.create({
            key: 'stand',
            frames: [{key: 'animcat', frame: 0}],
            frameRate: 20,
        });
        this.anims.remove('mousewalk');
        this.anims.create({
            key: 'mousewalk',
            frames: this.anims.generateFrameNumbers('animmouse', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        // Create pits
        this.pits = this.physics.add.group();
        this.spawnObject(92, 17, 'empty', this.pits);
        this.spawnObject(93, 17, 'empty', this.pits);
        this.spawnObject(94, 17, 'empty', this.pits);
        this.spawnObject(95, 17, 'empty', this.pits);
        this.spawnObject(106, 17, 'empty', this.pits);
        this.spawnObject(107, 17, 'empty', this.pits);
        this.spawnObject(108, 17, 'empty', this.pits);
        this.spawnObject(139, 17, 'empty', this.pits);
        this.spawnObject(140, 17, 'empty', this.pits);
        this.spawnObject(141, 17, 'empty', this.pits);
        this.spawnObject(152, 17, 'empty', this.pits);
        this.spawnObject(153, 17, 'empty', this.pits);

        //  Create mice
        this.mice = this.physics.add.group();
        this.spawnObject(28,8,'mouse', this.mice);
        this.spawnObject(29,8,'mouse', this.mice);
        this.spawnObject(30,8,'mouse', this.mice);
        this.spawnObject(31,8,'mouse', this.mice);
        this.spawnObject(53,7,'mouse', this.mice);
        this.spawnObject(54,7,'mouse', this.mice);
        this.spawnObject(55,7,'mouse', this.mice);
        this.spawnObject(56,7,'mouse', this.mice);
        this.spawnObject(57,7,'mouse', this.mice);
        this.spawnObject(53,11,'mouse', this.mice);
        this.spawnObject(54,11,'mouse', this.mice);
        this.spawnObject(55,11,'mouse', this.mice);
        this.spawnObject(56,11,'mouse', this.mice);
        this.spawnObject(57,11,'mouse', this.mice);
        this.spawnObject(69,7,'mouse', this.mice);
        this.spawnObject(70,7,'mouse', this.mice);
        this.spawnObject(71,7,'mouse', this.mice);
        this.spawnObject(72,7,'mouse', this.mice);
        this.spawnObject(79,11,'mouse', this.mice);
        this.spawnObject(80,11,'mouse', this.mice);
        this.spawnObject(81,11,'mouse', this.mice);
        this.spawnObject(82,11,'mouse', this.mice);
        this.spawnObject(85,11,'mouse', this.mice);
        this.spawnObject(53,11,'mouse', this.mice);
        this.spawnObject(86,11,'mouse', this.mice);
        this.spawnObject(87,11,'mouse', this.mice);
        this.spawnObject(81,7,'mouse', this.mice);
        this.spawnObject(82,7,'mouse', this.mice);
        this.spawnObject(83,7,'mouse', this.mice);
        this.spawnObject(84,7,'mouse', this.mice);
        this.spawnObject(85,7,'mouse', this.mice);
        this.spawnObject(92,7,'mouse', this.mice);
        this.spawnObject(93,7,'mouse', this.mice);
        this.spawnObject(94,7,'mouse', this.mice);
        this.spawnObject(95,7,'mouse', this.mice);
        this.spawnObject(128,12,'mouse', this.mice);
        this.spawnObject(129,12,'mouse', this.mice);
        // Create bomb
        this.bombs = this.physics.add.group();

        this.spawnObject(31, 14, 'bomb', this.bombs);
        this.spawnObject(56, 14, 'bomb', this.bombs);
        this.spawnObject(68, 10, 'bomb', this.bombs);
        this.spawnObject(79, 10, 'bomb', this.bombs);
        this.spawnObject(99, 14, 'bomb', this.bombs);
        this.spawnObject(126, 14, 'bomb', this.bombs);
        this.spawnObject(127, 14, 'bomb', this.bombs);
        this.spawnObject(130, 14, 'bomb', this.bombs);
        this.spawnObject(131, 14, 'bomb', this.bombs);
        this.spawnObject(149, 14, 'bomb', this.bombs);
        this.spawnObject(178, 14, 'bomb', this.bombs);
        this.spawnObject(181, 10, 'bomb', this.bombs);
        this.spawnObject(182, 10, 'bomb', this.bombs);

        this.bombs.children.iterate(function (bomb) {
            bomb.scaleX = 2;
            bomb.scaleY = 2;
        });

        // Add goal
        this.goal = this.physics.add.sprite(204 * 32, 0, 'grass_goal');
        this.physics.add.collider(this.cat, this.goal, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        });

        let i = 0;
        this.mice.children.iterate(function (child) {

            i++;
            //  Give each mouse a slightly different bounce
            child.setBounceY(0);
            child.setGravityY(1000);
            child.anims.play('mousewalk');
            if (i%2 === 0) {
                child.flipX = true;
            }
        });

        this.pits.children.iterate(function (child) {

            //  Give each mouse a slightly different bounce
            child.setCollideWorldBounds(true);
        });

        //  Collide the player and the mice with the platforms
        this.physics.add.collider(this.mice, collisionLayer);
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.goal, collisionLayer);
        this.physics.add.collider(this.bombs, collisionLayer);
        this.physics.add.collider(this.pits, collisionLayer);

        //  Checks to see if the player overlaps with any of the mice, if he does call the collectmouse function
        this.physics.add.overlap(this.cat, this.mice, this.collectmouse, null, this);

        this.physics.add.collider(this.cat, this.pits, this.receiveHit, null, this);
        this.physics.add.collider(this.cat, this.bombs, this.receiveHit, null, this);
        this.cameras.main.startFollow(this.cat);

        // should be called at the end to the HUD will be on top
        super.create();
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-350);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('idle', true);
            if (!(this.inAir)){
                this.cat.anims.play('stand');
            }
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
            this.cat.anims.play('idle', true);
            if (!(this.inAir)){
                this.cat.anims.play('stand');
            }
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && Math.abs(this.cat.body.velocity.y) < 1.12) {
            this.cat.setVelocityY(-350);
        }
    }

    collectmouse(player, mouse) {
        mouse.disableBody(true, true);
        try {
            this.sound.play("meow");
        } catch {
            console.log('no audio possible');
        }

        this.addScore();
    }

    receiveHit(player, sender) {
        this.catDies(player);
    }

    spawnObject(x, y, sprite, group) {
        group.create(x * 32 + 16, y * 32, sprite);
    }
    update(time, delta){
        super.update(time, delta);

        this.inAir = false;
        if (Math.abs(this.cat.body.velocity.y) > 4) {
            this.inAir = true;
        }
    }
}
