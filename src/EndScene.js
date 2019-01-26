"use strict";

class EndScene extends BaseLevelScene {
    constructor() {
        super({
            key: 'EndScene',
            showTimer: false,
        });
    }

    preload() {
        super.preload();

        this.load.image('background', 'assets/images/go_cat_start_background_brown.png');
        this.load.image('middle', 'assets/images/go_cat_endscene.png');
        this.load.image('button', 'assets/images/go_again_cat_startbutton_brown.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.image(400, 300, 'middle');

        this.startButton = this.add.image(400, 505, 'button');
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
            this.startNextLevel(false, 1);
        });

        super.create();
    }
}
