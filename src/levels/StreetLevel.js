class StreetLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'StreetLevel' })
    }

    preload() {
        this.load.image('grass', 'assets/images/StreetLevel/grass.png');
        this.load.image('car', 'assets/images/StreetLevel/car.png');
        this.load.image('cat', 'assets/images/cat.png')
    }

    create() {
        // Our platforms and ground, all static in a group
        let platforms = this.physics.add.staticGroup();

        this.add.image(0, 0, 'grass').setOrigin(0, 0);

        this.cat = this.physics.add.sprite(100, 0, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cat.body.setAllowGravity(0,0);

        this.car = this.physics.add.image(0, 50, 'car');
        this.car.body.setAllowGravity(0,0);
        this.target = new Phaser.Math.Vector2();
        this.target.x=800;
        this.target.y=50;
        this.physics.moveToObject(this.car, this.target, 200);

        /* Initialize the keys */
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        var distance = Phaser.Math.Distance.Between(this.car.x, this.car.y, this.target.x, this.target.y);

        if (this.car.body.speed > 0)
        {
            // distanceText.setText('Distance: ' + distance);

            //  4 is our distance tolerance, i.e. how close the source can get to the target
            //  before it is considered as being there. The faster it moves, the more tolerance is required.
            if (distance < 4)
            {
                this.car.body.reset(this.target.x, this.target.y);
            }
        }

        /* react to key presses */
        if (this.leftKey.isDown) {
            this.cat.x -= 5;
        }

        if (this.rightKey.isDown) {
            this.cat.x += 5;
        }

        if (this.upKey.isDown) {
            this.cat.y -= 5;
        }
        if (this.downKey.isDown) {
            this.cat.y += 5;
        }
    }
}
