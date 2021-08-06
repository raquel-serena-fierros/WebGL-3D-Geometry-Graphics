var surfaceRevolution = 
  {
	 input: 0,	
	 rotation: 80,
     genatrix: 40,
	  
      TOWER: { curve: HanoiTowerVase_Curve, derivative: HanoiTowerVase_Derivative },
	  CYLINDER: { curve: cylinderCurve, derivative: cylinderDerivative }
  }

function HanoiTowerVase_Curve(t) {

  return Math.sin(-.5 * t*Math.PI) / 4 + Math.sin(t*5*Math.PI + Math.PI) / 5.5 + .45
}

function HanoiTowerVase_Derivative(t) {
  return -Math.PI *.5/ 4 * (Math.cos(Math.PI * t) + 5 * Math.cos(4.5*Math.PI*t))
}

function cylinderCurve(t) {
  return .95
}

function cylinderDerivative(t) {
  return 0
}

function geometry(surface,f, r) {
  let vertices = [];
  let normals = [];
  let normalDrawVerts = [];
  let indices = [];
  let numTris = 0;
  let maxZ = 0;
  for (let t = 1; t >= -1.01; t -= 2 / (f)) {
    let gen = surface.curve(t);
    maxZ = Math.max(maxZ, gen);
    const baseVec = vec4(gen, t, 0, 1);
    for (let theta = 0; theta < 360; theta += 360 / r) {
      const rot = rotateY(theta)
      let vert = multMatVec(rot, baseVec);
      let slope = surface.derivative(t);
      const norm = normalize(vec4(Math.cos(radians(theta)), -slope, Math.sin(radians(theta)), 0), true);
      vertices.push(vert);
      normals.push(norm);
      normalDrawVerts.push(vert);
      normalDrawVerts.push(add(vert, scale(0.1, norm)));
    }
  }
  const subIndices = [1,0,2,2,1,3];
  for (let i = 0; i < f; i++) {
    for (let j = 0; j < r; j++) {
      let quadIndices = [
        (r) * (i) + j, (r) * (i) + (j + 1) % r,
        (r) * (i + 1) + j, (r) * (i+1) + (j + 1) % r
      ];
      for (let k = 0; k < subIndices.length; k++) {
        indices.push(quadIndices[subIndices[k]])
      }
      numTris += 2;
    }
  }
  return {
    vertices,
    normals,
    normalDrawVerts,
    indices,
    numTris,
    maxZ
  }
}

function multMatVec(u, v) {
  for ( var i = 0; i < u.length; ++i ) {
      if ( u[i].length != v.length ) {
          throw "error";
      }
  }

  let result = [];
  for ( var i = 0; i < u.length; ++i ) {
    let sum = 0;
    for ( var j = 0; j < u[i].length; ++j ) {
      sum += u[i][j] * v[j];
    }
    result.push(sum);
  }
  return result;
}
