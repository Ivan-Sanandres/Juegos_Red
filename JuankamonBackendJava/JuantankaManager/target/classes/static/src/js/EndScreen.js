var EndScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function EndScreen ()
    {
        Phaser.Scene.call(this, { key: 'EndScreen'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function()
    {
        this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');

        //this.load.image("juanWinsBG", "./resources/sprites/background.png");
        //this.load.image("guardWinsBG", "./resources/sprites/background.png");
    },

    create: function()
    {
        if(endGameState == endGameStates.JUAN_WINS)
        {
            this.add.image(0, 0, 'background').setOrigin(0, 0);
            this.add.bitmapText(152, 55, 'fuente', 'LA MOMIA A GANAO', 22);
        }
        else if(endGameState == endGameStates.GUARD_WINS)
        {
            this.add.image(0, 0, 'background').setOrigin(0, 0);
            this.add.bitmapText(152, 55, 'fuente', 'POS EL GUARDIA A GANAO :/', 22);
        }

        var timerInput = this.time.addEvent({
          delay: 5000,
          callback: periodicPut,
          //args: [],
          callbackScope: this,
          loop: true
      });
    }
})

function periodicPut()
{
  var player = {
    id: playerId,
    name: playerName
  }
  AJAX_updatePlayer(player)
}
