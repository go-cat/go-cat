class SecretLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'SecretLevel' })
    }

    preload() {
        this.load.tilemapTiledJSON("map","assets/maps/SecretLevel/world.json");
        this.load.image('tiles',"assets/images/SecretLevel/spaceTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('bomb', 'assets/images/GrassLevel/bomb.png');
        this.load.image('dogImage', 'assets/images/SecretLevel/dog.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');

        // Audio
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
        this.load.audio("dogLong", "assets/sounds/animals/dog_bark_long.ogg");
        this.load.audio("angryCat", "assets/sounds/animals/cat_angry.ogg");

    }

    create() {
        // layer and map for the Tilemap
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage("spacetileset","tiles");

        const dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        const collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);

        collisionLayer.setCollisionByProperty({ collides: true });
        console.log(map.objects);


        // bounds
        this.physics.world.setBounds(0,0,2400,600, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 2400, 600);

        // Variables


        this.millis = 0;


        // The cat and its settings
        this.cat = this.physics.add.sprite(2000, 400, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;
        this.cat.scaleY=0.6;
        this.cat.scaleX=0.6;


        //  Create mice, bombs and a dog
        this.mice = this.physics.add.group({
            key: 'mouse',
            repeat: 20,
            setXY: { x: 50, y: 0, stepX: 100 }
        });

        this.bombs = this.physics.add.group({
            key: 'bomb',
            setXY: { x: 420, y: 0}
        });

        this.mice.children.iterate(function (child) {
            //  Give each mouse a slightly different bounce
            child.setBounceY(0);
            child.setGravityY(1000);
            child.setVelocityX(Phaser.Math.FloatBetween(-40, 40));



        });
        this.dogs = [];
        this.dogsSprites = this.physics.add.group();

        this.spawnLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "boxes";
        })[0];
        this.safezoneLayer =  map.objects.filter((maplayer)=> {
            return maplayer.name == "safezone";
        })[0];

        for(let i = 0; i < this.spawnLayer.objects.length; i++){
            let dogStartX = this.spawnLayer.objects[i].x;
            let dogStartY = this.spawnLayer.objects[i].y-50;
            let dogPath = this.spawnLayer.objects[i].width;
            let dogSpeed = 30;
            let sprite = this.physics.add.sprite(dogStartX, dogStartY,"dogImage");
            this.dogsSprites.add(sprite);
            sprite.setVelocityX(dogSpeed);
            sprite.scaleY=0.6;
            sprite.scaleX=0.6;
            this.dogs.push({"sprite" : sprite ,"path": dogPath, "startX": dogStartX, "speed": dogSpeed});

        }



        //this.dog = this.physics.add.sprite(this.dogStartX, this.dogStartY,"dogImage");
        console.log("collisionlayer: ", collisionLayer);
        console.log("safezone: ", this.safezoneLayer);
        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x, lay.y + lay.height/2,"safe");
        this.safezone.body.allowGravity = false;
        this.safezone.width=lay.width;
        this.safezone.height=lay.height;
        this.safezone.visible = false;


        //  Collide the cat and the mice with the platforms
        this.physics.add.collider(this.mice, collisionLayer);
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.bombs, collisionLayer);
        this.physics.add.collider(this.dogsSprites, collisionLayer);

        this.physics.add.overlap(this.cat, this.mice, this.collectmouse, null, this);
        this.physics.add.overlap(this.cat, this.safezone, this.startNextLevel, null, this);

        this.physics.add.collider(this.cat, this.bombs, this.hitbomb, null, this);
        this.physics.add.collider(this.cat, this.dogsSprites, this.hitdog, null, this);

        this.cameras.main.startFollow(this.cat);
        // should be called at the end to the HUD will be on top
        super.create();
        console.log (this.safezone)
    }

    update(time, delta) {
        super.update(time, delta);

        for(let i =0; i<this.dogs.length; i++){
            let currentDog = this.dogs[i];
            if (currentDog["sprite"].x > currentDog["startX"]+currentDog["path"]) {
                currentDog["sprite"].setVelocityX(-currentDog["speed"]);
            }
            if (currentDog["sprite"].x < currentDog["startX"]){
                currentDog["sprite"].setVelocityX(currentDog["speed"]);
            }
        }
        //if (this.dog.x < this.dogStartX){
         //   this.dog.setVelocityX(this.dogSpeed);
        //}
        if (this.millis > Phaser.Math.Between(100, 8000)){
            this.sound.play("bark");
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
        }
    }

    collectmouse (cat, mouse)
    {
        mouse.disableBody(true, true);
        this.sound.play("meow");

        //  Add and update the score
        this.addScore();
        if (this.mice.countActive(true) === 0)
        {
            //  A new batch of mice to collect
            this.mice.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (cat.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;

        }
    }

    hitbomb (cat, bomb)
    {
        this.catDies(cat);
    }

    hitdog (cat, dog)
    {
        this.sound.play("dogLong");
        this.sound.play("angryCat");

        this.catDies(cat);
    }
}
