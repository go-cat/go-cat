let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: true
        }
    },
    scene: [
        StartScene,
        GrassLevel,
        StreetLevel,
        TreeLevel,
        SecretLevel,
        EndScene
    ]
};

let game = new Phaser.Game(config);
