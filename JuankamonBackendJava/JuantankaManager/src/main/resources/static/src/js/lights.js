function Light_focal //Esta función crea un objeto que guarda las propiedades de una luz
(pos, dir, angle, weak, col, intensity, ray = 1.0, irr = true, min = 0.9, max = 1.0, irrSpd = 0.5)
{
  this.position = pos;                      //posición de la luz en coordenadas del mundo
  this.weakness = weak;                     //debilidad de la luz en función de la distancia (0.0 sería una luz que no se atenua jamás)
  this.color = col;                         //color RGB de la luz
  this.rayTrace = ray;                      //Si la luz genera sombreado
  this.direction = dir;                     //la dirección de la luz (si es (0.0, 0.0) se considera puntual en el shader)
  this.angleRatio = angle;                  //Amplitud de la luz focal (0.0 serían 180 grados de amplitud)
  this.intensity = intensity;               //Intensidad de la luz


  this.irregular = irr;                     //En caso de serlo, la luz cambia su intensidad y debilidad con el tiempo
  this.sign = -1.0;                         //Sentido en el que la luz varía con el tiempo
  this.minIntensity = min * intensity;      //Intensidad mínima que la luz toma al variar en el tiempo
  this.maxIntensity = max * intensity;      //Intensidad máxima que la luz toma al variar en el tiempo
  this.irregularSpeed = irrSpd;             //Velocidad con la que la luz varía en el tiempo

  this.originalIntensity = this.intensity;  //Intensidad original de la luz (usado para variar sus datos en el tiempo)
  this.originalWeakness = this.weakness;    //Debilidad original de la luz (usado para variar sus datos en el tiempo)

  this.getArrayInfo = function(){           //Esta función devuelve la información de la luz ordenada en el orden en que debe ser mandada al shader de iluminación
    return [this.position[0], this.position[1], this.direction[0], this.direction[1], this.angleRatio, this.weakness, this.color[0], this.color[1], this.color[2], this.intensity, this.rayTrace];
  }

  this.updateLight = function(delta){                                                     //Esta función actualiza la intensidad y debilidad de la luz para que no sean constantes
    if(this.irregular && delta){                                                          //si la luz varía con el tiempo y mi función ha recibido delta
      this.intensity = this.intensity + this.irregularSpeed/10000.0 * this.sign * delta;  //Se modifica la intensidad

      if(this.intensity < this.minIntensity){                                             //Si ha llegado a la intensidad mínima empezar a aumentar la intensidad
        this.intensity = this.minIntensity;
        this.sign = 1.0;
      }
      if(this.intensity > this.maxIntensity){                                             //Si ha llegado a la intensidad máxima empezar a disminuir la intensidad
        this.intensity = this.maxIntensity;
        this.sign = -1.0;
      }

      var diff = this.intensity - this.originalIntensity;                                 //Se calcula la diferencia de la intensidad actual con la original
      this.weakness = this.originalWeakness * (1.0-diff*0.5);                             //Se modifica la debilidad de la luz en función de diff
    }
  }
}


function LightingManager (g, cams = [], bloom = 0.9, maxIntensity = 1.5){    //Esta función crea un objeto capaz de gestionar las distintas luces del juego y comunicarse con los pipelines
  for(var i = 0; i < cams.length; i++) {    //Como primer paso se crean los arrays
    var aux = cams[i];                      //guardo la cámara en una variable auxiliar
    cams[i] = new Array(2);                 //Reservo espacio para guardar una referencia a la cámara y su array de luces
    cams[i][0] = aux;                       //El primer elemento del array será la cámara (cams[i][0] guarda la cámara)
    cams[i][1] = new Array(0);              //El segundo elemento del array será un array con las luces (cams[i][1][0] guarda la primera luz de la cámara)
  }


  this.game = g;                            //guardo una referencia a game
  this.cameras = cams;                      //guardo el array cams calculado
  this.numCameras = cams.length;            //guardo el número de cámaras
  this.bloom = bloom;                       //guardo el valor del bloom
  this.maxIntensity = maxIntensity;         //guardo el valor de la intensidad máxima

  this.setUpPipeline = function(cam, index){  //dada una cámara y su index en el array crea una pipeline y se la asigna
    if(!this.game.renderer.hasPipeline("Lighting" + index)){  //Si la pipeline ya existía no la crea
      this.game.renderer.addPipeline("Lighting" + index, new LightingPipeline(this.game));
    }

    var pipeline_light = this.game.renderer.getPipeline('Lighting' + index);  //se obtiene la pipeline
    cam.setRenderToTexture(pipeline_light);                                   //se asigna la pipeline a la cámara
  }

  for(var c = 0; c < this.numCameras; c++) this.setUpPipeline(this.cameras[c][0], c); //se setea cada cámara presente en el lightManager en su creación


  this.addLight = function(camIndex, light) { //se añade una luz a una cámara
    this.cameras[camIndex][1].push(light);
  }

  this.clearLights = function() {   //se eliminan todas las luces del lightManager
    for(var i = 0; i < this.numCameras; i++){
      this.cameras[i][1].splice(0, this.cameras[i][1].length);
    }
  }

  this.addCamera = function (cam){  //se añade una cámara al lightManager
    this.cameras.push([cam, []]);
    this.setUpPipeline(cam, this.numCameras);
    this.numCameras++;
  }


  this.updateAllUniforms = function(delta){ //se actualizan las uniform del shader aportando a cada pipeline sus datos de iluminación
    //console.log(this.cameras);
    for (var i = 0; i < this.numCameras; i++){  //para cada cámara
      var pipeline = this.cameras[i][0].pipeline; //guardo la pipeline
      var numLights = this.cameras[i][1].length;  //guardo el número de luces
      var lightArray = [];                        //creo el array de luces que mandaré como uniform al shader

      for(var j = 0; j < numLights; j++){                             //para cada luz
        this.cameras[i][1][j].updateLight(delta);                     //actualizo sus variables para que varíen en función del tiempo
        var aux = this.cameras[i][1][j].getArrayInfo();               //obtengo la información de la luz en el formato que debe ser enviada al shader
        //console.log(aux);
        for(var w = 0; w < aux.length; w++) lightArray.push(aux[w]);  //añado la información al array que llevará la información de todas las luces
      }


      pipeline.setFloat1v('fLights', lightArray);                     //paso al shader el array de luces
      pipeline.setFloat4('camInfo', this.cameras[i][0].scrollX, this.cameras[i][0].scrollY,this.cameras[i][0].width, this.cameras[i][0].height); //paso al array la información de la cámara
      pipeline.setFloat1('bloom', this.bloom);
      pipeline.setFloat1('maxIntensity', this.maxIntensity);
    }
  }
}
