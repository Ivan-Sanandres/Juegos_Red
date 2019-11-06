var GrayscalePipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function GrayscalePipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader:`
                precision mediump float;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;
                void main(void) {
                  vec4 color = texture2D(uMainSampler, outTexCoord);
                  //float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                  float gray2 = (color.r + color.g + color.b) / 3.0;
                  gl_FragColor = vec4(vec3(gray2), 1.0);
                }`
        });
    }
});

var InvertPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function InvertPipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader:`
                precision mediump float;
                uniform sampler2D previusSampler;
                varying vec2 outTexCoord;
                void main(void) {
                  vec4 color = texture2D(previusSampler, outTexCoord);
                  gl_FragColor = vec4(1.0 - color.xyz, 1.0);
                }`
        });
    }
});

var LightingPipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

  initialize:

  function LightingPipeline (game)
  {
      Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
          game: game,
          renderer: game.renderer,
          fragShader:`
            precision mediump float;
            uniform sampler2D uMainSampler;

            varying vec2 outTexCoord;

            uniform vec2 res;
            uniform vec2 light1_Pos;
            uniform float pointLightInfo[6]; //pos.x, pos.y, weakness, color.x, color.y, color.z
            uniform float focalLightInfo[9]; //pos.x, pos.y, dir.x, dir.y, angleRatio, weakness, color.x, color.y, color.z
            uniform int numPointLights;
            uniform int numFocalLights;
            uniform int rayAccuracy;

            vec2 getPixelTexCoord(vec2 coord){
              coord.x = floor(coord.x * res.x)/res.x + (1.0/(res.x*2.0));
              coord.y = floor(coord.y * res.y)/res.y + (1.0/(res.y*2.0));
              return coord;
            }

            float rayTrace(vec2 coordSrc, vec2 dir){
              //FUTURE UNIFORM VARIABLES
              //float accuracy = 100;

              float result = 1.0;

              //RAY TRACE OPS
              vec2 aux = /*getPixelTexCoord(*/coordSrc + dir*0.5/*)*/;
              //float occlusion = texture2D(uMainSampler, aux).x;

              vec2 step = dir / 100.0;

              for(int i = 0; i < 100; i++){
                vec2 pointPos = /*getPixelTexCoord(*/coordSrc + step * float(i)/*)*/;
                float occlusion = texture2D(uMainSampler, pointPos).x;
                result = result * occlusion;
              }

              //result = result * occlusion;

              //RETURN
              return result;
            }



            vec4 getLightIntensity(vec2 coordDst){

              //FUTURE UNIFORMS
              vec3 color = vec3(1.0, 1.0, 1.0);
              vec2 posSrc = vec2(light1_Pos.x, /*1.0 - */light1_Pos.y);
              float lightWeakness = 4.0;


              //COORDS AND DIRECTION
              vec2 posSrcPixel = /*getPixelTexCoord(*/posSrc/*)*/;
              vec2 dir = coordDst - posSrcPixel;

              //INTENISTY
              float dstIntensity = 0.0;
              dstIntensity += 1.0 - smoothstep(0.0, 1.0, length(dir) * lightWeakness);

              //RAY TRACE
              float transfer = texture2D(uMainSampler, coordDst).x;
              dstIntensity = dstIntensity <= 0.0 ?
                0.0 :
                transfer == 0.0 ?
                  dstIntensity :
                  dstIntensity * rayTrace(posSrc, dir);

              vec3 colIntensity = dstIntensity * color;

              //return colIntensity;
              return vec4(color, dstIntensity);
            }



            vec3 calculateLighting(vec2 coordDst){
              vec4 intensity = vec4(0.0);

              //PUNTUAL
              intensity = intensity + getLightIntensity(coordDst);

              //FOCAL

              //AMBIENT
              intensity = intensity + vec4(0.0, 0.0, 0.0, 0.0);

              //FINAL
              return intensity.xyz * vec3(intensity.w);
            }

            void main(void) {
              vec2 outTexCoordFixed = vec2(outTexCoord.x, /*1.0 -*/ outTexCoord.y);
              vec2 pixelCoord = /*getPixelTexCoord(*/outTexCoordFixed/*)*/;

              //UNLIT
              vec4 colorOriginal = texture2D(uMainSampler, pixelCoord);

              vec4 colorUnlit = vec4(0.5 * colorOriginal.w, colorOriginal.yz*0.8 * colorOriginal.w, 1.0);
              colorUnlit = vec4(colorUnlit.xyz * 1.6, 1.0);

              //LIT
              vec4 colorLit = vec4(colorUnlit.xyz * calculateLighting(pixelCoord), 1.0);
              gl_FragColor = colorLit;
              //gl_FragColor = colorUnlit;
              //gl_FragColor = colorOriginal;
              //gl_FragColor = vec4(1.0,1.0,1.0,1.0);
              //discard;
            }
          `
      });
  }
});

var SurfaceCheckPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function SurfaceCheckPipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader:`
              precision mediump float;
              uniform sampler2D uMainSampler;
              varying vec2 outTexCoord;
              void main(void) {
                vec4 color = texture2D(uMainSampler, outTexCoord);
                gl_FragColor = vec4(vec3(color.w), 1.0);
                //gl_FragColor = vec4(1.0);
              }`

        });
    }
});

var SurfacePipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:

    function SurfacePipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader:`
              precision mediump float;
              uniform sampler2D uMainSampler;
              uniform float lightTransfer;
              varying vec2 outTexCoord;
              void main(void) {
                vec4 color = texture2D(uMainSampler, outTexCoord);
                if(color.w == 0.0) discard;
                gl_FragColor = vec4(vec3(lightTransfer), 1.0);

                //gl_FragColor = vec4(1.0);
              }`
        });
    }
});
