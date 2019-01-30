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

        let middleImage = 'assets/images/go_cat_endscene.png';
        if (this.remainingLives < 0) {
            middleImage = 'assets/images/go_sad_cat_endscene.png';
        }

        this.load.image('background', 'assets/images/go_cat_start_background_brown.png');
        this.load.image('middle', middleImage);
        this.load.image('button', 'assets/images/go_again_cat_startbutton_brown.png');

        this.load.audio('cat_purr', 'assets/sounds/animals/cat_purr.ogg');
    }

    create() {
        if (this.remainingLives >= 0) {
            this.music = this.sound.add('cat_purr', {loop: true});
            try {
                this.music.play();
            } catch {
                console.log('no audio possible');
            }
        }

        this.add.image(400, 300, 'background');
        this.add.image(400, 300, 'middle');

        this.startButton = this.add.image(400, 508, 'button');
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

        if (this.remainingLives > 0) {
            this.addScore(200 * this.remainingLives);
        }
    }
}
