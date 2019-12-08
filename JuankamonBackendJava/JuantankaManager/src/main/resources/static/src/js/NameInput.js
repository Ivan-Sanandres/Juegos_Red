var playerName;
var playerId = -1;

var NameInput = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function NameInput ()
    {
        Phaser.Scene.call(this, { key: 'NameInput'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    create: function()
    {
        that = this;
        var inputContainer = document.getElementById("input-container");  // Se recibe  del DOM el div que contiene el botón y el campo de texto
        inputContainer.style.display = "block";                           // Se muestra por pantalla (estaba en "none", oculto)
        var button = document.getElementById("confirm-button");           // Se recibe el botón de confirmación
        var textbox = document.getElementById("name-field");              // Se recibe el campo de texto

        button.addEventListener("click", function(event)                  // Al pulsar el botón:
        {
            if(textbox.value !== "")                                      // No se puede avanzar a menos que se escriba algo en el campo de texto
            {
                playerName = textbox.value;                               // Se asigna el nombre del jugador
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
                    that.scene.start("Menu");                             // Se pasa a la escena menú
                    button.style.display = "none";
                    textbox.style.display = "none";
                    inputContainer.style.display = "none";
                  }
                });
            }
        })
    }
})
