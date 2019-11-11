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
            uniform float fLights[11*20]; //pos.x, pos.y, dir.x, dir.y, angleRatio, weakness, color.x, color.y, color.z, raytrace
            uniform vec4 camInfo;
            uniform float ambientShadow;

            float rayFlexing(vec2 coordSrc, vec2 dir){
              const int accuracy = 100;

              float result = 1.0;

              //RAY TRACE OPS

              vec2 step = dir / float(accuracy);

              for(int i = 0; i < accuracy; i++){
                vec2 pointPos = coordSrc + step * float(i);
                float occlusion = texture2D(uMainSampler, pointPos).x;
                result = result * occlusion;
              }

              //RETURN
              return result + clamp((ambientShadow -result), 0.0, 1.0);
            }

            vec4 getLightIntensity(vec2 coordDst, vec2 lightPos, vec2 lightDir, float angleRatio, float weakness, vec3 color, float lightIntensity, float rayTraceActive){


              //COORDS AND DIRECTION
              vec2 posSrc = (lightPos - camInfo.xy) / camInfo.zw;
              vec2 dir = coordDst - posSrc;

              //INTENISTY
              float dstIntensity = 1.0 - smoothstep(0.2, 1.0, length(dir) * weakness);

              vec2 normDir = normalize(dir);
              float lightDirLength = length(lightDir);
              vec2 normLightDir = normalize(lightDir);
              float focalCondition = float(lightDirLength > 0.0);

              float focalIntensity = 1.0 - smoothstep(0.6, 1.0, length(dir) * weakness);

              float dotResult = normDir.x * normLightDir.x + normDir.y * normLightDir.y;
              float clampDotResult = clamp(dotResult, 0.0, abs(dotResult));
              float focalResult = pow(clampDotResult, angleRatio);

              float puntualEffect = 1.0 - smoothstep(0.2, 1.0, length(dir) * weakness*6.0);
              focalIntensity =  puntualEffect + (1.0-puntualEffect) * focalIntensity * focalResult;
              focalIntensity = clamp(focalIntensity, 0.0, 0.9);

              dstIntensity = dstIntensity * (1.0 - focalCondition) + focalIntensity * focalCondition;


              //LEVELS
              float levels = 4.0;
              dstIntensity = floor(dstIntensity * levels)/levels;

              //RAY TRACE
              float transfer = texture2D(uMainSampler, coordDst).x;
              float condition = transfer * rayTraceActive;
              dstIntensity = dstIntensity * (1.0 - condition) + dstIntensity * rayFlexing(posSrc, dir) * condition;

              //RETURN
              return vec4(color * dstIntensity, dstIntensity) * lightIntensity;
            }

            vec3 calculateLighting(vec2 coordDst){
              vec4 intensity = vec4(0.0);

              //PER LIGHT
              const int step = 11;
              const int maxLights = 20;
              for(int i = 0; i < maxLights; i++){
                intensity = intensity + getLightIntensity(
                  coordDst,
                  vec2(fLights[i*step+0], fLights[i*step+1]),                     //POS
                  vec2(fLights[i*step+2], fLights[i*step+3]),                     //DIR
                  fLights[i*step+4],                                              //ANGLE
                  fLights[i*step+5],                                              //WEAK
                  vec3(fLights[i*step+6], fLights[i*step+7], fLights[i*step+8]),  //COLOR
                  fLights[i*step+9],                                              //INTENSITY
                  fLights[i*step+10]                                              //RAY TRACE
                );
              }

              //FINAL
              return intensity.xyz * pow(intensity.w,0.05) * 1.0;
            }

            void main(void) {

              //UNLIT
              vec4 colorOriginal = texture2D(uMainSampler, outTexCoord);

              vec4 colorUnlit = vec4(0.5, colorOriginal.yz*0.8 , 1.0);
              colorUnlit = vec4(colorUnlit.xyz * 1.6, 1.0);

              //LIT
              vec4 colorLit = vec4(colorUnlit.xyz * calculateLighting(outTexCoord), 1.0);
              gl_FragColor = colorLit;
              //gl_FragColor = vec4(vec3(fLights[6], fLights[7], fLights[8]), 1.0);
              //gl_FragColor = colorUnlit;
            }
          `
      });
  }
});
