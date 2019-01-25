class TreeLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        this.load.image('cat', 'assets/images/cat.png');
        this.load.image('background', 'assets/images/TreeLevel/background.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch_20px.png');
        this.load.image('ground', 'assets/images/TreeLevel/ground.png');
        this.load.image('bird', 'assets/images/TreeLevel/bird.png');
    }

    create() {
        // Background
        this.add.image(400, 300, 'background');

        // Our platforms and ground, all static in a group
        platforms = this.physics.add.staticGroup();

        // Create the ground
        platforms.create(400, 2400, 'ground');

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
        cat = this.physics.add.sprite(100, 450, 'cat');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);        
        
        
    }

    update() {

    }
}