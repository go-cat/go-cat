class Dog extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('spacedog');
        this.setPosition(x, y);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }
}