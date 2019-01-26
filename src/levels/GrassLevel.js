class GrassLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'GrassLevel' })
    }

    preload() {
        super.preload();

        this.load.tilemapTiledJSON("grass_map","assets/maps/GrassLevel/world.json");
        this.load.image('grass_tiles',"assets/images/GrassLevel/sprites.png");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('bomb', 'assets/images/GrassLevel/bomb.png');
        this.load.image('empty', 'assets/images/GrassLevel/empty.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.image('goal', 'assets/images/house_home_transparent.png');

        // Audio
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
    }

    create() {
        super.create();

        // layer and map for the Tilemap
        let map = this.make.tilemap({ key: "grass_map", tileWidth: 32, tileHeight: 32 });
        let tileset = map.addTilesetImage("grassTileset","grass_tiles");

        let dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        let collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);
        collisionLayer.setCollisionByProperty({ collides: true });

        this.physics.world.setBounds(0,0,6784,576, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 6784, 576);

        // Variables
        this.dogSpeed = 30;
        this.dogSart = 400;
        this.millis = 0;


        // The player and its settings
        this.cat = this.physics.add.sprite(100, 400, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;
        this.cat.scaleY=0.6;
        this.cat.scaleX=0.6;


        // Create pits

        this.pits = this.physics.add.group();
        this.spawnObject(92,17,'empty', this.pits);
        this.spawnObject(93,17,'empty', this.pits);
        this.spawnObject(94,17,'empty', this.pits);
        this.spawnObject(95,17,'empty', this.pits);
        this.spawnObject(106,17,'empty', this.pits);
        this.spawnObject(107,17,'empty', this.pits);
        this.spawnObject(108,17,'empty', this.pits);
        this.spawnObject(139,17,'empty', this.pits);
        this.spawnObject(140,17,'empty', this.pits);
        this.spawnObject(141,17,'empty', this.pits);
        this.spawnObject(152,17,'empty', this.pits);
        this.spawnObject(153,17,'empty', this.pits);


        //  Create mice
        this.mice = this.physics.add.group();
        this.spawnObject(28,8,'mouse', this.mice);
        this.spawnObject(29,8,'mouse', this.mice);
        this.spawnObject(30,8,'mouse', this.mice);
        this.spawnObject(31,8,'mouse', this.mice);

        // Create bomb
        this.bombs = this.physics.add.group({
            key: 'bomb',
            setXY: { x: 420, y: 0}
        });

        // Add goal
        this.goal = this.physics.add.sprite(204*32,0,'goal');
        this.physics.add.collider(this.cat, this.goal, ()=>{
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        });

        this.mice.children.iterate(function (child) {

            //  Give each mouse a slightly different bounce
            child.setBounceY(0);
            child.setGravityY(1000);
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
            this.cat.setVelocityX(1600);
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

    collectmouse (player, mouse)
    {
        mouse.disableBody(true, true);
        this.sound.play("meow");

        this.addScore();
    }

    receiveHit (player, sender)
    {
        this.catDies(player);
    }

    spawnObject (x, y, sprite, group){
        group.create(x*32+16, y*32, sprite);
    }

}
