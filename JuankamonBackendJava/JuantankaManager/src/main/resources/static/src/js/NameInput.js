var playerName;
var playerId = -1;

var NameInput = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function NameInput ()
    {
        Phaser.Scene.call(this, { key: 'NameInput'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function()
    {
      this.load.image("genericBackground", "./resources/sprites/genericBackground.png");
    },

    create: function()
    {
      this.add.image(0, 0, "genericBackground").setOrigin(0, 0);

      that = this;
      var inputContainer = document.getElementById("input-container");
      inputContainer.style.display = "block";
      var button = document.getElementById("confirm-button");
      var textbox = document.getElementById("name-field");
      button.style.display = "inline";
      textbox.style.display = "inline";
      inputContainer.style.display = "inline";

      button.addEventListener("click", function(event)
      {
          if(textbox.value !== "")
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
