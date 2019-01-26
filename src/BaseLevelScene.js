"use strict";

class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.xAxisGamepadPressed = false;
        this.yAxisGamepadPressed = false;

        this.timeLeft = 0;
        this.showTimer = config.hasOwnProperty('showTimer') ? config.showTimer : true;

        this.score = 0;
    }

    init(data) {
        this.score = data.hasOwnProperty('score') ? data.score : 0;
    }

    create() {
        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case 'Escape':
                    this.scene.start('StartScene', { score: this.score });
                    break;
                case '1':
                    this.scene.start('TreeLevel', { score: this.score });
                    break;
                case '2':
                    this.scene.start('GrassLevel', { score: this.score });
                    break;
                case '3':
                    this.scene.start('StreetLevel', { score: this.score });
                    break;
                case '4':
                    this.scene.start('SecretLevel', { score: this.score });
                    break;
                case 'ArrowUp':
                case 'w':
                    this.buttonPressedUp(true);
                    break;
                case 'ArrowDown':
                case 's':
                    this.buttonPressedDown(true);
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.buttonPressedLeft(true);
                    break;
                case 'ArrowRight':
                case 'd':
                    this.buttonPressedRight(true);
                    break;
            }
        });

        this.input.keyboard.on('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    this.buttonPressedUp(false);
                    break;
                case 'ArrowDown':
                case 's':
                    this.buttonPressedDown(false);
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.buttonPressedLeft(false);
                    break;
                case 'ArrowRight':
                case 'd':
                    this.buttonPressedRight(false);
                    break;
            }
        });

        if (this.showTimer) {
            this.timeLeft = 120;
            this.timerText = this.add.text(10, 40, 'time:   ' + BaseLevelScene.formatNumberToText(this.timeLeft, 3), {
                fontFamily: 'Monospace',
                fontSize: 24,
                color: '#000000',
            });
            this.timerText.setStroke('#ffffff', 2);
            this.timerText.setShadow(2, 2, '#ffffff', 2, true, false);
            this.timerText.setScrollFactor(0);
        }

        this.scoreText = this.add.text(10, 10, 'score: ' + BaseLevelScene.formatNumberToText(this.score, 4), {
            fontFamily: 'Monospace',
            fontSize: 24,
            color: '#000000',
        });
        this.scoreText.setStroke('#ffffff', 2);
        this.scoreText.setShadow(2, 2, '#ffffff', 2, true, false);
        this.scoreText.setScrollFactor(0);
    }

    static formatNumberToText(number, length) {
        let string = '' + Math.floor(number);
        let padding = '0'.repeat(length - string.length);

        return padding + string;
    }

    update(time, delta) {
        if (this.input.gamepad.total !== 0) {
            let pads = this.input.gamepad.gamepads;
            for (let i = 0; i < pads.length; i++) {
                let pad = pads[i];

                if (!pad) {
                    continue;
                }

                switch (pad.axes[0].value) {
                    case -1:
                        this.xAxisGamepadPressed = true;
                        this.buttonPressedLeft(true);
                        break;
                    case 1:
                        this.xAxisGamepadPressed = true;
                        this.buttonPressedRight(true);
                        break;
                    case 0:
                        if (this.xAxisGamepadPressed) {
                            this.buttonPressedLeft(false);
                            this.buttonPressedRight(false);
                            this.xAxisGamepadPressed = false;
                        }
                        break;
                }

                switch (pad.axes[1].value) {
                    case -1:
                        this.yAxisGamepadPressed = true;
                        this.buttonPressedUp(true);
                        break;
                    case 1:
                        this.yAxisGamepadPressed = true;
                        this.buttonPressedDown(true);
                        break;
                    case 0:
                        if (this.yAxisGamepadPressed) {
                            this.buttonPressedUp(false);
                            this.buttonPressedDown(false);
                            this.yAxisGamepadPressed = false;
                        }
                        break;
                }
            }
        }

        if (this.showTimer) {
            this.timeLeft -= delta / 1000;
            if (this.timeLeft < 0) {
                this.timeLeft = 0;
                // TODO time is up
            }
            this.timerText.text = 'time:   ' + BaseLevelScene.formatNumberToText(this.timeLeft, 3);
        }
    }

    addScore(score) {
        this.score += score;
        this.scoreText.text = 'score: ' + BaseLevelScene.formatNumberToText(this.score, 4);
    }

    buttonPressedLeft() {}
    buttonPressedRight() {}
    buttonPressedUp() {}
    buttonPressedDown() {}
}
