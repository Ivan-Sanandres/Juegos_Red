const config = {
    type: Phaser.AUTO,
    width: 362,
    height: 176,
    backgroundColor: "0x472D3C",
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
    scene: [ Menu, LocalGame ]
};

var game = new Phaser.Game(config);
