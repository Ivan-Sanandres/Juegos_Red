var Button = function(scene, posX, posY, image, hoverImage, text, font = 'fuente', clickCallback = function() {console.log("callback not defined")}, scaleX = 0.1, scaleY = 0.1, hoverScale = 1.15)
{
  this.image = image;
  this.hoverImage = hoverImage;
  this.scene = scene;
  this.hoverScale = hoverScale; //Escala cuando el cursor esté encima

  this.icon = scene.add.sprite(posX, posY, image).setScale(scaleX, scaleY)
    .setOrigin(0.5, 0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => this.enterButtonHoverState() )
    .on('pointerout', () => this.enterButtonRestState() )
    .on('pointerdown', () => this.clickCallback(this.scene)
  );

  this.icon.input.cursor = 'url("resources/sprites/calaquita sonriente.png"), pointer'; //cursor custom

  this.info = scene.add.bitmapText(posX, posY, font, text, 11).setOrigin(0.5, 0.4);

  this.enterButtonHoverState = function()
  {
    //se cambian imagen y escala del botón
    this.icon.setTexture(this.hoverImage);
    this.icon.setScale(scaleX *this.hoverScale, scaleY * this.hoverScale);
  }

  this.enterButtonRestState = function()
  {
    //se cambian imagen y escala del botón
    this.icon.setTexture(this.image);
    this.icon.setScale(scaleX, scaleY);
  }

  this.clickCallback = clickCallback;
}

var TextButton = function(scene, parent, posX, posY, text, font = 'fuente', clickCallback = function() {console.log("callback not defined")})
{
  this.posX = posX;
  this.posY = posY;
  this.font = font;
  this.scene = scene;
  this.parent = parent; //padre del botón, en nuestro caso, siempre será una lista de botones
  this.info = scene.add.bitmapText(posX, posY, font, text/* + "999999999999999999999999999999999999"*/, 11)
  .setOrigin(0.5, 0.5);

  this.updateInteraction = function(){
    var t = this.info.text;
    this.info.destroy();  //Se destruye el texto actual para crear uno nuevo, todo ello para que la caja de colisión se adecue al texto
    this.info = scene.add.bitmapText(this.posX, this.posY, this.font, t, 11);
    if(this.info.text !== ""){
      this.info.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState() )
      .on('pointerout', () => this.enterButtonRestState() )
      .on('pointerdown', () => this.clickState()
      );
      this.info.input.cursor = 'url("resources/sprites/calaquita sonriente.png"), pointer';
    }
  }

  this.updateInteraction();

  this.auxValue = 0;  //variable auxiliar del botón que puede usarse para guardar cualquier valor necesario para, por ejemplo, una callback

  this.enterButtonHoverState = function()
  {
    this.info.tint = 0xda85b9;
  }

  this.enterButtonRestState = function()
  {
    this.info.tint = 0xFFFFFF;
  }

  this.clickCallback = clickCallback;

  this.clickState = function(){
    if(this.info.text !== ""){
      this.clickCallback(this.scene, this.parent);
    }
  }
}

var TextButtonList = function(scene, posX, posY, size, updateCallBack, font = 'fuente'){
  this.buttons = [];
  this.lineHeight = 15;   //Espacio entre líneas
  this.info = [];         //Información completa de la lista
  this.currentStart = 0;  //Índice por el que empezar a mostrar la lista
  this.size = size;       //Número de líneas que se van a ver de la lista (pueden ser menos o más que la info)
  this.auxValues = [];    //valores auxiliares que usarán los botones hijos, en nuestro caso guardarán los id de las partidas a las que se refieran

  for(var i = 0; i < size; i++){
    this.buttons.push(new TextButton(scene, this, posX, posY + i * this.lineHeight, i));  //Se añaden los botones a la escena
    this.buttons[i].info.setOrigin(0,0.5);
  }

  this.updateInfo = function(){
    updateCallBack();
    //this.updateButtons();
  }

  this.updateButtons = function(){
    for(var i = 0; i < this.size; i++){ //para cada botón se le asigna la información necesaria (partida y jugador) a partir de current start
      this.buttons[i].info.text = this.info[this.currentStart + i];
      this.buttons[i].auxValue = this.auxValues[this.currentStart + i];
      this.buttons[i].updateInteraction();
    }
  }

  this.goUp = function(){ //ir hacia arriba en la lista
    this.currentStart--;
    this.clampStart();
  }
  this.goDown = function(){ //ir hacia abajo en la lista
    this.currentStart++;
    this.clampStart();
  }
  this.clampStart = function(){ //limitar el valor de current start para que la lista siempre sea visible
    if(this.currentStart < 0) this.currentStart = 0;
    if(this.currentStart >= this.info.length - 1) this.currentStart = this.info.length - 1;
  }
}
