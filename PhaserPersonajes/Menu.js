var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Menu (config)
    {
        Phaser.Scene.call(this, config)
    },

    init: function (data) {},
    preload: function ()
    {

    },
    create: function (data) {
      this.input.keyboard.on('keyup', function(e){
        if(e.key == '2'){
          this.scene.start("LocalGame")
        }
      })
    },
    update: function (time, delta) {}
});
