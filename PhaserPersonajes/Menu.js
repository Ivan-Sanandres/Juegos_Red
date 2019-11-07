var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'Menu'} )
    },

    /*init: function (data)
    {

    },*/

    preload: function ()
    {
      var keys;
    },

    create: function ()
    {
      keys = this.input.keyboard.addKeys(
        {
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
        }
      );
    },

    update: function (time, delta)
    {
      if(keys.space.isDown)
      {
        this.scene.start("LocalGame");
      }
    }
});
