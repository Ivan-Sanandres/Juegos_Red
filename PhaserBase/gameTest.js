var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 800,
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

    var pipeline_light;
    var pipeline_surface;
    //var rt;

    function preload ()
    {



        //this.load.setBaseURL('http://labs.phaser.io');

        //this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('yoshi', ['./assets/test/21749-5-yoshi-file.png' , './assets/test/normalMap.png']);
        this.load.image('mario', ['./assets/test/mario.png', './assets/test/normalMap.png']);



        //this.game.load.shader('invert', 'assets/shaders/invert.frag');

        //this.load.image('red', 'assets/particles/red.png');
    }

    function create ()
    {
        //this.lights.enable().setAmbientColor(0x111111);
        //console.log(this.lights.getMaxVisibleLights());



        var spriteYoshi = this.add
          .sprite(300, 300, 'yoshi')
          .setOrigin(0.5)
          .setScale(0.5)

          //.setPipeline("Light2D")
        ;

        var spriteMario = this.add
          .sprite(600, 300, 'mario')
          .setOrigin(0.5)
          .setScale(0.2)

          //.setPipeline("Light2D")
        ;
        //spriteYoshi.blendMode = Phaser.BlendModes.ADD;
        //spriteMario.blendMode = Phaser.BlendModes.ADD;

        //var light = this.lights.addLight(400, 300, 400).setIntensity(0.9);

        /*this.input.on('pointermove', function(pointer){
          light.x = pointer.x;
          light.y = pointer.y;
        });*/


        //this.grayscalePipeline = this.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.game));
        //this.invertPipeline = this.game.renderer.addPipeline('Invert', new InvertPipeline(this.game));

        //this.game.renderer.addPipeline('Surface', new SurfacePipeline(this.game));
        //this.game.renderer.addPipeline('Surface1', new SurfacePipeline(this.game));


        //spriteYoshi.setPipeline('Surface');
        //spriteYoshi.pipeline.setFloat1('lightTransfer', 1.0);
        //spriteMario.setPipeline('Surface1');
        //spriteMario.pipeline.setFloat1('lightTransfer', 1.0);

        //LIGHT PIPELINE
        pipeline_light = this.game.renderer.addPipeline('Lighting', new LightingPipeline(this.game));
        pipeline_light.setFloat2('res', 100, 100);
        pipeline_light.setFloat2('light1_Pos', 0.5, 0.5);

        //SURFACE PIPELINE
        pipeline_surface = this.game.renderer.addPipeline('Surface', new SurfacePipeline(this.game));
        pipeline_surface.setFloat1('lightTransfer', 1.0);


        //CAMERAS
        var cam1 = this.cameras.main;
        cam1.setRenderToTexture(/*pipeline_light*/pipeline_light);


        //texture2D a = pipeline_light.texture2D;

        //LIGHT POSITION
        this.input.on('pointermove', function(pointer){
          pipeline_light.setFloat2('light1_Pos', pointer.x/800.0, pointer.y/800.0);
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
