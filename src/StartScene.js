class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' })
    }

    preload() {
        this.load.image('logo', 'assets/images/go_cat_icon.png')
    }

    create() {
        this.add.image(400, 300, 'logo')

        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case '1':
                    this.scene.start('TreeLevel')
                    break;
                case '2':
                    this.scene.start('GrassLevel')
                    break;
                case '3':
                    this.scene.start('StreetLevel')
                    break;
            }
        })
    }
}
