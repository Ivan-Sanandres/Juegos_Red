const config = {
    type: Phaser.AUTO,
    width: 352,
    height: 176,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

var juan;
var juanSpeed;
var juanMovementVector = new Phaser.Math.Vector2();
var juanCursors;
var juanCamera;

var guard;
var guardCursos;
var guardCamera;

var showDebug = false;

function preload() {
    this.load.image("tiles", "./Tilesheet/colored.png");
    this.load.tilemapTiledJSON("map", "./tileset.json");

    this.load.image("juan", "./Tilesheet/pnj.png");
}

function create() {
    var that = this;

    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("colored", "tiles");
    const worldLayer = map.createStaticLayer("Capa de Patrones 1", tileset, 0, 0);

    worldLayer.setCollisionByProperty({collides: true});

    function initJuan(speed)
    {
      const spawnPointJuan = map.findObject("Objects", obj => obj.name === "Spawn Point");

      juan = that.physics.add
              .sprite(spawnPointJuan.x, spawnPointJuan.y, "juan")
              .setSize(16, 16);

      juanCamera = that.cameras.main;

      juanCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
      juanCamera.setViewport(0, 0);
      juanCamera.setSize(176, 176);
      juanCamera.startFollow(juan, true, 1, 1);

      juanCursors = that.input.keyboard.addKeys(
         {up:Phaser.Input.Keyboard.KeyCodes.W,
          down:Phaser.Input.Keyboard.KeyCodes.S,
          left:Phaser.Input.Keyboard.KeyCodes.A,
          right:Phaser.Input.Keyboard.KeyCodes.D});

      //juanCursors = that.input.keyboard.createCursorKeys();

      juanSpeed = speed;

      that.physics.add.collider(juan, worldLayer);
    }
    initJuan(88);

    /*function initGuard()
    {

    }
    initGuard();

    guardCamera = this.cameras.add(0, 0, 0, 0);
    guardCamera.setViewport(810, 0);

    guardCamera.setScroll(810, 0);

    guardCamera.setSize(800, 600);
    //guardCamera.setBounds(0, 0, 2080, 1200);
    guardCamera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    guardCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
    guardCamera.startFollow(juan, true, 1, 1);*/

}

function update(time, delta) {

  function Move(character, cursors, speed, movementVector)
  {
    movementVector.x = character.body.deltaAbsX();
    movementVector.y = character.body.deltaAbsY();

    movementVector = movementVector.normalize();

    character.setVelocityX(0);
    character.setVelocityY(0);

    if (cursors.up.isDown)
    {
        if(movementVector.y != 0)
          character.setVelocityY(-speed * movementVector.y);
        else
          character.setVelocityY(-speed);
    }

    if(cursors.down.isDown)
    {
        if(movementVector.y != 0)
          character.setVelocityY(speed * movementVector.y);
        else
          character.setVelocityY(speed);
    }

    if (cursors.left.isDown)
    {
        if(movementVector.x != 0)
          character.setVelocityX(-speed * movementVector.x);
        else
          character.setVelocityX(-speed);
    }

    if(cursors.right.isDown)
    {
        if(movementVector.x != 0)
          character.setVelocityX(speed * movementVector.x);
        else
          character.setVelocityX(speed);
    }
  }
  Move(juan, juanCursors, juanSpeed, juanMovementVector);


}
