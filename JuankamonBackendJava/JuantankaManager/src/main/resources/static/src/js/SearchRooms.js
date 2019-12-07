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
      this.load.image("buttonIcon", "./resources/sprites/sobreBoton2.png");
      this.load.image("buttonIconHover", "./resources/sprites/sobreBoton.png");
      this.load.image("arrowUpOff", "./resources/sprites/arrowUpOff.png");
      this.load.image("arrowUpOn", "./resources/sprites/arrowUpOn.png");
      this.load.image("arrowDownOff", "./resources/sprites/arrowDownOff.png");
      this.load.image("arrowDownOn", "./resources/sprites/arrowDownOn.png");
    },

    create: function () //Código que se ejecuta al generarse la escena
    {
      //CREACIÓN DE TEXTOS
      this.add.bitmapText(362/2, 15, 'fuente', 'Lista de partidas abiertas', 11).setOrigin(0.5, 0.5);

      //Se añade la música de fondo, se configura para que se reproduzca en bucle
      menuMusic = this.sound.add("menuMusic");
      menuMusic.play({mute: muted, loop: true});

      var backButton = new Button(this, this.cameras.main.width/2, 165, 'buttonIcon', 'buttonIconHover', "Volver al menú", 'fuente', function(that){
        that.scene.start("Menu");
      }, 0.15);

      var roomList = new TextButtonList(this, this.cameras.main.width/2 - 10, 55, 5, function() {
        roomList.info = [0,1,2,3,4,5,6,7,8,9];
      });
      roomList.updateInfo();

      var upButton = new Button(this, this.cameras.main.width/2 - 100, 50, 'arrowUpOff', 'arrowUpOn', "-", 'fuente', function(that){
        roomList.goUp();
        roomList.updateInfo();
      }, 0.35, 0.25);

      var downButton = new Button(this, this.cameras.main.width/2 - 100, 110, 'arrowDownOff', 'arrowDownOn', "+", 'fuente', function(that){
        roomList.goDown();
        roomList.updateInfo();
      }, 0.35, 0.25);


      //var somebutton = new Button();
      //var testButton = new Button(this, 300, 60, 'buttonIcon', 'buttonIconHover', "xd", 'fuente', 0.1, 0.1);
      //var testButton2 = new TextButton(this, 100, 60, "salu2", 'fuente', 0.1, 0.1);
    },

    update: function (time, delta) //Código que se ejecuta en cada frame de la escena
    {

    }
});
