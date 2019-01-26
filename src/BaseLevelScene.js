"use strict";

class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config)
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
    }
}
