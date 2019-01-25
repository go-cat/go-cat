class TreeLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'TreeLevel' })
    }

    preload() {
        this.load.image('cat', 'assets/images/cat.png');
        this.load.image('branch', 'assets/images/TreeLevel/branch_20px.png');
        this.load.image('ground', 'assets/images/TreeLevel/ground.png');
        this.load.image('bird', 'assets/images/TreeLevel/bird.png');
    }

    create() {

    }

    update() {

    }
}