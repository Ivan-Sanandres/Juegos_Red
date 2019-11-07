const config = {
    type: Phaser.AUTO,
    width: 362,
    height: 176,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },
    scene = [ Menu, LocalGame ]
    /*scene: {
        preload: preload,
        create: create,
        update: update
    }*/
};

var game = new Phaser.Game(config);
