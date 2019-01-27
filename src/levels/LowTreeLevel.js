"use strict";

class LowTreeLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'LowTreeLevel' })
    }

    preload() {
        super.preload();

        // Tilemap
        this.load.tilemapTiledJSON("lowTree_map","assets/maps/LowTreeLevel/world.json");

        // Images
        this.load.image('tiles',"assets/images/LowTreeLevel/lowTreeTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('home', 'assets/images/house_home_transparent.png');
        this.load.image('birddropping', 'assets/images/bird_dropping.png');
        this.load.image('goal', 'assets/images/house_home_transparent.png');

        // Spritesheet
        this.load.spritesheet('bird', 'assets/images/bird_flying_animated.png', { frameWidth: 30, frameHeight: 30 } );

        // Audio
        this.load.audio('backgroundmusicspace', 'assets/sounds/songs/Iron_Horse.mp3');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("jump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("land", "assets/sounds/movement/land_sfx_movement_jump9_landing.wav");
    }

    create() {
        // layer and map for the Tilemap
        let map = this.make.tilemap({ key: "lowTree_map", tileWidth: 32, tileHeight: 32 });
        let tileset = map.addTilesetImage("lowTreeTileset","tiles");

        let dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        let collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);

        collisionLayer.setCollisionByProperty({ collides: true });


        // bounds
        this.physics.world.setBounds(0, 0, 800, 2400, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 800, 2400);

        // Variables
        this.millis = 0;


        // "Read" the Object-Layers
        this.birdDroppingsLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "birdDroppings";
        })[0];
        this.birdStaticLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "birdStatic";
        })[0];
        this.birdSpawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "birdSpawn";
        })[0];
        this.miceSpawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "miceSpawn";
        })[0];
        this.safezoneLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "safezone";
        })[0];


        // Our goal
        this.goal = this.physics.add.image(688, 2320, 'goal');
        this.goal.body.setAllowGravity(0, 0);


        // Our cat
        this.cat = this.physics.add.sprite(352, 64, 'animcat');
        //this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cat.body.gravity.y = 300;
        //this.cat.scaleY=1;
        //this.cat.scaleX=1;

        // Cat animations
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


        // Flying Birds
        this.birds = this.physics.add.group();
        this.birdAreas = []
        for (let i = 0; i < this.birdSpawnLayer.objects.length; i++) {
          let areaStartX, areaSpeed;
          let areaStartY = this.birdSpawnLayer.objects[i].y-32;
          if (this.miceSpawnLayer.objects[i].name === "left") {
            // flying to the left
            areaStartX = this.birdSpawnLayer.objects[i].x + this.birdSpawnLayer.objects[i].width;
            areaSpeed = Phaser.Math.Between(-50, -80);
          } else {
            // flying to the right
            areaStartX = this.birdSpawnLayer.objects[i].x;
            areaSpeed = Phaser.Math.Between(50, 80);
          }
          this.birdAreas.push({"startX" : areaStartX, "startY" : areaStartY, "speed" : areaSpeed});
        }

        // Bird animation
        this.anims.remove('fly');
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });


        // Create a Mice-Object-Array
        this.mice = [];
        this.miceSprites = this.physics.add.group();
        for(let i = 0; i < this.miceSpawnLayer.objects.length; i++){
            let mouseStartX = this.miceSpawnLayer.objects[i].x ;
            let mouseStartY = this.miceSpawnLayer.objects[i].y-20;
            let mousePath = this.miceSpawnLayer.objects[i].width;
            let mouseSpeed = Phaser.Math.Between(50, 80);
            let sprite = this.physics.add.sprite(mouseStartX, mouseStartY,"mouse");
            sprite.flipX = true;
            sprite.setGravityY(1000);
            this.miceSprites.add(sprite);
            sprite.setVelocityX(mouseSpeed);
            this.mice.push({"sprite" : sprite ,"path": mousePath, "startX": mouseStartX, "speed": mouseSpeed});
        }


        // Safezone
        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x + lay.width/2 , lay.y + lay.height/2 ,"home");
        this.safezone.body.allowGravity = false;
        this.safezone.displayHeight = lay.height;
        this.safezone.displayWidth = lay.width;


        // Decorative Elements
        this.decorativeElements = this.physics.add.staticGroup();
        // Decorative bird droppings
        for(let i = 0; i < this.birdDroppingsLayer.objects.length; i++) {
            let drop = this.birdDroppingsLayer.objects[i];
            let dropEl = this.decorativeElements.create(drop.x, drop.y, 'birddropping');
            dropEl.flipX = Phaser.Math.Between(0, 10) > 5;
        }
        // Decorative static birds
        for(let i = 0; i < this.birdStaticLayer.objects.length; i++) {
            let sBird = this.birdStaticLayer.objects[i];
            let sBirdEl = this.decorativeElements.create(sBird.x, sBird.y, 'bird');
            sBirdEl.flipX = Phaser.Math.Between(0, 10) > 5;
        }


        // Collide events
        // The cat
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.miceSprites, collisionLayer);
        this.physics.add.collider(this.cat, this.birdSprites, () => {
            this.catDies(this.cat);
        });


        this.physics.add.overlap(this.cat, this.miceSprites, this.collectmouse, null, this);
        this.physics.add.overlap(this.cat, this.safezone, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        }, null, this);


        /* //in case the way up there (with the safezone) does not work
        this.physics.add.collider(this.cat, this.goal, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        });
        */

        this.cameras.main.startFollow(this.cat);

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        // delete Birds that are out of sight
        for (let i = 0; i < this.birds.length; i++) {
            let birdX = this.birds[i].x;
            if (birdX < 0 || birdX > 800) {
              this.birds[i].disableBody(true, true);
            }
        }


        // Spawning birds regularly
        let delay = 1500;
        if (this.millis > delay){
            for (let i = 0; i < this.birdAreas.length; i++) {
                let curArea = this.birdAreas[i];
            		let bird = this.birds.create(curArea["startX"], curArea["startY"], 'bird').setScale(2);
            		bird.setBounceY(0);
                bird.setVelocityX(curArea["speed"]);
                bird.flipX = curArea["speed"] < 0;
                bird.flying = false;
            		bird.body.allowGravity = false;
            		bird.body.setCollideWorldBounds(false);

            		bird.anims.play('fly');
            }
            this.millis -= delay;
        }
        this.millis += delta;


        // Mice move
        for(let i =0; i<this.mice.length; i++){
            let currentMouse = this.mice[i];
            if (currentMouse["sprite"].x > currentMouse["startX"]+currentMouse["path"]) {
                currentMouse["sprite"].setVelocityX(-currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === true) {
                    currentMouse["sprite"].flipX = false;
                }
            }
            if (currentMouse["sprite"].x < currentMouse["startX"]){
                currentMouse["sprite"].setVelocityX(currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === false  ) {
                    currentMouse["sprite"].flipX = true;
                }
            }
        }

    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-500);
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
            this.cat.setVelocityX(500);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('stand', true);
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

    collectmouse (cat, mouse)
    {
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
