class SecretLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'SecretLevel' })
    }

    preload() {
        this.load.tilemapTiledJSON("map","assets/maps/SecretLevel/world.json");
        this.load.image('tiles',"assets/images/SecretLevel/spaceTileset.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('bomb', 'assets/images/GrassLevel/bomb.png');
        this.load.image('spacedog', 'assets/images/SecretLevel/dog.jpg');
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
        this.dogSpeed = 30;
        for(let i = 0; i < map.objects[0].objects.length; i++){
            this.dogStart = map.objects[0].objects[i].x;
            this.dogPath = map.objects[0].objects[i].width;
        }

        console.log(map.objects[0].objects[0].x);
        this.millis = 0;


        // The cat and its settings
        this.cat = this.physics.add.sprite(100, 400, 'cat');
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

        this.dog = this.physics.add.sprite(this.dogSart, 200, 'spacedog');
        this.dog.setVelocityX(this.dogSpeed);

        //  Collide the cat and the mice with the platforms
        this.physics.add.collider(this.mice, collisionLayer);
        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.bombs, collisionLayer);
        this.physics.add.collider(this.dog, collisionLayer);

        //  Checks to see if the cat overlaps with any of the mice, if he does call the collectmouse function
        this.physics.add.overlap(this.cat, this.mice, this.collectmouse, null, this);

        this.physics.add.collider(this.cat, this.bombs, this.hitbomb, null, this);
        this.cameras.main.startFollow(this.cat);

        this.physics.add.collider(this.cat, this.bombs, this.hitbomb, null, this);
        this.cameras.main.startFollow(this.cat);

        // should be called at the end to the HUD will be on top
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        if (this.gameOver) {
            return null;
        }
        if (this.dog.x > this.dogStart+this.dogPath){
            this.dog.setVelocityX(-this.dogSpeed);
        }
        if (this.dog.x < this.dogStart){
            this.dog.setVelocityX(this.dogSpeed);
        }
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
            this.cat.setVelocityY(-350);
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
        this.physics.pause();

        cat.setTint(0xff0000);

        cat.anims.play('turn');

        this.gameOver = true;
    }
    hitdog (cat, dog)
    {
        this.physics.pause();
        cat.setTint(0xff0000);
        this.sound.play("dogLong");
        this.sound.play("angryCat");
        this.gameOver = true;
    }
}
