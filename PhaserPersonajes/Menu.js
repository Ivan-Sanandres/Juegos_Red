var y = 120;
var x = 107;

var aux = 0;
var music;

var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'Menu'} )
    },

    preload: function ()
    {
      var keys;
      this.load.bitmapFont('fuente', './Tilesheet/font/MC_0.png', './Tilesheet/font/MC.fnt');

      this.load.image("background", "./Tilesheet/background.png");
      this.load.image("wasd", "./Tilesheet/wasd.png");
      this.load.image("arrows", "./Tilesheet/arrows.png");

      this.load.audio("menuMusic", "./menuMusic.wav");
    },

    create: function ()
    {
      this.cameras.main.setBackgroundColor('rgba(71, 45, 60, 1)');
      keys = this.input.keyboard.addKeys({
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        mute: Phaser.Input.Keyboard.KeyCodes.M,
        controls: Phaser.Input.Keyboard.KeyCodes.J
      });
      this.add.image(0, 0, "background").setOrigin(0, 0);

      this.add.bitmapText(75, 25, 'fuente', 'JUANTANKAMÓN', 33); //
      this.add.bitmapText(151, 55, 'fuente', 'REDUX', 22);
      txtJuantankamon = this.add.bitmapText(23, 70, 'fuente', 'Juantankamón', 11, 1);
      txtGuardia = this.add.bitmapText(285, 70, 'fuente', 'Guardia', 11);
      txtDescJ = this.add.bitmapText(16, 113, 'fuente', ['¡Tienes que salir',
                                                         'del museo! Reúne',
                                                         'llaves para abrir',
                                                         'las puertas'], 11, 1);
      txtDescG = this.add.bitmapText(255, 113, 'fuente', ['¡Atrapa a la momia!',
                                                          'Mueve la linterna',
                                                          'con el ratón. Puedes',
                                                          'atravesar puertas.'], 11, 1);
      //txtDescJ.width = 142;

      txtJuantankamon.visible = false;
      txtGuardia.visible = false;
      txtDescJ.visible = false;
      txtDescG.visible = false;

      wasd = this.add.image(43, 90, 'wasd').setOrigin(0, 0);
      wasd.visible = false;
      arrows = this.add.image(290, 90, 'arrows').setOrigin(0, 0);
      arrows.visible = false;

      space = this.add.bitmapText(x, y, 'fuente', 'Pulsa ESPACIO para comenzar', 11)

      music = this.sound.add("menuMusic");
      music.play({mute: false, loop: true})

      muted = false;
    },

    update: function (time, delta)
    {
      if(Phaser.Input.Keyboard.JustDown(keys.space)){
        music.stop;
        this.scene.start("LocalGame");
      }if(Phaser.Input.Keyboard.JustDown(keys.mute)){
        muted = !muted;
        music.mute = muted;
      }if(Phaser.Input.Keyboard.JustDown(keys.controls)){
        txtJuantankamon.visible = !txtJuantankamon.visible;
        txtGuardia.visible = !txtGuardia.visible;
        txtDescJ.visible = !txtDescJ.visible;
        txtDescG.visible = !txtDescG.visible;
        wasd.visible = !wasd.visible;
        arrows.visible = !arrows.visible;
        space.visible = !space.visible;
      }

      aux++;

      space.y += Phaser.Math.Easing.Sine.Out(aux/20)/3;
      space.x += Phaser.Math.Easing.Sine.Out(aux/25)/5;
    }
});
