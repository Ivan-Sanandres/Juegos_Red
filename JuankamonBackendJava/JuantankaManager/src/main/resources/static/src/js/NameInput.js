var playerName;
var playerId = -1;

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
        var inputContainer = document.getElementById("input-container");
        inputContainer.style.display = "block";
        var button = document.getElementById("confirm-button");
        var textbox = document.getElementById("name-field");

        var maxChars = 12;

        button.addEventListener("click", function(event)
        {
          textbox.ma
            if(textbox.value.length <= maxChars)
            {
              textbox.value = "";
              textbox.placeholder = "Ese nombre es muy largo";
            }

            else if(textbox.value !== "")
            {
                playerName = textbox.value;
                var player = {
                  name : playerName
                }

                //get all PLAYERS
                AJAX_getPlayers(function(p){
                  var exists = false;
                  for(var i = 0; i < p.length; i++){
                    if(playerName === p[i].name) exists = true;
                  }

                  if(exists){
                    textbox.value = "";
                    textbox.placeholder = "Ese nombre ya existe";
                  } else {
                    AJAX_createPlayer(player, function(p){
                      playerId = p.id;
                      console.log("id: " + playerId);
                    });
                    that.scene.start("Menu");
                    button.style.display = "none";
                    textbox.style.display = "none";
                    inputContainer.style.display = "none";
                  }
                });
            }
        })
    }
})
