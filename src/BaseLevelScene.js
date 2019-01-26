"use strict";

class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.xAxisGamepadPressed = false;
        this.yAxisGamepadPressed = false;

        this.timeLeft = 0;
        this.showTimer = config.hasOwnProperty('showTimer') ? config.showTimer : true;
    }

    create() {
        this.input.keyboard.on('keydown', (event) => {
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
            this.timerText = this.add.text(10, 10, BaseLevelScene.formatTime(this.timeLeft));
        }
    }

    static formatTime(time) {
        let timeString = 'time: ' + Math.floor(time);
        let padding = '000';

        return padding.substring(0, padding.length - timeString.length) + timeString;
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
                // TODO time is up
            }
            this.timerText.text = BaseLevelScene.formatTime(this.timeLeft);
        }
    }

    buttonPressedLeft() {}
    buttonPressedRight() {}
    buttonPressedUp() {}
    buttonPressedDown() {}
}
