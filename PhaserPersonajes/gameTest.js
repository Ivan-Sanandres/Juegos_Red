var config = {
    type: Phaser.AUTO, // Automaticamente selecciona WEBGL o Canvas según navegador
    width: 800,
    height: 600,
    physics:{default: 'arcade', //tres tipos: Arcade, Impact, Matter
        arcade: {
            gravity: { y: 300 },
            debug: false //Muestra colliders y dirección de movimiento
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var platforms;
var stars;
var player;
var cursors;

var score = 0;
var scoreText;

var bombs;
var gameOver = false;

var game = new Phaser.Game(config);


function preload () //Cargar elementos al abrir la página (Awake)
{
  //El primer elemento es el textureKey (un id de la imagen) y el segundo el path
  this.load.image('sky', './phaser3-tutorial-src/assets/sky.png');
  this.load.image('ground', './phaser3-tutorial-src/assets/platform.png');
  this.load.image('star', 'phaser3-tutorial-src/assets/star.png');
  this.load.image('bomb', 'phaser3-tutorial-src/assets/bomb.png');
  this.load.spritesheet('dude',
    'phaser3-tutorial-src/assets/dude.png',
    { frameWidth: 32, frameHeight: 48 } //Indicamos tamaño del spritesheet
  );
}

function create () //Start
{
  this.add.image(400, 300, 'sky'); //Los objetos tienen el (0, 0) en el centro
  //podemos usar .setOrigin para cambiar el centro
  //this.add.image(0, 0, 'sky').setOrigin(0, 0) pondría el centro en la esquina superior izquierda
  //    this.add.image(400, 300, 'star');
  //El orden de carga importa, va de más profundo a menos. En este caso ponemos la estrella sobre el fondo

  platforms = this.physics.add.staticGroup(); //Añadimos las plataformas a un grupo de físicas estáticas
/*
A dynamic body is one that can move around via forces such as velocity or acceleration.
It can bounce and collide with other objects and that collision is influenced by the mass of the body and other elements.

a Static Body simply has a position and a size. It isn't touched by gravity,
 you cannot set velocity on it and when something collides with it, it never moves.
*/
//Aquí creamos varias plataformas bajo la variable platforms
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  //el refreshBody sirve para recargar las físicas de un elemento (si es dinámico no hace falta)
  //Esta es una forma de popular un grupo de physics. Ver stars para otra
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  //player en posicion 100, 450 con sprite dude
  player = this.physics.add.sprite(100, 450, 'dude'); //Por defecto tiene physics dynamic

  player.setBounce(0.2); //Rebota al chocar
  player.setCollideWorldBounds(true); //Colisiona con los bordes del mundo (pantalla 800 x 600)

  /*Creamos una animación con nombre 'left'
  *Coge los frames 0, 1, 2, 3 del spritesheet dude y anima a 10fps
  *El -1 en repeat indica que loopea
  NOTA: Las animacione son globales (cualquier GameObject puede accader a ellas, podemos reusarlas)
  */
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });
  //Cuando crear un objeto con physics se le asigna un body (rigidBody)
  //Aquí creamos un collider que monitoriza las colisiones entre dos
  //Objetos con físicas (o dos grupos). Se le puede añadir una callback
  this.physics.add.collider(player, platforms);

  //Input handler de Phaser para las teclas de dirección (creamos cuatro variables Key predefinidas)
  cursors = this.input.keyboard.createCursorKeys();

  //Creamos un grupo de physics dinámico ya que van a rebotar por la escena
  stars = this.physics.add.group({
      key: 'star', //TextureKey de cada elemento del grupo
      repeat: 11, //Creamos 12 hijos (por defecto crea 1 y luego se repite 11 veces)
      //Ponemos el x de cada hijo, empezamos en x=12 y por cada hijo le añadimos un offset de 70 píxeles
      setXY: { x: 12, y: 0, stepX: 70 }
  });

  //Foreach child in stars
  stars.children.iterate(function (child) {
    //Le ponemos bounce random entre 0.4 y 0.8
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  //Posición del texto, valor por defecto, datos de fuente (si no indicamos tipo usa Courier)
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //Collider entre estrellas y plataformas
  this.physics.add.collider(stars, platforms);
  //Overlap handler, si player y stars colisionan se llama a la función collectStar
  //Donde esta null podríamos poner otra callback para realiar otra comprobación custom en el Overlap
  //Si esta otra callback devolviera true etonces llamarías a collectStar
  //This indica el contexto donde debe ocurrir el callback
  this.physics.add.overlap(player, stars, collectStar, null, this);

  //Nuevo grupo dinámico de physics
  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
  if (gameOver) return;

  //Si se pulsa/mantiene pulsada la izquierda cambiamos la velocidad del pj
  //Y reproducimos la animación 'left'
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160); //Va en píxeles/segundo
      player.anims.play('left', true); //el true indica que la animación no se ejecutará si ya se está reproduciendo
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
      player.anims.play('right', true);
  }
  else
  {
      player.setVelocityX(0);
      player.anims.play('turn');
  }

  //Player.body.isTouching.down devuelve true si hay una colisión en la parte de abajo del pj
  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-330);
  }
}

function collectStar (player, star)
{
    //Disable del rigidBody y además oculta el GameObject
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {
          //Resetamos el rigidBody a la nueva posicion o no
          //Nueva posición en x e y
          //Activamos el GameObject
          //Mostramos el GameObject
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
