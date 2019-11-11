var y = 120;
var x = 107;

var aux = 0;

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
        mute: Phaser.Input.Keyboard.KeyCodes.M
      });
      this.add.image(0, 0, "background").setOrigin(0, 0);

      this.add.bitmapText(75, 25, 'fuente', 'JUANTANKAMÓN', 33); //
      this.add.bitmapText(151, 55, 'fuente', 'REDUX', 22);
      this.add.bitmapText(15, 153, 'fuente', 'Juantankamón');
      this.add.bitmapText(295, 153, 'fuente', 'Guardia');

      var wasd = this.add.image(20, 110, 'wasd').setOrigin(0, 0);
      wasd.scale = 2;
      var arrows = this.add.image(284, 110, 'arrows').setOrigin(0, 0);
      arrows.scale = 2;

      space = this.add.bitmapText(x, y, 'fuente', 'Pulsa ESPACIO para comenzar', 11)

      var music = this.sound.add("menuMusic", {mute: false, loop:true});
    },

    update: function (time, delta)
    {
      if(keys.space.isDown)
      {
        this.scene.start("LocalGame");
      }
      if(keys.mute.isDown)
      {
        music.setMute(!mute);
      }

      aux++;

      space.y += Phaser.Math.Easing.Sine.Out(aux/20)/3;
      space.x += Phaser.Math.Easing.Sine.Out(aux/25)/5;
    }
});
