class TreeLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        this.load.image('cat', 'assets/images/cat.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch_20px.png');
        this.load.image('ground', 'assets/images/TreeLevel/bottom_green_60px.png');
        this.load.image('bird', 'assets/images/TreeLevel/bird.png');
    }

    create() {
        // This are the bounds of our world
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height*4, true, true, true, true);
        this.cameras.main.setBackgroundColor('#89C0FF');

        // Our platforms and ground, all static in a group
        let platforms = this.physics.add.staticGroup();

        // Create the ground
        platforms.create(this.game.config.width/2, this.game.config.height*4, 'ground').setScale(2).refreshBody();

        // Create the branches
        platforms.create(20, 100, 'branch');
        platforms.create(100, 400, 'branch');
        platforms.create(300, 700, 'branch');
        platforms.create(500, 1000, 'branch');
        platforms.create(50, 1300, 'branch');
        platforms.create(200, 1600, 'branch');
        platforms.create(700, 1900, 'branch');
        platforms.create(100, 2200, 'branch');

        // Our cat
        this.cat = this.physics.add.sprite(100, 0, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);

        // Colide events
        this.physics.add.collider(this.cat, platforms);

        /* Initialize the keys */
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


    }

    update() {

        /* react to key presses */
        if (this.leftKey.isDown) {
            this.cat.x -= 10;
        }

        if (this.rightKey.isDown) {
            this.cat.x += 10;
        }
    }
}
