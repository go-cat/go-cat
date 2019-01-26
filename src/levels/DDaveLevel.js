class DDaveLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'DDaveLevel' })
    }

    preload() {
        super.preload();

        this.load.tilemapTiledJSON("map","assets/maps/DDaveLevel/dave.json");
        this.load.image('tiles',"assets/images/DDaveLevel/DDaveTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('dogImage', 'assets/images/SpaceLevel/dog.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', { frameWidth: 97, frameHeight: 101 });
        this.load.image('home', 'assets/images/house_home_transparent.png');

        // Audio
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
        this.load.audio("dogLong", "assets/sounds/animals/dog_bark_long.ogg");
        this.load.audio("jump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("land", "assets/sounds/movement/land_sfx_movement_jump9_landing.wav");

    }

    create() {
        // layer and map for the Tilemap
        let map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
        let tileset = map.addTilesetImage("dave","tiles");



        let collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);
        collisionLayer.setCollisionByProperty({ collides: true });



        // bounds
        this.physics.world.setBounds(0,0,3200,3200, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 3200, 3200);

        // Variables
        this.millis = 0;
        this.timeout = 1000;


        // The cat and its settings
        this.cat = this.physics.add.sprite(200, 3000, 'cat');
        this.cat.setBounce(0.1);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 500;
        this.cat.scaleY=0.6;
        this.cat.scaleX=0.6;

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


        // "Read" the Object-Layers
        this.dogSpawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "dogspawn";
        })[0];
        this.miceSpawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "micespawn";
        })[0];
        this.safezoneLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "safezone";
        })[0];


        // Create a Dogs-Object-Array
        this.dogs = [];
        this.dogsSprites = this.physics.add.group();
        this.createDogs();


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
            sprite.body.gravity.y=1000;
            this.miceSprites.add(sprite);
            sprite.setVelocityX(mouseSpeed);
            this.mice.push({"sprite" : sprite ,"path": mousePath, "startX": mouseStartX, "speed": mouseSpeed});
        }


        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x + lay.width/2 , lay.y + lay.height/2 ,"home");
        this.safezone.body.allowGravity = false;
        this.safezone.displayHeight = lay.height;
        this.safezone.displayWidth = lay.width;



        //  Collide the cat and the mice with the platforms

        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.miceSprites, collisionLayer);
        this.physics.add.collider(this.dogsSprites, collisionLayer);
        this.physics.add.collider(this.cat, this.dogsSprites, this.hitdog, null, this);


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

        if (this.cat.velocity < 10){
            this.sound.play("land");
        }

        if (this.millis > this.timeout){
            console.log("millis!!")
            this.createDogs();
            this.sound.play("bark");
            this.millis = 0;
            this.timeout = Phaser.Math.Between(800, 8000);
        }
        this.millis +=1;
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-160);
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
            this.cat.setVelocityX(160);
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
            this.cat.setVelocityY(-400);
            this.sound.play("jump");
        }
    }

    collectmouse (cat, mouse)
    {
        mouse.disableBody(true, true);
        this.sound.play("meow");
        //  Add and update the score
        this.addScore();
    }


    hitdog (cat, dog)
    {
        this.sound.play("dogLong");
        this.sound.play("angry_cat");

        this.catDies(cat);
    }

    createDogs() {
        for (let i = 0; i < this.dogSpawnLayer.objects.length; i++) {
            let dogStartX = this.dogSpawnLayer.objects[i].x;
            let dogStartY = this.dogSpawnLayer.objects[i].y - 40;
            let dogSpeed = Phaser.Math.Between(30, 100);
            let sprite = this.physics.add.sprite(dogStartX, dogStartY, "dogImage");
            let dogDirection = 1;
            if (this.dogSpawnLayer.objects[i].properties.left === true) {
                dogDirection = -1;
                sprite.flipX = true;
            }
            sprite.setSize(sprite.width * 0.8, sprite.height * 0.8);
            sprite.body.gravity.y = 1000;
            this.dogsSprites.add(sprite);
            sprite.setVelocityX(dogSpeed * dogDirection);
            sprite.scaleY = 0.6;
            sprite.scaleX = 0.6;
            this.dogs.push({"sprite": sprite, "startX": dogStartX, "speed": dogSpeed});
        }

    }
}
