/*
 * Raquel Fierros 
 */

var canvas;
var gl;
var program1;

// z angle light source angle
var dz = 0;

//light
var fixedlight = false;
var rotatelight = false;
var lightangle = 0;

// sliders
var sSlider = null;
var lrSlider = null;
// Objects 
var towerObject = 
  { };
  
var cylinderObject = 
  { };
  
  // holds currently active object
  var activeObject =null;
//emerald material
   // ambient: vec4(1.0, 0.0, 0.0, 1.0),
  //  diffuse: vec4(0.3, 0.4, 0.55, 1.0),
   // specular: vec4(1.0, 1.0, 1.0, 1.0),
  //  shininess: 100.0,
    // material properties  
  
/*
 * var pearl = {
	  ambient: vec4(0.25, 0.20725, 0.20725, 0),
      diffuse: vec4(1, 0.829, 0.829, 0),
      specular: vec4(0.296648, 0.296648, 0.296648, 0),
      shininess: 0.088,
  
var chrome = {
	  ambient: vec4(0.25, 0.25, 0.25, 1.0),
      diffuse: vec4(0.4, 0.4, 0.4, 1.0),
      specular: vec4(0.774597,0.774597, 0.774597, 1.0),
      shininess: .6,
}

var obsidian = {
	  ambient: vec4(0.05375, 0.05, 0.066255, 1.0),
      diffuse: vec4(0.18275	0.17,0.22525, 1.0),
      specular: vec4(0.332741,0.328634,0.346435, 1.0),
      shininess: .3,
}
  
var yellow_rubber = {
	  ambient: vec4(0.05, 0.05, 0.0, 1.0),
      diffuse: vec4(0.5, 0.5, 0.4, 1.0),
      specular: vec4(0.7, 0.7, 0.04, 1.0),
      shininess: .078125,
}
}
 */
var emerald = {
    ambient: vec4(0.0215 ,0.1745 ,0.0215,0),
    diffuse: vec4(0.07568 ,0.61424 ,0.07568,0),
    specular: vec4(0.633 ,0.727811 ,0.633,0),
    shininess: 76.8,
}
//HW470: A pearl metalic material
var pearl = {
	  ambient: vec4(0.25, 0.20725, 0.20725, 0),
      diffuse: vec4(1, 0.829, 0.829, 0),
      specular: vec4(0.296648, 0.296648, 0.296648, 0),
      shininess: 8.5,
}
var ruby = {
	  ambient: vec4(0.1745, 0.01175,0.01175, 1.0),
      diffuse: vec4(0.61424, 0.04136, 0.04136, 1.0),
      specular: vec4(0.727811, 0.626959, 0.626959, 1.0),
      shininess: 7.5,
}
var jade = {
	  ambient: vec4(0.135, 0.2225, 0.1575, 1.0),
      diffuse: vec4(0.54, 0.89, 0.63, 1.0),
      specular: vec4(0.316228, 0.316228, 0.316228, 1.0),
      shininess: 11.1,
}

//
var chrome = {
	  ambient: vec4(0.25, 0.25, 0.25, 1.0),
      diffuse: vec4(0.4, 0.4, 0.4, 1.0),
      specular: vec4(0.774597,0.774597, 0.774597, 1.0),
      shininess: 8,
}
//brass
var brass = {
	  ambient: vec4(0.329412,0.223529,0.027451, 1.0),
      diffuse: vec4(0.780392,0.568627,0.113725, 1.0),
      specular: vec4(0.992157,0.941176,0.807843, 1.0),
      shininess: 8.21794872,
}

var turquoise = {
	  ambient: vec4(0.1,0.18725,0.1745, 1.0),
      diffuse: vec4(0.396, 0.74151, 0.69102, 1.0),
      specular: vec4(0.297254, 0.30829,0.306678, 1.0),
      shininess: 11.1,
}



var viewer = 
  {
    eye: vec3(0.0, 0.0, 3.0),
    at:  vec3(0.0, 0.0, 0.0),  
    up:  vec3(0.0, 1.0, 0.0),

    // for moving around object; set vals so at origin
    radius: 3.0,
    theta: 0,
    phi: 0
  };

var perspOptions = 
  {
    fovy: 60,
    aspect: 1,
    near: 0.1,
    far:  10
  }

// modelview and projection matrices
var mvMatrix;
var u_mvMatrixLoc;
var basic_mvMatrixLoc;
var normal_mvMatrixLoc;
var light_mvMatrixLoc;

var projMatrix;
var u_projMatrixLoc;
var basic_projMatrixLoc;
var light_projMatrixLoc;


// GPU vertex attribute globals
var vPosBuff;
var a_vertexPositionLoc;
var basic_vertexPositionLoc;
var vNormalBuff;
var a_vertexNormalLoc;

var normalPosBuff;
var normal_vertexPositionLoc;

var lightPosBuff;
var light_vertexPositionLoc;

// index buffer for triangulated mesh
var indexBuf;

// Light properties

var light =
  {
    position: vec4(1.0, 1.0, 1.0, 1.0),
    ambient: vec4(0.0, 0.0, 0.0, 1.0),
    diffuse: vec4(1.0, 1.0, 1.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
  };



var ambientProductLoc;
var diffuseProductLoc;
var specularProductLoc;
var lightPositionLoc;
var shininessLoc;

// mouse interaction

var mouse = {
  prevX: 0,
  prevY: 0,

  leftDown: false,
  rightDown: false,
};

function setObject(object) {
  // set active object
  activeObject = object;
  dz = object.geometry.maxZ;
  
  lrSlider.min = 10*dz;
  lrSlider.max = 100*dz;

  // setup program1
  gl.useProgram(program1);
  gl.bindBuffer( gl.ARRAY_BUFFER, vPosBuff );
  gl.vertexAttribPointer( a_vertexPositionLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( a_vertexPositionLoc );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(object.geometry.vertices), gl.STATIC_DRAW );

  gl.bindBuffer( gl.ARRAY_BUFFER, vNormalBuff );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(object.geometry.normals), gl.STATIC_DRAW );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(object.geometry.indices)), gl.STATIC_DRAW);

  gl.bindBuffer( gl.ARRAY_BUFFER, normalPosBuff );
  gl.vertexAttribPointer( normal_vertexPositionLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( normal_vertexPositionLoc );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(object.geometry.normalDrawVerts), gl.STATIC_DRAW );

}

function setMat(mat) {
  gl.useProgram(program1);
  gl.uniform4fv(ambientProductLoc, flatten(mat.ambientProduct));
  gl.uniform4fv(diffuseProductLoc, flatten(mat.diffuseProduct));
  gl.uniform4fv(specularProductLoc, flatten(mat.specularProduct));
  sSlider.value = mat.shininess;
}

// ========= Initialize Graphics ===================================================

window.onload = function init() {


  canvas = document.getElementById( "gl-canvas" );
  lrSlider = document.getElementById("lightradius");
  sSlider = document.getElementById("shininess");
  perspOptions.aspect = canvas.width/canvas.height;

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  // Define viewport size 
  gl.viewport( 0, 0, canvas.width, canvas.height );

   //background color 
  gl.clearColor( 0.13, 0.13, 0.13, 1.0 ); 

  gl.enable(gl.DEPTH_TEST);

  //  Load shaders
  program1 = initShaders( gl, "vertex-shader1", "fragment-shader" );
  program2 = initShaders( gl, "light-vertex-shader", "fragment-shader" );


// create geometry for cylinder and tower 
  
  cylinderObject.geometry = geometry(surfaceRevolution.CYLINDER, surfaceRevolution.genatrix, surfaceRevolution.rotation);
  console.log(`Cylinder Minmax Box Dimensions: (${cylinderObject.geometry.maxZ*2}, 2, ${cylinderObject.geometry.maxZ*2})`);


  towerObject.geometry = geometry(surfaceRevolution.TOWER, surfaceRevolution.genatrix, surfaceRevolution.rotation);
  console.log(`Pot Minmax Box Dimensions: (${towerObject.geometry.maxZ*2}, 2, ${towerObject.geometry.maxZ*2})`);

  // lighting model products for bronze mat
  pearl.ambientProduct = mult(pearl.ambient, light.ambient);
  pearl.diffuseProduct = mult(pearl.diffuse, light.diffuse);
  pearl.specularProduct = mult(pearl.specular, light.specular);

  // lighting model products for stone properties and metal properties
  emerald.ambientProduct = mult(emerald.ambient, light.ambient);
  emerald.diffuseProduct = mult(emerald.diffuse, light.diffuse);
  emerald.specularProduct = mult(emerald.specular, light.specular);
  
  ruby.ambientProduct = mult(ruby.ambient, light.ambient);
  ruby.diffuseProduct = mult(ruby.diffuse, light.diffuse);
  ruby.specularProduct = mult(ruby.specular, light.specular);
  
  chrome.ambientProduct = mult(chrome.ambient, light.ambient);
  chrome.diffuseProduct = mult(chrome.diffuse, light.diffuse);
  chrome.specularProduct = mult(chrome.specular, light.specular);
  
  brass.ambientProduct = mult(brass.ambient, light.ambient);
  brass.diffuseProduct = mult(brass.diffuse, light.diffuse);
  brass.specularProduct = mult(brass.specular, light.specular);
  
  jade.ambientProduct = mult(jade.ambient, light.ambient);
  jade.diffuseProduct = mult(jade.diffuse, light.diffuse);
  jade.specularProduct = mult(jade.specular, light.specular);
  
  turquoise.ambientProduct = mult(turquoise.ambient, light.ambient);
  turquoise.diffuseProduct = mult(turquoise.diffuse, light.diffuse);
  turquoise.specularProduct = mult(turquoise.specular, light.specular);

  gl.useProgram(program1);
  // Create vertex position buffer
  vPosBuff = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vPosBuff );

  // Associate a_vertexPosition attribute in shader to the buffer
  a_vertexPositionLoc = gl.getAttribLocation( program1, "a_vertexPosition" );
  gl.vertexAttribPointer( a_vertexPositionLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( a_vertexPositionLoc );

  // Create vertex normal buffer
  vNormalBuff = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vNormalBuff );

  // Associate a_vertexNormal attribute in shader to the buffer
  a_vertexNormalLoc = gl.getAttribLocation( program1, "a_vertexNormal" );
  gl.vertexAttribPointer( a_vertexNormalLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( a_vertexNormalLoc );

  // create index buffer
  indexBuf = gl.createBuffer();

  gl.useProgram(program2);
  // Create vertex position buffer for light shader
  lightPosBuff = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, lightPosBuff );

  // Associate vPosition attribute in shader to the buffer
  light_vertexPositionLoc = gl.getAttribLocation( program2, "vPosition" );
  gl.vertexAttribPointer( light_vertexPositionLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( light_vertexPositionLoc );


  gl.useProgram(program1);
  lightPositionLoc = gl.getUniformLocation( program1, "lightPosition");
  ambientProductLoc = gl.getUniformLocation( program1, "ambientProduct");
  diffuseProductLoc = gl.getUniformLocation( program1, "diffuseProduct");
  specularProductLoc = gl.getUniformLocation( program1, "specularProduct");
  shininessLoc = gl.getUniformLocation( program1, "shininess");


  setObject(cylinderObject)
  setMat(emerald)
  //setMat(ruby)
 // setMat(jade)
 // setMat(turquoise)
 // setMat(pearl)
 // setMat(chrome)
  //setMat(obsidian)

  // set initial eye position 
  viewer.eye = vec3(0.0, 0.0, 3*dz)
  console.log(`Initial eye pos: (0, 0, ${3*dz}), at: (0, 0, 0), up: <0, 1, 0>`);
  viewer.radius = 3*dz


  //set up uniform locations for mv/p matrices
  mvMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
  console.log(`Initial perspective options: \nfovy: ${perspOptions.fovy}, aspect: ${perspOptions.aspect}, near: ${perspOptions.near}, far: ${perspOptions.far}`);
  projMatrix = perspective(perspOptions.fovy, perspOptions.aspect, perspOptions.near, perspOptions.far);
  console.log(projMatrix);

  u_projMatrixLoc = gl.getUniformLocation( program1, "u_projMatrix" );
  u_mvMatrixLoc = gl.getUniformLocation( program1, "u_mvMatrix" );

  // bind mv/p matrix for program2
  gl.useProgram(program2)

  light_projMatrixLoc = gl.getUniformLocation(program2, "u_projMatrix");
  light_mvMatrixLoc = gl.getUniformLocation( program2, "u_mvMatrix" );

  // ========================== Interaction ===============================


  document.getElementById('cylinder').onclick = e => {
    setObject(cylinderObject)
  }
 
  document.getElementById('tower').onclick = e => {
    setObject(towerObject)
  }
  document.getElementById('emerald').onclick = e => {
    setMat(emerald)
  }
  document.getElementById('chrome').onclick = e => {
    setMat(chrome)
  }
  document.getElementById('brass').onclick = e => {
    setMat(brass)
  }
  document.getElementById('ruby').onclick = e => {
    setMat(ruby)
  }
  document.getElementById('jade').onclick = e => {
    setMat(jade)
  }
  document.getElementById('turquoise').onclick = e => {
    setMat(turquoise)
  }
  document.getElementById('pearl').onclick = e => {
    setMat(pearl)
  }
  document.getElementById('fixedlight').onclick = e => {
    if (fixedlight) {
      light.position = vec4(1.0, 1.0, 1.0, 1.0);
      fixedlight = false;
    } else {
      light.position = vec4(0.0, 0.0, 0.0, 0.0);
      fixedlight = true;
      rotatelight = false;
    }
  }

  document.getElementById('rotatelight').onclick = e => {
    if (rotatelight) {
      rotatelight = false;
      light.position = vec4(1.0, 1.0, 1.0, 1.0);
      lightangle = 0;
    } else {
      //HW470: Cannot turn on rotate light when eye follow light is on
      if (!fixedlight) {
        rotatelight = true;
        lr.value = 2*10*dz;
        lightangle = 0;
      }
    }
  }
  document.getElementById('fov').onchange = e => {
    perspOptions.fovy = e.target.value;
    projMatrix = perspective(perspOptions.fovy, perspOptions.aspect, perspOptions.near, perspOptions.far);
  }


	// ========================== Camera control via mouse ============================================
	// There are 4 event listeners: onmouse down, up, leave, move
	//
	// on onmousedown event
	// check if left/right button not already down
	// if just pressed, flag event with mouse.leftdown/rightdown and stores current mouse location
  document.getElementById("gl-canvas").onmousedown = function (event)
  {
    if(event.button == 0 && !mouse.leftDown)
    {
      mouse.leftDown = true;
      mouse.prevX = event.clientX;
      mouse.prevY = event.clientY;
    }
    else if (event.button == 2 && !mouse.rightDown)
    {
      mouse.rightDown = true;
      mouse.prevX = event.clientX;
      mouse.prevY = event.clientY;
    }
  };
  
	// onmouseup event
	// set flag for left or right mouse button to indicate that mouse is now up

  document.getElementById("gl-canvas").onmouseup = function (event)
  {
    // Mouse is now up
    if (event.button == 0)
    {
      mouse.leftDown = false;
    }
    else if(event.button == 2)
    {
      mouse.rightDown = false;
    }

  };
  
	// onmouseleave event
	// if mouse leaves canvas, then set flags to indicate that mouse button no longer down.
	// This might not actually be the case, but it keeps input from the mouse when outside of app
	// from being recorded/used.
	// (When re-entering canvas, must re-click mouse button.)
  document.getElementById("gl-canvas").onmouseleave = function ()
  {
    // Mouse is now up
    mouse.leftDown = false;
    mouse.rightDown = false;
  };
  
	// onmousemove event
	// Move the camera based on mouse movement.
	// Record the change in the mouse location
	// If left mouse down, move the eye around the object based on this change
	// If right mouse down, move the eye closer/farther to zoom
	// If changes to eye made, then update modelview matrix


  document.getElementById("gl-canvas").onmousemove = function (event)
  {
    // Get changes in x and y at this point in time
	// only record changes if mouse button down
	
    var currentX = event.clientX;
    var currentY = event.clientY;

	// calculate change since last record
    var deltaX = event.clientX - mouse.prevX;
    var deltaY = event.clientY - mouse.prevY;

    var makeChange = 0;

    //console.log("enter onmousemove");
    //console.log("viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);

    // Only perform actions if the mouse is down
    // Compute camera rotation on left click and drag
    if (mouse.leftDown)
    {
       makeChange = 1;

      // Perform rotation of the camera
      if (viewer.up[1] > 0)
      {
        viewer.theta -= 0.01 * deltaX;
        viewer.phi -= 0.01 * deltaY;
      }
      else
      {
        viewer.theta += 0.01 * deltaX;
        viewer.phi -= 0.01 * deltaY;
      }

      //console.log("increment theta=",viewer.theta,"  phi=",viewer.phi);

      // Wrap the angles
      var twoPi = 6.28318530718;
      if (viewer.theta > twoPi)
      {
        viewer.theta -= twoPi;
      }
      else if (viewer.theta < 0)
      {
        viewer.theta += twoPi;
      }

      if (viewer.phi > twoPi)
      {
        viewer.phi -= twoPi;
      }
      else if (viewer.phi < 0)
      {
        viewer.phi += twoPi;
      }

    }
    else if(mouse.rightDown)
    {
		
      makeChange = 1;
      viewer.radius -= 0.01 * deltaX;
      viewer.radius = Math.max(0.1, viewer.radius);
    }

    if(makeChange == 1) {

      //console.log("onmousemove make changes to viewer");

      // Recompute eye and up for camera
      var threePiOver2 = 4.71238898;
      var piOver2 = 1.57079632679;
	  var pi = 3.14159265359;

      var r = viewer.radius * Math.sin(viewer.phi + piOver2);


      viewer.eye = vec3(r * Math.cos(viewer.theta + piOver2), viewer.radius * Math.cos(viewer.phi + piOver2), r * Math.sin(viewer.theta + piOver2));

      //add vector (at - origin) to move 
      for(k=0; k<3; k++)
        viewer.eye[k] = viewer.eye[k] + viewer.at[k];

      //console.log("theta=",viewer.theta,"  phi=",viewer.phi);
      //console.log("eye = ",viewer.eye[0],viewer.eye[1],viewer.eye[2]);
      //console.log("at = ",viewer.at[0],viewer.at[1],viewer.at[2]);
      //console.log(" ");
	  
	  // modify the up vector
	  // flip the up vector to maintain line of sight cross product up to be to the right
      // true angle is phi + pi/2, so condition is if angle < 0 or > pi
	  
	  


      if (viewer.phi < piOver2 || viewer.phi > threePiOver2) {
        viewer.up = vec3(0.0, 1.0, 0.0);
      }
      else {
        viewer.up = vec3(0.0, -1.0, 0.0);
      }
      // console.log("up = ",viewer.up[0],viewer.up[1],viewer.up[2]);
      //console.log("update viewer.eye = ",viewer.eye,"  viewer.at=",viewer.at,"  viewer.up=",viewer.up);
	  
      // Recompute the view
      mvMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);


      mouse.prevX = currentX;
      mouse.prevY = currentY;
    }

  };


  render();
}


var render = function() {

  //set the light's position based on the radius and angle
  if (rotatelight) {
    light.position = multMatVec(rotateY(lightangle), vec4(0,0,lrSlider.value/10,1));
    lightangle += 0.5;
  }

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram( program1 );

  gl.uniformMatrix4fv(u_mvMatrixLoc, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(u_projMatrixLoc, false, flatten(projMatrix));

  gl.uniform4fv(lightPositionLoc, flatten(light.position));
  gl.uniform1f(shininessLoc, sSlider.value);


  gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuff);
  gl.vertexAttribPointer( a_vertexPositionLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( a_vertexPositionLoc );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);

  gl.drawElements( gl.TRIANGLES, activeObject.geometry.numTris * 3, gl.UNSIGNED_SHORT, 0 );

  //Draw light

  gl.useProgram(program2);

  gl.uniformMatrix4fv(light_mvMatrixLoc, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(light_projMatrixLoc, false, flatten(projMatrix));

  gl.bindBuffer( gl.ARRAY_BUFFER, lightPosBuff );
  gl.vertexAttribPointer( light_vertexPositionLoc, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( light_vertexPositionLoc );

  gl.bufferData( gl.ARRAY_BUFFER, flatten(light.position), gl.DYNAMIC_DRAW );
  gl.drawArrays(gl.POINTS, 0, 1);

  requestAnimFrame(render); 
}