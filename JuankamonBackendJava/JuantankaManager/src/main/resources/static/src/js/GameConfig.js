const config = {
    type: Phaser.AUTO,                      //Intentar usar WebGL, si no, usar canvas
    width: 362,
    height: 176,
    backgroundColor: "0x472D3C",
    scale: {
      mode: Phaser.Scale.FIT,               //El juego se escala para ajustarse al máximo espacio disponible sin perder la relación de aspecto
      autoCenter: Phaser.Scale.CENTER_BOTH  //El juego se centra horizontal y verticalmente
    },
    parent: "game-container",               //Div en el que se genera el canvas
    pixelArt: true,                         //Se desactivan las técnicas de antialiasing
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: [ WaitingRoom, NameInput, Menu, SearchRooms, LocalGame, OnlineGame, EndScreen ]              //Configuración escenas del juego y su orden
};

var game = new Phaser.Game(config);
