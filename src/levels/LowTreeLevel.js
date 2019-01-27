"use strict";

class LowTreeLevel extends BaseLevelScene {
    constructor() {
        super({key: 'LowTreeLevel'})
    }

    preload() {
        super.preload();

        // Tilemap
        this.load.tilemapTiledJSON("lowTree_map", "assets/maps/LowTreeLevel/world.json");

        // Images
        this.load.image('lowTree_tiles', "assets/images/LowTreeLevel/lowTreeTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('home', 'assets/images/house_home_transparent.png');
        this.load.image('birddropping', 'assets/images/bird_dropping.png');
        this.load.image('goal', 'assets/images/house_home_transparent.png');

        // Spritesheet
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', {frameWidth: 97, frameHeight: 101});
        this.load.spritesheet('bird', 'assets/images/bird_flying_animated.png', {frameWidth: 30, frameHeight: 30});

        // Audio
        this.load.audio('backgroundmusiclowtree', 'assets/sounds/songs/Iron_Horse.mp3');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("jump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("land", "assets/sounds/movement/land_sfx_movement_jump9_landing.wav");
    }

    create() {
        this.inAir = false;
        // Music!
        this.music = this.sound.add('backgroundmusiclowtree');
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        // layer and map for the Tilemap
        let map = this.make.tilemap({key: "lowTree_map", tileWidth: 32, tileHeight: 32});
        let tileset = map.addTilesetImage("lowTreeTileset", "lowTree_tiles");

        let dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        let collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);

        collisionLayer.setCollisionByProperty({collides: true});

        // bounds
        this.physics.world.setBounds(0, 0, 800, 2400, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 800, 2400);

        // "Read" the Object-Layers
        this.birdDroppingsLayer = map.objects.filter((maplayer) => {
            return maplayer.name == "birdDroppings";
        })[0];
        this.birdStaticLayer = map.objects.filter((maplayer) => {
            return maplayer.name == "birdStatic";
        })[0];
        this.birdSpawnLayer = map.objects.filter((maplayer) => {
            return maplayer.name == "birdSpawn";
        })[0];
        this.miceSpawnLayer = map.objects.filter((maplayer) => {
            return maplayer.name == "miceSpawn";
        })[0];
        this.safezoneLayer = map.objects.filter((maplayer) => {
            return maplayer.name == "safezone";
        })[0];

        // Our cat
        this.cat = this.physics.add.sprite(384, 64, 'animcat');
        //this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cat.body.gravity.y = 500;
        this.cat.scaleY = 0.7;
        this.cat.scaleX = 0.7;

        // Cat animations
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

        // Flying Birds
        this.birds = this.physics.add.group();
        this.birdAreas = [];
        for (let i = 0; i < this.birdSpawnLayer.objects.length; i++) {
            let curSpawnArea = this.birdSpawnLayer.objects[i];
            let areaStartX;
            let areaStartY = curSpawnArea.y + (curSpawnArea.height / 2);
            let areaSpeed = curSpawnArea.properties[1].value;
            let areaSpawnTime = curSpawnArea.properties[0].value;

            if (areaSpeed < 0) {
                // flying to the left
                areaStartX = curSpawnArea.x + curSpawnArea.width;
            } else {
                // flying to the right
                areaStartX = curSpawnArea.x;
            }
            this.birdAreas.push({
                "startX": areaStartX,
                "startY": areaStartY,
                "speed": areaSpeed,
                "spawnTime": areaSpawnTime,
                "curTime": 0
            });
        }

        // Bird animation
        this.anims.remove('fly');
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });

        // Create a Mice-Object-Array
        this.mice = [];
        this.miceSprites = this.physics.add.group();
        for (let i = 0; i < this.miceSpawnLayer.objects.length; i++) {
            let mouseStartX = this.miceSpawnLayer.objects[i].x;
            let mouseStartY = this.miceSpawnLayer.objects[i].y + 20;
            let mousePath = this.miceSpawnLayer.objects[i].width;
            let mouseSpeed = Phaser.Math.Between(50, 80);
            let sprite = this.physics.add.sprite(mouseStartX, mouseStartY, "mouse");
            sprite.flipX = true;
            sprite.setGravityY(1000);
            this.miceSprites.add(sprite);
            sprite.setVelocityX(mouseSpeed);
            this.mice.push({"sprite": sprite, "path": mousePath, "startX": mouseStartX, "speed": mouseSpeed});
        }

        // Safezone
        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x + lay.width / 2, lay.y + lay.height / 2, "home");
        this.safezone.body.allowGravity = false;
        this.safezone.displayHeight = lay.height;
        this.safezone.displayWidth = lay.width;

        // Decorative Elements
        this.decorativeElements = this.physics.add.group();
        // Decorative bird droppings
        for (let i = 0; i < this.birdDroppingsLayer.objects.length; i++) {
            let drop = this.birdDroppingsLayer.objects[i];
            let dropEl = this.decorativeElements.create(drop.x + (drop.width / 2), drop.y, 'birddropping');
            dropEl.setScale(Phaser.Math.Between(1.8, 2.1));
            dropEl.flipX = Phaser.Math.Between(0, 10) > 5;
        }
        // Decorative static birds
        for (let i = 0; i < this.birdStaticLayer.objects.length; i++) {
            let sBird = this.birdStaticLayer.objects[i];
            let sBirdEl = this.decorativeElements.create(sBird.x, sBird.y, 'bird');
            sBirdEl.flipX = Phaser.Math.Between(0, 10) > 5;
        }

        // Collide events
        // The cat
        this.physics.add.collider(this.decorativeElements, collisionLayer);
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.miceSprites, collisionLayer);
        this.physics.add.collider(this.cat, this.birds, () => {
            this.catDies(this.cat);
        });

        this.physics.add.overlap(this.cat, this.miceSprites, this.collectmouse, null, this);
        this.physics.add.overlap(this.cat, this.safezone, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        }, null, this);

        this.cameras.main.startFollow(this.cat);

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        this.inAir = false;
        if (Math.abs(this.cat.body.velocity.y) > 1) {
            this.inAir = true;
        }
        // delete Birds that are out of sight
        for (let i = 0; i < this.birds.length; i++) {
            let birdX = this.birds[i].x;
            if (birdX < 0 || birdX > 800) {
                this.birds[i].disableBody(true, true);
            }
        }

        // Spawning birds
        for (let i = 0; i < this.birdAreas.length; i++) {
            let curArea = this.birdAreas[i];
            if (curArea["curTime"] <= 0) {
                curArea["curTime"] += curArea["spawnTime"] * 100;
                let bird = this.birds.create(curArea["startX"], curArea["startY"], 'bird').setScale(1.2);
                bird.setBounceY(0);
                bird.setVelocityX(curArea["speed"]);
                bird.flipX = curArea["speed"] > 0;
                bird.flying = false;
                bird.body.allowGravity = false;
                bird.body.setCollideWorldBounds(false);

                bird.anims.play('fly');
            }
            curArea["curTime"] -= delta * Math.abs(curArea["speed"]) / 10;
        }

        // Mice move
        for (let i = 0; i < this.mice.length; i++) {
            let currentMouse = this.mice[i];
            if (currentMouse["sprite"].x > currentMouse["startX"] + currentMouse["path"]) {
                currentMouse["sprite"].setVelocityX(-currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === true) {
                    currentMouse["sprite"].flipX = false;
                }
            }
            if (currentMouse["sprite"].x < currentMouse["startX"]) {
                currentMouse["sprite"].setVelocityX(currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === false) {
                    currentMouse["sprite"].flipX = true;
                }
            }
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-200);
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
            this.cat.setVelocityX(200);
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
        if (pressed && Math.abs(this.cat.body.velocity.y) < 0.18) {
            this.cat.setVelocityY(-420);
        }
    }

    collectmouse(cat, mouse) {
        mouse.disableBody(true, true);
        try {
            this.sound.play("meow");
        } catch {
            console.log('no audio possible');
        }
        //  Add and update the score
        this.addScore();
    }
}
