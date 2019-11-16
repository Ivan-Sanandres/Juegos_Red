var LightingPipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

  initialize:

  function LightingPipeline (game)
  {
      Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
          game: game,
          renderer: game.renderer,
          fragShader:`
            precision lowp float;

            uniform sampler2D uMainSampler;                                 //Textura de la imagen renderizada antes de aplicar el shader de iluminación
            varying vec2 outTexCoord;                                       //Coordenadas de textura del fragmento
            uniform float fLights[11*18];                                   //pos.x, pos.y, dir.x, dir.y, angleRatio, weakness, color.x, color.y, color.z, intensity, waraytrace
            uniform vec4 camInfo;                                           //posición y dimensiones de la cámara
            uniform float bloom;                                            //Bloom que debe aplicarse a las luces
            uniform float maxIntensity;                                     //Máxima iluminación en un punto


            float rayFlexing(vec2 coordSrc, vec2 dir){                      //calcula la luz que llega al fragmento desde una fuente de luz en la dirección al fragmento
              const int accuracy = 100;                                     //Cuántos puntos se van a comprobar en el rayo
              float result = 1.0;                                           //Se inicializa el valor resultado a 1, que indica que por defecto llega la máxima luz

              //RAY TRACE OPS
              vec2 step = dir / float(accuracy);                            //Vector que debo avanzar el punto de comprobación del rayo en cada iteración del for
              vec2 actualPath = vec2(0.0);                                  //Camino recorrido en el rayo

              for(int i = 0; i < accuracy; i++){                            //Se lanza un rayo desde la fuente de luz al fragmento, dividido en accuracy veces
                vec2 pointPos = coordSrc + actualPath;                      //Se calcula el punto que debe ser comprobado
                result *= texture2D(uMainSampler, pointPos).x;              //Se multiplica la oclusión del punto al resultado
                actualPath += step;                                         //Se aumenta el camino recorrido
              }

              //RETURN
              return result;                                                //Se devuelve la transferencia de luz que llega al destino
            }




            vec4 getLightIntensity        //Dados los datos de una luz y la coordenada del fragmento a iluminar, devuelve la luz que llega al fragmento
              (vec2 coordDst, vec2 lightPos, vec2 lightDir, float angleRatio, float weakness, vec3 color, float lightIntensity, float rayTraceActive){


              //COORDS AND DIRECTION
              vec2 posSrc = (lightPos - camInfo.xy) / camInfo.zw;                                                       //Se calcula la posición de la luz en coordenadas de textura
              vec2 dir = coordDst - posSrc;                                                                             //Se calcula el vector que une la luz y el destino

              //INTENISTY
              float dstIntensity = 1.0 - smoothstep(0.2, 1.0, length(dir) * weakness);                                  //Se calcula la intensidad radial (puntual) de la luz

              //FOCAL INTENSITY
              float focalCondition = float(length(lightDir) > 0.0);                                                     //se guarda en un float 1.0 o 0.0 si la luz es focal
              float dirMagnitude = length(dir);                                                                         //se calcula el módulo del vector entre source y destino

              float focalIntensity = 1.0 - smoothstep(0.6, 1.0, dirMagnitude * weakness);                               //Se calcula la intensidad base de la luz focal
              float dotResult = clamp(dot(normalize(dir), normalize(lightDir)), 0.0, 1.0);                              //Se hacen los calculos necesarios para el efecto focal
              float focalResult = pow(dotResult, angleRatio);
              float puntualEffect = 1.0 - smoothstep(0.1, 1.0, dirMagnitude * weakness*5.5);                            //Se calcula el efecto puntual reducido para la focal
              focalIntensity =  puntualEffect + (1.0-puntualEffect) * focalIntensity * focalResult;                     //Se juntan la intensidad focal y el efecto puntual
              focalIntensity = smoothstep(0.0, 1.0, focalIntensity);                                                    //Se suaviza el efecto

              dstIntensity = dstIntensity * (1.0 - focalCondition) + focalIntensity * focalCondition;                   //Se asigna a la intensidad de luz la intensidad puntual o focal según la condición

              dstIntensity = 0.95 * dstIntensity;                                                                       //Se ajusta la intensidad máxima

              //RAY TRACE
              float transfer = texture2D(uMainSampler, coordDst).x;                                                     //Se comprueba si el fragmento es traslúcido o no
              float condition = transfer * rayTraceActive;                                                              //Se calcula la condición para asignar un valor sombreado o no
              dstIntensity = dstIntensity * (1.0 - condition) + dstIntensity * rayFlexing(posSrc, dir) * condition;     //Se añade el sombreado a la intensidad (a los objetos no traslúcidos no les afecta el sombreado)

              //LEVELS
              //float levels = 4.0;                                                                                       //Número de niveles en los que se divide la intensidad de luz
              //dstIntensity = (floor(dstIntensity * levels)/levels
              //  + (dstIntensity * bloom))/(1.0 + bloom);                                                                //Se asigna un nivel de luz a la intensidad

              //RETURN
              return vec4(color * dstIntensity * lightIntensity, dstIntensity * lightIntensity);                                                       //Se devuelve la iluminación multiplicada por la intensidad general de la luz
            }

            vec3 calculateLighting(vec2 coordDst){                                //Esta función calcula la iluminación de todas las luces para el fragmento
              vec4 intensity = vec4(0.0);                                         //Se crea la variable intensidad que guarda (color * intensidad)

              //PER LIGHT
              const int step = 11;                                                //parámetros por cada luz
              const int maxLights = 18;                                           //número máximo de luces

              for(int i = 0; i < maxLights; i++){                                 //bucle que itera sobre todas las luces

                intensity = intensity + getLightIntensity(                        //Se suma a la intensidad actual la intensidad de la siguiente luz
                  coordDst,                                                       //Coordenada del fragmento a iluminar
                  vec2(fLights[i*step+0], fLights[i*step+1]),                     //POS
                  vec2(fLights[i*step+2], fLights[i*step+3]),                     //DIR
                  fLights[i*step+4],                                              //ANGLE
                  fLights[i*step+5],                                              //WEAK
                  vec3(fLights[i*step+6], fLights[i*step+7], fLights[i*step+8]),  //COLOR
                  fLights[i*step+9],                                              //INTENSITY
                  fLights[i*step+10]                                              //RAY TRACE
                );

              }
              intensity.xyz = clamp(intensity.xyz, 0.0, 1.0);
              intensity.w = clamp(intensity.w, 0.0, maxIntensity);

              //LEVELS
              float levels = 4.0;                                                  //Número de niveles en los que se divide la intensidad de luz
              intensity.w = (floor(intensity.w * levels)/levels
                + (intensity.w * bloom))/(1.0 + bloom);                            //Se asigna un nivel de luz a la intensidad

              //FINAL
              return vec3(intensity.w * intensity.xyz);                            //Se devuelve la intensidad calculada
            }




            void main(void) {

              //UNLIT
              vec4 colorOriginal = texture2D(uMainSampler, outTexCoord);                  //Se obtiene el color original de la imagen

              vec4 colorUnlit = vec4(0.5, colorOriginal.yz*0.8 , 1.0);                    //Se utilizan los canales G y B (* 0.8 para rebajarlos) del color original para conformar el color final,
              colorUnlit = vec4(colorUnlit.xyz * 1.6, 1.0);                               //asignando un valor constante al canal R, después se aumenta el brillo del color

              //LIT
              vec4 colorLit = vec4(colorUnlit.xyz * calculateLighting(outTexCoord), 1.0); //Se calcula el color iluminado
              gl_FragColor = colorLit;                                                    //Se asigna el color del fragmento iluminado como color definitivo del fragmento
              //gl_FragColor = vec4(vec3(fLights[9]),1.0);
            }
          `
      });
  }
});
