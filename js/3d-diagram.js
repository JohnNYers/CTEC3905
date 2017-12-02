let points = [
  -0.5,-0.5,0,0.5,0,0,0.5,0.5,0
];
!function init() {
  function x() {console.log("x");};x();
  let canvas = document.getElementById("3d-canvas");
  let gl = canvas.getContext("webgl");
  if(!gl) return;
  let program = shaderprogram(gl, ["fshader", "vshader"]);
  gl.useProgram(program);
  
  
  let vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  function drawScene() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);


    var coord = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);


    gl.clearColor(0.5, 0.2, 0.5, 0.9);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  drawScene();
}();

function getshader(gl, id) {
  let elem = document.getElementById(id);
  let type = elem.getAttribute("type")==="x-shader/x-vertex"?gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  let shader = gl.createShader(type);
  gl.shaderSource(shader, elem.textContent);
  gl.compileShader(shader);
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