let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: [
        StartScene,
        GrassLevel,
        StreetLevel,
        TreeLevel,
        EndScene
    ]
};

let game = new Phaser.Game(config);