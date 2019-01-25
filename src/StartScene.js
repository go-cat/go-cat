class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' })
    }

    preload() {
        this.load.image('logo', 'assets/images/go_cat_icon_transparent.png')
    }

    create() {
        let graphics = this.add.graphics()
        const color1 = 0xffa435
        const color2 = 0xc26700
        const lineHeight = 50
        for (let i = 0; i < this.game.config.height / lineHeight; i++) {
            graphics.fillGradientStyle(color1, color1, color2, color2)
            graphics.fillRect(0, (i * lineHeight), this.game.config.width, lineHeight * 0.1)
            graphics.fillStyle(color2)
            graphics.fillRect(0, ((lineHeight * 0.1) + (i * lineHeight)), this.game.config.width, lineHeight * 0.4)
            graphics.fillGradientStyle(color2, color2, color1, color1)
            graphics.fillRect(0, ((lineHeight * 0.5) + (i * lineHeight)), this.game.config.width, lineHeight * 0.1)
            graphics.fillStyle(color1)
            graphics.fillRect(0, ((lineHeight * 0.6) + (i * lineHeight)), this.game.config.width, lineHeight * 0.4)
        }

        this.add.circle(400, 300, 150, color1)
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
