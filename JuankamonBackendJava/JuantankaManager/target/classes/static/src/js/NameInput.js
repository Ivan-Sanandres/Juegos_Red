var name;

var NameInput = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function NameInput ()
    {
        Phaser.Scene.call(this, { key: 'NameInput'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function(){},

    create: function()
    {
        that = this;

        var button = document.getElementById("confirm-button");
        var textbox = document.getElementById("name-field");
        button.addEventListener("click", function(event)
        {
            if(textbox.value !== "")
            {
                name = textbox.value;
                button.style.display = "none";
                textbox.style.display = "none";
                that.scene.start("Menu");
            }
        })
    }
})
