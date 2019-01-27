"use strict";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    input: {
        gamepad: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 100},
            debug: false,
        }
    },
    scene: [
        StartScene,
        GrassLevel,
        StreetLevel,
        TreeLevel,
        SpaceLevel,
        DDaveLevel,
        LowTreeLevel,
        BeachLevel,
        EndScene,
    ],
};

let game = new Phaser.Game(config);
