class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('logo', 'assets/images/go_cat_icon_transparent.png');
        this.load.image('start_button', 'assets/images/go_cat_startbutton_brown.png');
        this.load.image('background', 'assets/images/go_cat_start_background_brown.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.image(400, 300, 'logo');
        this.startButton = this.add.image(400, 500, 'start_button');
        this.startButton.setInteractive();

        this.startButton.on('pointerover', (event) => {
            this.startButton.setScale(1.05);
        });
        this.startButton.on('pointerdown', (event) => {
            this.startButton.setScale(1.15);
        });
        this.startButton.on('pointerout', (event) => {
            this.startButton.setScale(1);
        });
        this.startButton.on('pointerup', (event) => {
            this.startButton.setScale(1);
            this.scene.start('TreeLevel');
        });

        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
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
