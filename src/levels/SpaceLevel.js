class SpaceLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'SpaceLevel' })
    }

    preload() {
        super.preload();

        this.load.tilemapTiledJSON("map","assets/maps/SpaceLevel/world.json");
        this.load.image('tiles',"assets/images/SpaceLevel/spaceTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('bomb', 'assets/images/GrassLevel/bomb.png');
        this.load.image('dogImage', 'assets/images/SpaceLevel/dog.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('home', 'assets/images/house_home_transparent.png');

        // Audio
        this.load.audio('backgroundmusicspace', 'assets/sounds/songs/Iron_Horse.mp3');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
        this.load.audio("dogLong", "assets/sounds/animals/dog_bark_long.ogg");
        this.load.audio("jump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("land", "assets/sounds/movement/land_sfx_movement_jump9_landing.wav");

    }

    create() {
        // Music!
        this.music = this.sound.add('backgroundmusicspace');
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        // layer and map for the Tilemap
        let map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
        let tileset = map.addTilesetImage("spacetileset","tiles");

        let dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        let collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);

        collisionLayer.setCollisionByProperty({ collides: true });



        // bounds
        this.physics.world.setBounds(0,0,2400,600, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 2400, 600);

        // Variables


        this.millis = 0;


        // The cat and its settings
        this.cat = this.physics.add.sprite(100, 300, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;
        this.cat.scaleY=0.6;
        this.cat.scaleX=0.6;


        // "Read" the Object-Layers
        this.dogSpawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "dogspawn";
        })[0];
        this.miceSpawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "micespawn";
        })[0];
        this.groundLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "ground";
        })[0];
        this.safezoneLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "safezone";
        })[0];

        // Create a Dogs-Object-Array
        this.dogs = [];
        this.dogsSprites = this.physics.add.group();
        for(let i = 0; i < this.dogSpawnLayer.objects.length; i++){
            let dogStartX = this.dogSpawnLayer.objects[i].x;
            let dogStartY = this.dogSpawnLayer.objects[i].y-40;
            let dogPath = this.dogSpawnLayer.objects[i].width;
            let dogSpeed = Phaser.Math.Between(30, 60);
            let sprite = this.physics.add.sprite(dogStartX, dogStartY,"dogImage");
            sprite.setSize(sprite.width*0.8, sprite.height*0.8);
            this.dogsSprites.add(sprite);
            sprite.setVelocityX(dogSpeed);
            sprite.scaleY=0.6;
            sprite.scaleX=0.6;
            this.dogs.push({"sprite" : sprite ,"path": dogPath, "startX": dogStartX, "speed": dogSpeed});
        }

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


        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x + lay.width/2 , lay.y + lay.height/2 ,"home");
        this.safezone.body.allowGravity = false;
        this.safezone.displayHeight = lay.height;
        this.safezone.displayWidth = lay.width;

        let lay2 = this.groundLayer.objects[0];
        this.ground = this.physics.add.image(lay2.x + lay2.width/2 , lay2.y + lay2.height/2 ,"home");
        this.ground.body.allowGravity = false;
        this.ground.displayHeight = lay2.height;
        this.ground.displayWidth = lay2.width;
        this.ground.visible = false;



        //  Collide the cat and the mice with the platforms
        this.physics.add.collider(this.mice, collisionLayer);
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.dogsSprites, collisionLayer);
        this.physics.add.collider(this.miceSprites, collisionLayer);

        this.physics.add.overlap(this.cat, this.miceSprites, this.collectmouse, null, this);
        this.physics.add.overlap(this.cat, this.safezone, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        }, null, this);

        this.physics.add.collider(this.cat, this.dogsSprites, this.hitdog, null, this);
        this.physics.add.collider(this.cat, this.ground, ()=>{this.catDies(this.cat);}, null, this);


        this.cameras.main.startFollow(this.cat);
        // should be called at the end to the HUD will be on top
        super.create();

    }

    update(time, delta) {
        super.update(time, delta);

        for(let i =0; i<this.dogs.length; i++){
            let currentDog = this.dogs[i];
            if (currentDog["sprite"].x > currentDog["startX"]+currentDog["path"]) {
                currentDog["sprite"].setVelocityX(-currentDog["speed"]);
                if (currentDog["sprite"].flipX === false) {
                    currentDog["sprite"].flipX = true;
                }
            }
            if (currentDog["sprite"].x < currentDog["startX"]){
                currentDog["sprite"].setVelocityX(currentDog["speed"]);
                if (currentDog["sprite"].flipX === true  ) {
                    currentDog["sprite"].flipX = false;
                }
            }
        }

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
            try {
                this.sound.play("land");
            } catch {
                console.log('no audio possible');
            }
        }

        if (this.millis > Phaser.Math.Between(100, 8000)){
            try {
                this.sound.play("bark");
            } catch {
                console.log('no audio possible');
            }
            this.millis = 0;
        }
        this.millis +=1;
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-160);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(160);
        } else {
            this.cat.setVelocityX(0);
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && Math.abs(this.cat.body.velocity.y) < 2) {
            this.cat.setVelocityY(-400);
            try {
                this.sound.play("jump");
            } catch {
                console.log('no audio possible');
            }
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


    hitdog (cat, dog)
    {
        try {
            this.sound.play("dogLong");
            this.sound.play("angry_cat");
        } catch {
            console.log('no audio possible');
        }

        this.catDies(cat);
    }
}
