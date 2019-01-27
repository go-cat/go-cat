"use strict";

class StartScene extends BaseLevelScene {
    constructor() {
        super({
            key: 'StartScene',
            showTimer: false,
        });
    }

    preload() {
        super.preload();

        this.load.image('logo', 'assets/images/go_cat_start_transparent_color.png');
        this.load.image('start_button', 'assets/images/go_cat_startbutton_brown.png');
        this.load.image('background', 'assets/images/go_cat_start_background_brown.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.image(400, 300, 'logo');
        this.startButton = this.add.image(400, 508, 'start_button');
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
            this.catLoosesLive();
            this.startNextLevel();
        });

        super.create();
    }
}
