let points = [];
let colors = [];

function max(a,b) {return a<b?b:a;}
function min(a,b) {return a>b?b:a;}

function distance (a, b, dy) {
  let dx = a[0] - b[0];
  return Math.sqrt(dx*dx+dy*dy);
}

function linearize(p) {
  let y = [];
  for(let j = 0; j < p.length; ++j) {
    let ls = 0;
    let rs = 0;
    for(let i = 0; i < p[j].length; ++i) {
      if(j > 0) {
        let d = Infinity; 
        for(let z = ls; z < p[j-1].length; ++z) {
          let dd = distance(p[j][i], p[j-1][z], j/7);
          if(dd <= d) {
            d = dd;
            ls = z;
          }
          else {
           
            break;
          }
          y = y.concat([j/7-0.5].concat(p[j][i]));
          y = y.concat([(j-1)/7-0.5].concat(p[j-1][ls]));
        }
      }
      if(j < p.length-1) {

      }
       
      if(i > 0) {
        y = y.concat([j/7-0.5].concat(p[j][i]));
        y = y.concat([j/7-0.5].concat(p[j][i-1]));
      }
    }
  }
  return y;
}

function smooth(p, e, d, b) {
  if(!d) d = 0.02;
  if(!e) e = 5;
  
  let y = [];
  for(let i = 0; i < p.length; ++i) {
    if(y.length > 0) if(p[i][0] - y[y.length-1][0] < d) continue; 
    let sum = 0;
    let num = 0;
    for(let j = max(i-e, 0); j < min(i+e, p.length); ++j) {
      sum += p[j][1];
      ++num;
    }
    y[y.length] = [p[i][0], sum/num];
    if(sum/num > b.max) b.max = sum/num;
    if(sum/num < b.min) b.min = sum/num;
  }
  return y;
}

function parse3d()
{
  let bounds = {min: Infinity,
               max: 0};
  let otime = new Date(d3data[0].datum).getTime();
  let p = [[],[],[],[],[],[],[]];
  for (let i = 0; i < d3data.length; ++i) {
    let tdif = new Date(d3data[i].datum).getTime() - otime;
    let index = parseInt(tdif/86400000);
    p[index][p[index].length] = [];
    p[index][p[index].length-1][0] = tdif%86400000/86400000 -0.5;
    let t = parseFloat(d3data[i]["akku"]);
    p[index][p[index].length-1][1] = t;
  }

  
  
  for(let i = 0; i < p.length; ++i) {
    p[i] = smooth(p[i], 5, 0.005, bounds);
  }
  points = linearize(p);
  for(let i = 0; i < points.length/3; ++i) {
    let temp = ((points[i*3+2] -bounds.min)/(bounds.max-bounds.min)).toFixed(5);
    
    points[i*3+2] = temp - .5;
    getcolor(temp, i);
  }
  function getcolor(c, i) {
    let indexes = [
      [0,0,1], //blue
      [0,1,1], //cyan
      [0,1,0], //green
      [1,1,0], //yellow
      [1,0,0] //red
    ];
    
    let f = 0, ilow, ihigh;
    if(c <= 0) ilow=ihigh=0;
    else if(c>=1) ilow=ihigh=indexes.length-1;
    else {
      c = c*(indexes.length-1);
      ilow = parseInt(c);
      f = c-ilow;
      ihigh = ilow +1;
      
    }
    for(let j = 0; j < 3; ++j) {
      colors[i*4 + j] = (indexes[ihigh][j] - indexes[ilow][j]) * f + indexes[ilow][j];
    }
    colors[i*4+3] = 1;
  }
}

!function init() {
  parse3d();
  let canvas = document.getElementById("3d-canvas");
  let gl = canvas.getContext("webgl");
  if(!gl) return;
  let program = shaderprogram(gl, ["vshader", "fshader"]);
  gl.useProgram(program);
  
  let vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  
  let vertex_color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  var matrixRotation = gl.getUniformLocation(program, "rot_matrix");
  let stdmatrix = [1,0,0,0,
               0,1,0,0,
               0,0,1,0,
               0,0,0,1];
  let x=-90,y=0;
  let dif = 2;
  
  
  
  var matrixProjection = gl.getUniformLocation(program, "proj_matrix");
  let promat = makeproj(Math.PI*.25, canvas.width/canvas.height, 1.5, 3.5);
  
  
  
  function drawScene() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var coord = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);
    var col = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(col, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col);
    gl.uniformMatrix4fv(matrixRotation, false, mul(translate(0,0,-2.5), mul(rotationX(x),mul(rotationY(y),stdmatrix))));
    
    gl.uniformMatrix4fv(matrixProjection, false, promat);
    
    gl.clearColor(0.5, 0.2, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.drawArrays(gl.LINES, 0, parseInt(points.length/3));
    
  };
  
  
  let timer = null;
  let interval = setInterval(function(){y+=dif;drawScene();}, 50);
  drawScene();
  let mousedown = false;
  canvas.addEventListener("mousedown", function() {
    clearInterval(interval);
    if(timer) clearTimeout(timer);
    mousedown = true;
  });
  canvas.addEventListener("mouseup", function() {
    timer = setTimeout(function (){
      interval = setInterval(function(){y+=dif;drawScene();}, 50);
    }, 3000);
    mousedown = false;
  });
  canvas.addEventListener("mousemove", function(e) {
    if(!mousedown) return;
    y += e.movementX/2*dif;
    x += e.movementY/2*dif;
    drawScene();
  });
  let touchpos;
  canvas.addEventListener("touchstart", function(e) {
    clearInterval(interval);
    if(timer) clearTimeout(timer);
    touchpos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
    e.preventDefault();
  });
  canvas.addEventListener("touchmove", function(e) {
    let dx = e.changedTouches[0].clientX - touchpos[0];
    let dy = e.changedTouches[0].clientY - touchpos[1];
    touchpos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    y += dx/2*dif;
    x += dy/2*dif;
    drawScene();
    e.preventDefault();
  });
  canvas.addEventListener("touchend", function(e) {
    timer = setTimeout(function (){
      interval = setInterval(function(){y+=dif;drawScene();}, 50);
    }, 3000);
  });
                          
  
  document.addEventListener("keydown", function (e) {
    function callback() {
      clearInterval(interval);
      if(timer) clearTimeout(timer);
      timer = setTimeout(function (){
        interval = setInterval(function(){y+=dif;drawScene();}, 50);
      }, 3000);
      
      drawScene();
    };
    switch(e.keyCode) {
      case 38: //UP
        x+=dif;
        callback();
        break;
      case 40: //DOWN
        x-=dif;
        callback();
        break;
      case 37: //LEFT
        y-=dif;
        callback();
        break;
      case 39: //RIGHT
        y+=dif;
        callback();
        break;
    }
  });
}();

function r2d(r) {
  return r/180*Math.PI;
}

function rotationX(angle) {
  let c = Math.cos(r2d(angle));
  let s = Math.sin(r2d(angle));
  return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
}
function rotationY(angle) {
  let c = Math.cos(r2d(angle));
  let s = Math.sin(r2d(angle));
  return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
}

function translate(x,y,z) {
  return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ];
}

function makeproj(fov, aspectRatio, near, far) {
  let f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  let rangeInv = 1 / (near - far);
 
  return [
    f / aspectRatio, 0,                          0,   0,
    0,               f,                          0,   0,
    0,               0,    (near + far) * rangeInv,  -1,
    0,               0,  near * far * rangeInv * 2,   0
  ];
}

function mul (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  }

function getshader(gl, id) {
  let elem = document.getElementById(id);
  let type = elem.getAttribute("type")==="x-shader/x-vertex"?gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  let shader = gl.createShader(type);
  gl.shaderSource(shader, elem.textContent);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(id + ">>>" + gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function shaderprogram(gl, ids)
{
  var program = gl.createProgram();
  for(let i = 0; i < ids.length; ++i)
  {
    gl.attachShader(program, getshader(gl, ids[i]));
  }
  gl.linkProgram(program);
  return program;
}