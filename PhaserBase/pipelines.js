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

            //uniform vec2 res;
            uniform vec4 camPosDimensions;
            uniform float fLights[10*2]; //pos.x, pos.y, dir.x, dir.y, angleRatio, weakness, color.x, color.y, color.z, raytrace
            uniform vec4 camInfo;

            uniform int rayAccuracy;

            /*vec2 getPixelTexCoord(vec2 coord){
              coord.x = floor(coord.x * res.x)/res.x + (1.0/(res.x*2.0));
              coord.y = floor(coord.y * res.y)/res.y + (1.0/(res.y*2.0));
              return coord;
            }*/

            float rayTrace(vec2 coordSrc, vec2 dir){
              const int accuracy = 200;

              float result = 1.0;

              //RAY TRACE OPS
              vec2 aux = /*getPixelTexCoord(*/coordSrc + dir*0.5/*)*/;
              //float occlusion = texture2D(uMainSampler, aux).x;

              vec2 step = dir / float(accuracy);

              for(int i = 0; i < accuracy; i++){
                vec2 pointPos = /*getPixelTexCoord(*/coordSrc + step * float(i)/*)*/;
                float occlusion = texture2D(uMainSampler, pointPos).x;
                result = result * occlusion;
              }

              //RETURN
              return result;
            }



            vec4 getLightIntensity(vec2 coordDst, vec2 lightPos, vec2 lightDir, float angleRatio, float weakness, vec3 color, float rayTraceActive){


              vec2 posSrc = (lightPos - camInfo.xy) / camInfo.zw;


              //COORDS AND DIRECTION
              vec2 dir = coordDst - posSrc;

              //INTENISTY
              float dstIntensity = 0.0;
              dstIntensity = 1.0 - smoothstep(0.2, 1.0, length(dir) * weakness);

              //CHECK FOCAL BEHAVIOUR
              if(lightDir.x != 0.0 || lightDir.y != 0.0){
                dstIntensity = 1.0 - smoothstep(0.6, 1.0, length(dir) * weakness);
                vec2 normDir = normalize(dir);
                vec2 normLightDir = normalize(lightDir);
                float dotResult = normDir.x * normLightDir.x + normDir.y * normLightDir.y;
                float clampDotResult = clamp(dotResult, 0.0, abs(dotResult));
                float focalResult = pow(clampDotResult, angleRatio);

                float puntualEffect = 1.0 - smoothstep(0.2, 1.0, length(dir) * weakness*8.0);
                dstIntensity =  puntualEffect + (1.0-puntualEffect) * dstIntensity * focalResult;
                //dstIntensity = dstIntensity > 0.4 ? /*clamp(dstIntensity, 0.5, 1.0)*/0.8 : 0.0;
                dstIntensity = clamp(dstIntensity, 0.0, 0.9);
              }


              //float levels = 15.0;
              //dstIntensity = floor(dstIntensity * levels)/levels;

              //RAY TRACE
              float transfer = texture2D(uMainSampler, coordDst).x;
              dstIntensity = dstIntensity <= 0.0 ?
                0.0 :
                transfer == 0.0 || rayTraceActive == 0.0?
                  dstIntensity :
                  dstIntensity * rayTrace(posSrc, dir);

              //return colIntensity;
              //return vec4(dotResult);
              return vec4(color * dstIntensity, dstIntensity);
            }



            vec3 calculateLighting(vec2 coordDst){
              vec4 intensity = vec4(0.0);

              //FOCAL
              const int step = 10;
              for(int i = 0; i < 2; i++){
                intensity = intensity + getLightIntensity(
                  coordDst,
                  vec2(fLights[i*step+0], fLights[i*step+1]),                     //POS
                  vec2(fLights[i*step+2], fLights[i*step+3]),                     //DIR
                  fLights[i*step+4],                                              //ANGLE
                  fLights[i*step+5],                                              //WEAK
                  vec3(fLights[i*step+6], fLights[i*step+7], fLights[i*step+8]),  //COLOR
                  fLights[i*step+9]                                               //RAY TRACE
                );
              }

              //AMBIENT
              //intensity = intensity + vec4(0.2, 0.2, 0.2, 0.2);

              //FINAL

              return intensity.xyz * pow(intensity.w,0.05) * 1.0;
            }

            void main(void) {

              //UNLIT
              vec4 colorOriginal = texture2D(uMainSampler, outTexCoord);

              vec4 colorUnlit = vec4(0.5 * colorOriginal.w, colorOriginal.yz*0.8 * colorOriginal.w, 1.0);
              colorUnlit = vec4(colorUnlit.xyz * 1.6, 1.0);

              //LIT
              vec4 colorLit = vec4(colorUnlit.xyz * calculateLighting(outTexCoord), 1.0);
              gl_FragColor = colorLit;
              //gl_FragColor = colorUnlit;
              //gl_FragColor = colorOriginal;
              //gl_FragColor = vec4(1.0,1.0,1.0,1.0);
              //gl_FragColor = vec4(/*fLights[6], fLights[7], fLights[8]*/vec3(fLights[9]), 1.0);
              //discard;
              //gl_FragColor = vec4(vec3(fLights[1*10+3]), 1.0);
            }
          `
      });
  }
});
/*
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
*/
