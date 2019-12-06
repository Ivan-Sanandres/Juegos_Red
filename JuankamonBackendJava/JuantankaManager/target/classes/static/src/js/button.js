var Button = function(scene, posX, posY, image, hoverImage, text, font, clickCallback = function() {console.log("callback not defined")}, scaleX = 0.1, scaleY = 0.1)
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

  this.info = scene.add.bitmapText(posX, posY, font, text, 11).setOrigin(0.5, 0.5);

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

var TextButton = function(scene, posX, posY, text, font, scaleX = 0.1, scaleY = 0.1, clickCallback = function() {console.log("callback not defined")})
{
    this.scene = scene;
  this.info = scene.add.bitmapText(posX, posY, font, text, 11)
  .setOrigin(0.5, 0.5)
  .setInteractive({ useHandCursor: true })
  .on('pointerover', () => this.enterButtonHoverState() )
  .on('pointerout', () => this.enterButtonRestState() )
  .on('pointerdown', () => this.clickCallback(this.scene) );

  this.enterButtonHoverState = function()
  {
    this.info.tint = 0xda85b9;
  }

  this.enterButtonRestState = function()
  {
    this.info.tint = 0xFFFFFF;
  }

  this.clickCallback = clickCallback;
}
