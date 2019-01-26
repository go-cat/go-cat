class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config)
    }

    create() {
        this.input.keyboard.on('keydown', (event) => {
            console.log(event.key);
            switch (event.key) {
                case 'Escape':
                    this.scene.start('StartScene');
                    break;
                case '1':
                    this.scene.start('TreeLevel');
                    break;
                case '2':
                    this.scene.start('GrassLevel');
                    break;
                case '3':
                    this.scene.start('StreetLevel');
                    break;
                case '4':
                    this.scene.start('SecretLevel');
                    break;
            }
        });
    }
}
