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
        this.load.image('send', 'assets/images/go_cat_send_button.png');


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
        this.add.image(200, 300, 'middle');


        this.startButton = this.add.image(200, 508, 'button').setScale(0.7);
        this.sendButton = this.add.image(550, 358, 'send').setScale(0.7);
        this.startButton.setInteractive();
        this.sendButton.setInteractive();

        this.startButton.on('pointerover', (event) => {
            this.startButton.setScale(0.75);
        });
        this.startButton.on('pointerdown', (event) => {
            this.startButton.setScale(0.85);
        });
        this.startButton.on('pointerout', (event) => {
            this.startButton.setScale(0.7);
        });
        this.startButton.on('pointerup', (event) => {
            this.startButton.setScale(0.7);
            this.catLoosesLive();
            this.startNextLevel(false, 1);
        });

        this.sendButton.on('pointerover', (event) => {
            this.sendButton.setScale(0.75);
        });
        this.sendButton.on('pointerdown', (event) => {
            this.sendButton.setScale(0.85);
        });
        this.sendButton.on('pointerout', (event) => {
            this.sendButton.setScale(0.7);
        });
        this.sendButton.on('pointerup', (event) => {
            this.sendButton.setScale(0.7);

            document.getElementById("scoreform").value = this.getScore();

            document.getElementById("submitform").click();
            
        });

        super.create();

        this.changeScorePos(430, 280);

        if (this.remainingLives > 0) {

            //TODO POST zu Upload & Leaderboard.

            this.addScore(200 * this.remainingLives);
        }
    }
}
