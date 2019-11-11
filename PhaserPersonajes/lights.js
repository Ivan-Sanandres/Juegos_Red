//LIGHTING OBJECTS
/*function Light
(pos, weak, col, ray)
{
  var that = this;
  this.position = pos;
  this.weakness = weak;
  this.color = col;
  this.rayTrace = ray;
  this.toString = function(){
    return "pos: (" + this.position[0] + ", " + this.position[1] + ") | "+
    "weakness: " + this.weakness + " | color: (" + this.color[0] + ", "+
    this.color[1] + ", " + this.color[2] + ") | ray: " + this.rayTrace;
  }

  this.getThat = function(){
    return that;
  }
}*/

//Light_focal.prototype = Object.create(Light.prototype);

function Light_focal
(pos, dir, angle, weak, col, intensity, ray = 1.0, irr = true, min = 0.8, max = 1.0, irrSpd = 2)
{
  //Light.call(pos, weak, col, ray);

  this.position = pos;
  this.weakness = weak;
  this.color = col;
  this.rayTrace = ray;
  this.direction = dir;
  this.angleRatio = angle;
  this.intensity = intensity;


  this.irregular = irr;
  this.sign = -1.0;
  this.minIntensity = min;
  this.maxIntensity = max;
  this.irregularSpeed = irrSpd;

  this.originalIntensity = this.intensity;
  this.originalWeakness = this.weakness;
  /*this.toString = function(){
    return "pos: (" + this.position[0] + ", " + this.position[1] + ") | "+
    "weakness: " + this.weakness + " | color: (" + this.color[0] + ", "+
    this.color[1] + ", " + this.color[2] + ") | ray: " + this.rayTrace
    + " | dir: (" + this.direction[0] +
    ", " + this.direction[1] + ") | angleRation: " + this.angleRatio;
  }*/

  this.getArrayInfo = function(){
    //console.log(Light.prototype.getThat.call(this).position);
    return [this.position[0], this.position[1], this.direction[0], this.direction[1], this.angleRatio, this.weakness, this.color[0], this.color[1], this.color[2], this.intensity, this.rayTrace];

  }

  this.updateLight = function(delta){
    if(this.irregular && delta){
      this.intensity = this.intensity + this.irregularSpeed/10000.0 * this.sign * delta;

      if(this.intensity < this.minIntensity){
        this.intensity = this.minIntensity;
        this.sign = 1.0;
      }
      if(this.intensity > this.maxIntensity){
        this.intensity = this.maxIntensity;
        this.sign = -1.0;
      }

      var diff = this.intensity - this.originalIntensity;
      this.weakness = this.originalWeakness * (1.0-diff*0.5);
    }
  }
}


function LightingManager (g, cams = []){ //CAMARA, POINT A FOCAL, LIGHTS
  for(var i = 0; i < cams.length; i++) {
    var aux = cams[i];
    cams[i] = new Array(2);
    cams[i][0] = aux;
    cams[i][1] = new Array(0);
  }

  this.game = g;
  this.cameras = cams;
  this.numCameras = cams.length;

  this.setUpPipeline = function(cam, index){
    var pipeline_light = this.game.renderer.addPipeline("Lighting" + index, new LightingPipeline(this.game));
    cam.setRenderToTexture(pipeline_light);
  }

  for(var c = 0; c < this.numCameras; c++) this.setUpPipeline(this.cameras[c][0], c);


  this.addLight = function(camIndex, light) {
    this.cameras[camIndex][1].push(/*new Light_point(pos, dir, angle, weak, col, ray*/light);
  }

  this.clearLights = function() {
    for(var i = 0; i < this.numCameras; i++){
      this.cameras[i][1].splice(0, this.cameras[i][1].length);
    }
  }

  this.addCamera = function (cam){
    this.cameras.push(cam);
    this.setUpPipeline(cam, this.numCameras);
    this.numCameras++;
  }


  this.updateAllUniforms = function(delta){
    //console.log(this.cameras);
    for (var i = 0; i < this.numCameras; i++){
      var pipeline = this.cameras[i][0].pipeline;
      var numLights = this.cameras[i][1].length;
      var lightArray = [];

      for(var j = 0; j < numLights; j++){
        this.cameras[i][1][j].updateLight(delta);
        var aux = this.cameras[i][1][j].getArrayInfo();
        //console.log(aux);
        for(var w = 0; w < aux.length; w++) lightArray.push(aux[w]);
      }


      pipeline.setFloat1v('fLights', lightArray);
      pipeline.setFloat4('camInfo', this.cameras[i][0].scrollX, this.cameras[i][0].scrollY,this.cameras[i][0].width, this.cameras[i][0].height);
      //lightArray.clear();
    }
  }
}
