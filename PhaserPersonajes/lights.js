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

    //ESTO SE QUITRARÁ
    pipeline_light.setFloat2('res', cam.width, cam.height);
    //pipeline_light.setFloat1v('fLights', [0.0,0.0,0.0,0.0,0.0,4.0,1.0,1.0,1.0,1.0]);
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

  //this.checkRenderLight = function(cam, light){

    //var lightPos = [(light.position[0] -cam.scrollX)/cam.width, (light.position[1] -cam.scrollY)/cam.height];
    //console.log("x: " + lightPos[0] + " | y: " + lightPos[1]);

    //var camRatio = /*Math.sqrt(cam.width * cam.width + cam.height * cam.height) / 2.0*/Math.sqrt(2.0) / 2.0;
    //var origin = [cam.scrollX + cam.width/2.0, cam.scrollY + cam.height/2.0];
    //var dir = /*[light.position[0] - origin[0], light.position[1] - origin[1]]*/ ;
    //var dirMagnitude = /*Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1])*/Math.sqrt(lightPos[0] * lightPos[0] + lightPos[1] * lightPos[1]);
    //console.log(dirMagnitude);
    //console.log(dirMagnitude > camRatio);
    //if(dirMagnitude < camRatio) return true;
    //dir = [dir[0] / dirMagnitude, dir[1] / dirMagnitude];
    //dir = [dir[0] * camRatio, dir[1] * camRatio];
    //var point = [origin[0] + dir[0], origin[1] + dir[1]];



    //var lightToPoint = [point[0] - light.position[0], point[1] - light.position[1]];
    //lightToPoint = [lightToPoint[0] / cam.width, lightToPoint[1] / cam.height];
    //var lightToPointMag = Math.sqrt(lightToPoint[0] * lightToPoint[0] + lightToPoint[1] * lightToPoint[1]);
    //console.log(lightToPoint);
    //var edge0 = 0.2;
    //var edge1 = 1.0;
    //var t = (lightToPointMag * light.weakness - edge0) / (edge1 - edge0);
    //t = t > 1.0 ? 1.0 : t;
    //t = t < 0.0 ? 0.0 : t;
    //t = t * t * (3.0 - 2.0 * t);

    //console.log(t);

    //if(t > 0.0) return true;
    //else return false;

    //dstIntensity = 1.0 - smoothstep(0.2, 1.0, length(dir) * weakness);

  //}

  this.updateAllUniforms = function(delta){
    for (var i = 0; i < this.numCameras; i++){
      var pipeline = this.cameras[i][0].pipeline;
      var numLights = this.cameras[i][1].length;
      var lightArray = [];

      for(var j = 0; j < numLights; j++){
        this.cameras[i][1][j].updateLight(delta);
        var aux = this.cameras[i][1][j].getArrayInfo();
        for(var w = 0; w < aux.length; w++) lightArray.push(aux[w]);

        //console.log(lightArray = this.cameras[i][1][j].toString());
      }
      //console.log(lightArray);
      pipeline.setFloat1v('fLights', lightArray);
      pipeline.setFloat4('camInfo', this.cameras[i][0].scrollX, this.cameras[i][0].scrollY,this.cameras[i][0].width, this.cameras[i][0].height);
    }
  }
}
