class SecretLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'SecretLevel' })
    }

    preload() {
        this.load.tilemapTiledJSON("map","assets/maps/SecretLevel/world.json");
        this.load.image('tiles',"assets/images/SecretLevel/spaceTileset.png");
        this.load.image('space', 'assets/images/SecretLevel/space.png');
        this.load.image('ground', 'assets/images/GrassLevel/bottom_green_60px.png');
        this.load.image('star', 'assets/images/GrassLevel/star.png');
        this.load.image('bomb', 'assets/images/GrassLevel/bomb.png');
        this.load.image('spacedog', 'assets/images/SecretLevel/dog.jpg');
        this.load.spritesheet('dude',
            'assets/images/GrassLevel/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        super.create();

        // layer and map for the Tilemap
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage("spacetileset","tiles");

        const dynamicLayer = map.createDynamicLayer("background", tileset, 0, 0);
        const collisionLayer = map.createStaticLayer("obstacles", tileset, 0, 0);
        collisionLayer.setCollisionByProperty({ collides: true });


        this.physics.world.setBounds(0,0,2400,600, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 2400, 600);

        // Variables
        this.score=0;
        this.dogSpeed = 30;


        // The player and its settings
        this.player = this.physics.add.sprite(100, 500, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Create Stars, Bombs and a dog
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.bombs = this.physics.add.group({
            key: 'bomb',
            setXY: { x: 420, y: 0}
        });

        this.stars.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.dog = this.physics.add.sprite(300, 400, 'spacedog');
        this.dog.setVelocityX(this.dogSpeed);

        //  The score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.stars, collisionLayer);
        this.physics.add.collider(this.player, collisionLayer);
        this.physics.add.collider(this.bombs, collisionLayer);
        this.physics.add.collider(this.dog, collisionLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.cameras.main.startFollow(this.player);
    }

    update() {
        if (this.gameOver) {
            return null;
        }
        if (this.dog.x > 500) {
            this.dog.setVelocityX(-this.dogSpeed);
        }
        if (this.dog.x < 300) {
            this.dog.setVelocityX(this.dogSpeed);
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && Math.abs(this.player.body.velocity.y) < 2) {
            this.player.setVelocityY(-350);
            this.player.anims.play('up', true);
        }
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);

        //  Add and update the score
        this.score += 10;
        console.log(this.score);
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0)
        {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;

        }
    }

    hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }

}
