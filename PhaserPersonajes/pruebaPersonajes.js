const config = {
    type: Phaser.AUTO,
    width: 362,
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
var guardSpeed;
var guardMovementVector = new Phaser.Math.Vector2();
var guardCursors;
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

      juanSpeed = speed;

      that.physics.add.collider(juan, worldLayer);
    }
    initJuan(90);

    function initGuard(speed)
    {
      const spawnPointGuard = map.findObject("Objects", obj => obj.name === "Spawn Point");

      guard = that.physics.add
              .sprite(spawnPointGuard.x, spawnPointGuard.y, "juan")
              .setSize(16, 16);

      guardCamera = that.cameras.add(0, 0, 0, 0);

      guardCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
      guardCamera.setViewport(186, 0);
      guardCamera.setScroll(186, 0);
      guardCamera.setSize(176, 176);
      guardCamera.startFollow(guard, true, 1, 1);

      guardCursors = that.input.keyboard.createCursorKeys();
      guardSpeed = speed;

      that.physics.add.collider(guard, worldLayer);
    }
    initGuard(100);

    this.physics.add.overlap(juan, guard, juanCatched, null, this);
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
  Move(guard, guardCursors, guardSpeed, guardMovementVector);
}

function juanCatched()
{
  console.log("pillao");
}
