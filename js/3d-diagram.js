let points = [];
let colors = [];
function parse3d()
{
  for (let i = 0; i < d3data.length; ++i) {
    points[i*3] = new Date(d3data[i].datum).getTime()%86400000/86400000 -0.5;
    points[i*3+1] = ((new Date(d3data[i].datum).getTime()-new Date(d3data[0].datum).getTime())
    /86400000)/7-.5;
    let t = parseFloat(d3data[i]["temperatur"])/10;
    points[i*3+2] = t;
    colors[i*4] = t;
    colors[i*4+1] = t;
    colors[i*4+2] = t;
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
  console.log(points);
  console.log(colors);
  
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
  let x=y=0;
  let dif = 0.001;
  document.addEventListener("keydown", function (e) {
    console.log(e.keyCode);
    switch(e.keyCode) {
      case 38: //UP
        x+=dif;
        drawScene();
        break;
      case 40: //DOWN
        x-=dif;
        drawScene();
        break;
      case 37: //LEFT
        y-=dif;
        drawScene();
        break;
      case 39: //RIGHT
        y+=dif;
        drawScene();
        break;
    }
  });
  
  function drawScene() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var coord = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);
    var col = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(col, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col);
    console.log(mul(rotationX(x),stdmatrix));
    gl.uniformMatrix4fv(matrixRotation, false, mul(rotationX(x),mul(rotationY(y),stdmatrix)));
    
    gl.clearColor(0.5, 0.2, 0.5, 0.9);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.drawArrays(gl.POINTS, 0, parseInt(points.length/3));
  };
  drawScene();
}();

function r2d(r) {
  return r*180/Math.PI;
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
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
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