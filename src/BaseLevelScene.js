"use strict";

class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.xAxisGamepadPressed = false;
        this.yAxisGamepadPressed = false;

        this.timeLeft = 0;
        this.showTimer = config.hasOwnProperty('showTimer') ? config.showTimer : true;

        this.score = 0;
        this.remainingLives = 7;

        this.scenes = [
            'StartScene',
            'TreeLevel',
            'GrassLevel',
            'StreetLevel',
            'SpaceLevel',
            'EndScene',
        ];
        this.currentSceneIndex = this.scenes.indexOf(config.key);
    }

    init(data) {
        this.score = data.hasOwnProperty('score') ? data.score : 0;
        this.remainingLives = data.hasOwnProperty('remainingLives') ? data.remainingLives : 7;
    }

    preload() {
        this.load.audio("falling", "assets/sounds/movement/falling2_sfx_sounds_falling4.wav");
        this.load.audio('angry_cat', 'assets/sounds/animals/cat_angry.ogg');

        this.load.image('touch_arrow', 'assets/images/touch_arrow_right.png');
    }

    create() {
        this.input.keyboard.on('keydown', (event) => {
            switch (event.key) {
                case 'Escape':
                    this.startNextLevel(false, 0);
                    break;
                case '1':
                case 'Enter':
                case ' ':
                    this.catLoosesLive();
                    this.startNextLevel(false, 1);
                    break;
                case '2':
                    this.startNextLevel(false, 2);
                    break;
                case '3':
                    this.startNextLevel(false, 3);
                    break;
                case '4':
                    this.startNextLevel(false, 4);
                    break;
                case '5':
                    this.startNextLevel(false, 5);
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

        this.scoreText = this.add.text(10, 10, 'score:' + BaseLevelScene.formatNumberToText(this.score), {
            fontFamily: 'Monospace',
            fontSize: 24,
            color: '#000000',
        });
        this.scoreText.setStroke('#ffffff', 2);
        this.scoreText.setShadow(2, 2, '#ffffff', 2, true, false);
        this.scoreText.setScrollFactor(0);

        this.livesText = this.add.text(10, 40, 'lives:' + BaseLevelScene.formatNumberToText(this.remainingLives), {
            fontFamily: 'Monospace',
            fontSize: 24,
            color: '#000000',
        });
        this.livesText.setStroke('#ffffff', 2);
        this.livesText.setShadow(2, 2, '#ffffff', 2, true, false);
        this.livesText.setScrollFactor(0);

        if (this.showTimer) {
            this.timeLeft = 120;
            this.timerText = this.add.text(10, 70, 'time: ' + BaseLevelScene.formatNumberToText(this.timeLeft), {
                fontFamily: 'Monospace',
                fontSize: 24,
                color: '#000000',
            });
            this.timerText.setStroke('#ffffff', 2);
            this.timerText.setShadow(2, 2, '#ffffff', 2, true, false);
            this.timerText.setScrollFactor(0);
        }

        if (this.deviceSupportsTouch()) {
            this.leftTouchArrow = this.add.image(60, 540, 'touch_arrow');
            this.leftTouchArrow.angle = 180;
            this.leftTouchArrow.setInteractive();
            this.leftTouchArrow.setScrollFactor(0);
            this.leftTouchArrow.on('pointerdown', (event) => {
                this.buttonPressedLeft(true);
            });
            this.leftTouchArrow.on('pointerup', (event) => {
                this.buttonPressedLeft(false);
            });

            this.rightTouchArrow = this.add.image(170, 540, 'touch_arrow');
            this.rightTouchArrow.setInteractive();
            this.rightTouchArrow.setScrollFactor(0);
            this.rightTouchArrow.on('pointerdown', (event) => {
                this.buttonPressedRight(true);
            });
            this.rightTouchArrow.on('pointerup', (event) => {
                this.buttonPressedRight(false);
            });

            this.downTouchArrow = this.add.image(740, 540, 'touch_arrow');
            this.downTouchArrow.angle = 90;
            this.downTouchArrow.setInteractive();
            this.downTouchArrow.setScrollFactor(0);
            this.downTouchArrow.on('pointerdown', (event) => {
                this.buttonPressedDown(true);
            });
            this.downTouchArrow.on('pointerup', (event) => {
                this.buttonPressedDown(false);
            });

            this.upTouchArrow = this.add.image(740, 430, 'touch_arrow');
            this.upTouchArrow.angle = 270;
            this.upTouchArrow.setInteractive();
            this.upTouchArrow.setScrollFactor(0);
            this.upTouchArrow.on('pointerdown', (event) => {
                this.buttonPressedUp(true);
            });
            this.upTouchArrow.on('pointerup', (event) => {
                this.buttonPressedUp(false);
            });
        }
    }

    static formatNumberToText(number, length = 5) {
        let string = '' + Math.floor(number);
        let padding = ' '.repeat(length - string.length);

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

                for (let b = 0; b < pad.buttons.length; b++) {
                    if (pad.buttons[b].value === 1) {
                        if (this.scenes[this.currentSceneIndex] === 'StartScene') {
                            this.catLoosesLive();
                            this.startNextLevel();
                        }
                        if (this.scenes[this.currentSceneIndex] === 'EndScene') {
                            this.remainingLives = 7;
                            this.startNextLevel(false, 0);
                        }
                    }
                }
            }
        }

        if (this.showTimer) {
            if (this.timeLeft > 0) {
                this.timeLeft -= delta / 1000;
                if (this.timeLeft < 0) {
                    this.timeLeft = 0;
                    this.catDies(this.timerText);
                }
            }
            this.timerText.text = 'time: ' + BaseLevelScene.formatNumberToText(this.timeLeft);
        }
    }

    addScore(score = 10) {
        this.score += score;
        this.scoreText.text = 'score:' + BaseLevelScene.formatNumberToText(this.score);
    }

    startNextLevel(next = true, sceneIndex) {
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }

        let index = this.currentSceneIndex + 1;
        if (next === false) {
            index = sceneIndex;
        }

        let nextScene = 'EndScene';
        if (index < this.scenes.length) {
            nextScene = this.scenes[index];
        }

        if (this.currentSceneIndex === this.scenes.indexOf('EndScene')) {
            this.score = 0;
            this.remainingLives = 6;
        }

        this.scene.start(nextScene, {
            score: this.score,
            remainingLives: this.remainingLives,
        });
    }

    catLoosesLive() {
        if (this.remainingLives === 0) {
            this.startNextLevel(false, this.scenes.indexOf('EndScene'));
        }

        this.remainingLives--;
        this.livesText.text = 'lives:' + BaseLevelScene.formatNumberToText(this.remainingLives);
    }

    catDies(cat) {
        if (this.music && this.music.isPlaying) {
            this.music.stop();
        }

        this.catLoosesLive();

        this.physics.pause();
        cat.setTint(0xff0000);

        try {
            this.sound.play('angry_cat');
        } 
        catch {
            console.log('no audio possible');
        }

        setTimeout(() => {
            this.sound.play('falling');

            cat.setTint(0xffffff);
            this.physics.resume();

            this.startNextLevel(false, this.currentSceneIndex);
        }, 1000);
    }

    deviceSupportsTouch() {
        return (
            'ontouchstart' in window
            || window.DocumentTouch && document instanceof DocumentTouch
        );
    }

    buttonPressedLeft() {}
    buttonPressedRight() {}
    buttonPressedUp() {}
    buttonPressedDown() {}
}
