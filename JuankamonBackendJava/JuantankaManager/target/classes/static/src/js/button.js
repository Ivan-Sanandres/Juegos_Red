var Button = function(scene, posX, posY, image, hoverImage, text, font = 'fuente', clickCallback = function() {console.log("callback not defined")}, scaleX = 0.1, scaleY = 0.1)
{
  this.image = image;
  this.hoverImage = hoverImage;
  this.scene = scene;

  this.icon = scene.add.sprite(posX, posY, image).setScale(scaleX, scaleY)
    .setOrigin(0.5, 0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => this.enterButtonHoverState() )
    .on('pointerout', () => this.enterButtonRestState() )
    .on('pointerdown', () => this.clickCallback(this.scene) );

  this.info = scene.add.bitmapText(posX, posY, font, text, 11).setOrigin(0.5, 0.4);

  this.enterButtonHoverState = function()
  {
    this.icon.setTexture(this.hoverImage);
    this.icon.setScale(scaleX *1.15, scaleY * 1.15);
  }

  this.enterButtonRestState = function()
  {
    this.icon.setTexture(this.image);
    this.icon.setScale(scaleX, scaleY);
  }

  this.clickCallback = clickCallback;
}

var TextButton = function(scene, posX, posY, text, font = 'fuente', clickCallback = function() {console.log("callback not defined")})
{
  this.scene = scene;
  this.info = scene.add.bitmapText(posX, posY, font, text, 11)
  .setOrigin(0.5, 0.5)
  .setInteractive({ useHandCursor: true })
  .on('pointerover', () => this.enterButtonHoverState() )
  .on('pointerout', () => this.enterButtonRestState() )
  .on('pointerdown', () => this.clickState()
  );

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
      this.clickCallback(this.scene);
    }
  }

}

var TextButtonList = function(scene, posX, posY, size, updateCallBack, font = 'fuente'){
  this.buttons = [];
  this.lineHeight = 15;
  this.info = [];
  this.currentStart = 1;
  this.size = size;

  for(var i = 0; i < size; i++){
    this.buttons.push(new TextButton(scene, posX, posY + i * this.lineHeight, i));
    this.buttons[i].info.setOrigin(0,0.5);
  }

  this.updateInfo = function(){
    updateCallBack();
    this.updateButtons();
  }

  this.updateButtons = function(){
    for(var i = 0; i < this.size; i++){
      this.buttons[i].info.text = this.info[this.currentStart + i];
    }
  }

  this.goUp = function(){
    this.currentStart--;
    this.clampStart();
  }
  this.goDown = function(){
    this.currentStart++;
    this.clampStart();
  }
  this.clampStart = function(){
    if(this.currentStart < 0) this.currentStart = 0;
    if(this.currentStart >= this.info.length - this.size) this.currentStart = this.info.length - this.size;
  }
}
