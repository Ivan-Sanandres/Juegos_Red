//La variable la declaro global para que se guarde el valor para el juego. Si ya es true, cuando empiece el juego tampoco sonará música
var muted = false;

//ESCENA MENÚ
var SearchRooms = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'SearchRooms'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function () //Se cargan la fuente, las imágenes y la música de la escena
    {
      this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');
      this.load.audio("menuMusic", "./resources/sound/menuMusic.mp3");

      //cargar datos específicos de esta escena

    },

    create: function () //Código que se ejecuta al generarse la escena
    {
      //CREACIÓN DE TEXTOS
      this.add.bitmapText(74, 25, 'fuente', 'SearchRooms', 33);


      //Se añade la música de fondo, se configura para que se reproduzca en bucle
      menuMusic = this.sound.add("menuMusic");
      menuMusic.play({mute: muted, loop: true});
    },

    update: function (time, delta) //Código que se ejecuta en cada frame de la escena
    {

    }
});
