var muted = false;

var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'Menu'} )
    },

    preload: function ()
    {
      var keys;
      this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');

      this.load.image("background", "./resources/sprites/background.png");
      this.load.image("wasd", "./resources/sprites/wasd.png");
      this.load.image("arrows", "./resources/sprites/arrows.png");

      this.load.audio("menuMusic", "./resources/sound/menuMusic.mp3");
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

      this.add.bitmapText(74, 25, 'fuente', 'JUANTANKAMÓN', 33); //
      this.add.bitmapText(152, 55, 'fuente', 'REDUX', 22);
      space = this.add.bitmapText(122, 150, 'fuente', 'ESPACIO para comenzar', 11);
      actions = this.add.bitmapText(143, 110, 'fuente', ['J: ¿Cómo jugar?',
                                                        'M: Quitar música'], 11, 1);

      names1 = this.add.bitmapText(35, 80, 'fuente', ['Martín Ariza',
                                                      'Iván Sanandrés'], 11, 1);
      names2 = this.add.bitmapText(250, 80, 'fuente', ['Pedro Casas',
                                                       'Adrián Vaquero'], 11, 1);
      //credits = this.add.bitmapText();

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

      txtPause = this.add.bitmapText(134, 110, 'fuente', ['P: Pausa (en juego)',
                                                          'J: Volver al menú'], 11, 1);

      txtJuantankamon.visible = false;
      txtGuardia.visible = false;
      txtDescJ.visible = false;
      txtDescG.visible = false;
      txtPause.visible = false;

      wasd = this.add.image(43, 90, 'wasd').setOrigin(0, 0);
      wasd.visible = false;
      arrows = this.add.image(290, 90, 'arrows').setOrigin(0, 0);
      arrows.visible = false;

      menuMusic = this.sound.add("menuMusic");
      menuMusic.play({mute: muted, loop: true});

      //muted = false;

      sineVar = 0;
    },

    update: function (time, delta)
    {
      if(Phaser.Input.Keyboard.JustDown(keys.space)){
        menuMusic.stop();
        this.scene.start("LocalGame");
      }if(Phaser.Input.Keyboard.JustDown(keys.mute)){
        muted = !muted;
        menuMusic.mute = muted;
      }if(Phaser.Input.Keyboard.JustDown(keys.controls)){
        actions.visible = !actions.visible;
        txtJuantankamon.visible = !txtJuantankamon.visible;
        txtGuardia.visible = !txtGuardia.visible;
        txtDescJ.visible = !txtDescJ.visible;
        txtDescG.visible = !txtDescG.visible;
        txtPause.visible = !txtPause.visible;
        names1.visible = !names1.visible;
        names2.visible = !names2.visible;
        wasd.visible = !wasd.visible;
        arrows.visible = !arrows.visible;
      }

      sineVar++;

      space.y += Phaser.Math.Easing.Sine.Out(sineVar/20)/3;
      space.x += Phaser.Math.Easing.Sine.Out(sineVar/25)/5;
    }
});
