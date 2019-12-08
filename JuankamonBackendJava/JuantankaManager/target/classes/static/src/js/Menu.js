//La variable la declaro global para que se guarde el valor para el juego. Si ya es true, cuando empiece el juego tampoco sonará música
var muted = false;

var endGameStates = {JUAN_WINS: "JUAN_WINS", GUARD_WINS: "GUARD_WINS", DISCONNECTION: "DISCONNECTION"}
var endGameState;

//ESCENA MENÚ
var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'Menu'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function () //Se cargan la fuente, las imágenes y la música de la escena
    {
      this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');

      this.load.image("background", "./resources/sprites/background.png");
      this.load.image("wasd", "./resources/sprites/wasd.png");
      this.load.image("arrows", "./resources/sprites/arrows.png");

      this.load.audio("menuMusic", "./resources/sound/menuMusic.mp3");

      this.load.image("buttonIcon", "./resources/sprites/sobreBoton2.png");
      this.load.image("buttonIconHover", "./resources/sprites/sobreBoton.png");
    },

    create: function () //Código que se ejecuta al generarse la escena
    {

      //Se añade la imagen de fondo del menú
      this.add.image(0, 0, "background").setOrigin(0, 0);

      //CREACIÓN DE TEXTOS
      this.add.bitmapText(74, 15, 'fuente', 'JUANTANKAMÓN', 33);
      this.add.bitmapText(152, 45, 'fuente', 'REDUX', 22);

      var playButton = new Button(this, this.cameras.main.width/2, 90, 'buttonIcon', 'buttonIconHover', "Jugar en local", 'fuente', function(that){
        menuMusic.stop();
        that.scene.start("LocalGame");
      }, 0.15);

      var playOnlineButton = new Button(this, this.cameras.main.width/2, 110, 'buttonIcon', 'buttonIconHover', "Jugar online", 'fuente', function(that){
        menuMusic.stop();
        that.scene.start("SearchRooms");
      }, 0.15);

      var musicButton = new Button(this, this.cameras.main.width/2 - 55, 165, 'buttonIcon', 'buttonIconHover', "Desactivar música", 'fuente', function(that){
        muted = !muted;
        menuMusic.mute = muted;
        if(muted) {
          musicButton.info.setText("Activar música");
        } else {
          musicButton.info.setText("Desactivar música");
        }
      }, 0.17);

      function control(){
        musicButton.icon.visible = !musicButton.icon.visible;
        musicButton.info.visible = !musicButton.info.visible;

        backButton.icon.visible = !backButton.icon.visible;
        backButton.info.visible = !backButton.info.visible;

        controlsButton.icon.visible = !controlsButton.icon.visible;
        controlsButton.info.visible = !controlsButton.info.visible;

        txtJuantankamon.visible = !txtJuantankamon.visible;
        txtGuardia.visible = !txtGuardia.visible;
        txtDescJ.visible = !txtDescJ.visible;
        txtDescG.visible = !txtDescG.visible;
        names1.visible = !names1.visible;
        names2.visible = !names2.visible;
        wasd.visible = !wasd.visible;
        arrows.visible = !arrows.visible;
      }

      var backButton = new Button(this, this.cameras.main.width/2, 165, 'buttonIcon', 'buttonIconHover', "Volver", 'fuente', function(that){
        control();
      }, 0.1);

      backButton.icon.visible = false;
      backButton.info.visible = false;

      var controlsButton = new Button(this, this.cameras.main.width/2 + 55, 165, 'buttonIcon', 'buttonIconHover', "Cómo jugar", 'fuente', function(that){
        control();
      }, 0.17);

      names1 = this.add.bitmapText(35, 80, 'fuente', ['Martín Ariza',
                                                      'Iván Sanandrés'], 11, 1);
      names2 = this.add.bitmapText(250, 80, 'fuente', ['Pedro Casas',
                                                       'Adrián Vaquero'], 11, 1);

      txtJuantankamon = this.add.bitmapText(23, 70, 'fuente', 'Juantankamón', 11, 1);
      txtGuardia = this.add.bitmapText(286, 70, 'fuente', 'Guardia', 11);
      txtDescJ = this.add.bitmapText(16, 113, 'fuente', ['¡Tienes que salir',
                                                         'del museo! Reúne',
                                                         'llaves para abrir',
                                                         'las puertas'], 11, 1);
      txtDescG = this.add.bitmapText(255, 113, 'fuente', ['¡Atrapa a la momia!',
                                                          'Mueve la linterna',
                                                          'con el ratón. Puedes',
                                                          'atravesar puertas.'], 11, 1);


      //Los textos que forman parte de la sección ¿Cómo jugar? se esconden para ser revelados cuando se active
      txtJuantankamon.visible = false;
      txtGuardia.visible = false;
      txtDescJ.visible = false;
      txtDescG.visible = false;

      //Se añaden las imágenes de las teclas para la sección ¿Cómo jugar? y se ocultan, igual que los textos
      wasd = this.add.image(43, 90, 'wasd').setOrigin(0, 0);
      wasd.visible = false;
      arrows = this.add.image(290, 90, 'arrows').setOrigin(0, 0);
      arrows.visible = false;

      //Se añade la música de fondo, se configura para que se reproduzca en bucle
      menuMusic = this.sound.add("menuMusic");
      menuMusic.play({mute: muted, loop: true});

      //Variable que se usa para mover el texto de ESPACIO para comenzar
      sineValue = 0;
    },

    update: function (time, delta) //Código que se ejecuta en cada frame de la escena
    {

    }
});
