var config = {
        type: Phaser.AUTO,
        width: 176,
        height: 176,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create
        }
    };

    var game = new Phaser.Game(config);
    var lightManager;

    function preload ()
    {
        this.load.image('tileSheet', './assets/test/tileSheet.png')
        this.load.image('floor', './assets/test/floor.png');
        this.load.image('block', './assets/test/block.png');
    }

    function create ()
    {
        var floorSprite = this.add
        .sprite(0,0,'floor')
        .setOrigin(0,0)
        .setScale(4.0)
        ;



        /*var tileSheetSprite = this.add
        .sprite(0,0,'tileSheet')
        .setOrigin(0,0)
        .setScale(1.0)
        ;*/

        var blockSprite = this.add
        .sprite(90,90,'block')
        .setOrigin(0,0)
        .setScale(1.0)
        ;

        var cam1 = this.cameras.main;
        cam1.x = 0;
        cam1.y = 0;

        lightManager = new LightingManager(this.game, [cam1]);

        lightManager.addLight(0, new Light_focal([650.0,0.0],[0.0,0.0],4.0,3.0,[1.0,1.0,0.5],1.0));
        lightManager.addLight(0, new Light_focal([10.0,0.0],[0.0,0.0],0.0,4.0,[0.5,0.5,1.0],1.0));
        lightManager.updateAllUniforms();

        //LIGHT POSITION
        this.input.on('pointermove', function(pointer){
          var lastPos = lightManager.cameras[0][1][0].position;
          //var dir = [pointer.x - lastPos[0], pointer.y - lastPos[1]];
          lightManager.cameras[0][1][0].position = [pointer.x, pointer.y];
          //if(dir[0] != 0 || dir[1] != 0) lightManager.cameras[0][1][0].direction = dir;



          /*var pos = lightManager.cameras[0][1][1].position;
          pos[1] = pos[1] +2.0;
          if(pos[1] > 800.0) pos[1] = 0.0;*/

          lightManager.updateAllUniforms();
        });
        //sprite.setPipeline('Invert');


        //var cam2 = this.cameras.add(0,0,800,600);



        //cam2.setRenderToTexture(this.invertPipeline);

        //cam2.setRenderToTexture(this.invertPipeline);
        //cam2.setPipeline('Invert');

        //this.cameras.main.setRenderToTexture(this.invertPipeline);
        //this.add.image(400, 300, 'sky');

        //var particles = this.add.particles('red');

        /*var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });*/



        //logo.setVelocity(100, 200);
        //logo.setBounce(1, 1);
        //logo.setCollideWorldBounds(true);



        //var light = this.lights.addLight(400, 100, 200, 1,1,1,1);


        //var logo = this.physics.add.image(400, 300, 'logo');
        //logo.setPipeline('Light2D');

        /*emitter.startFollow(logo);*/
    }
