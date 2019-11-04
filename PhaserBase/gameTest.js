var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
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

    function preload ()
    {



        //this.load.setBaseURL('http://labs.phaser.io');

        //this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', ['./assets/test/21749-5-yoshi-file.png' , './assets/test/normalMap.png']);
        //this.load.image('red', 'assets/particles/red.png');
    }

    function create ()
    {
        //this.lights.enable().setAmbientColor(0x111111);
        //console.log(this.lights.getMaxVisibleLights());

        this.add
          .image(360, 300, 'logo')
          .setOrigin(0.5)
          .setScale(0.5)
          //.setPipeline("Light2D")
        ;

        //var light = this.lights.addLight(400, 300, 400).setIntensity(0.9);

        /*this.input.on('pointermove', function(pointer){
          light.x = pointer.x;
          light.y = pointer.y;
        });*/


        this.grayscalePipeline = this.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.game));
        this.cameras.main.setRenderToTexture(this.grayscalePipeline);
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
