let points = [];
let colors = [];
let numbervalues;

function max(a, b) {
  return a < b ? b : a;
}

function min(a, b) {
  return a > b ? b : a;
}

function distance(a, b, dy) {
  let dx = a[0] - b[0];
  return Math.sqrt(dx * dx + dy * dy);
}

function linearize(p) {
  let y = [];
  let count = 0;
  for (let v = 0; v < numbervalues; ++v) {
    y[v] = [];
    for (let j = 0; j < p.length; ++j) {
      let ls = 0;
      let rs = 0;
      if(!p[j]) continue;
      for (let i = 0; i < p[j][v].length; ++i) {
        if(j > 0) {
          let d = Infinity;
          if(!p[j-1]) continue;
          for (let z = ls; z < p[j - 1][v].length; ++z) {
            let dd = distance(p[j][0][i], p[j - 1][0][z], j / 7);
            if (dd <= d) {
              d = dd;
              ls = z;
            } else {

              break;
            }
            y[v] = y[v].concat([j / p.length - 0.5].concat(p[j][v][i]));
            y[v] = y[v].concat([(j - 1) / p.length - 0.5].concat(p[j - 1][v][ls]));
          }
        }
        if (j < p.length - 1) {

        }

        if (i > 0) {
          y[v] = y[v].concat([j / p.length - 0.5].concat(p[j][v][i]));
          y[v] = y[v].concat([j / p.length - 0.5].concat(p[j][v][i - 1]));
        }
      }
    }
  }
  return y;
}

function smooth(p, e, d, b) {
  
  if (!d) d = 0.02;
  if (!e) e = 5;
  
  let y = [];
  for (let v = 0; v < numbervalues; ++v) {
    y[v] = [];
    for (let i = 0; i < p[0].length; ++i) {
      if (y[v].length > 0)
        if (p[0][i] - y[v][y[v].length - 1][0] < d) continue;
      let sum = 0;
      let num = 0;
      for (let j = max(i - e, 0); j < min(i + e, p[0].length); ++j) {
        sum += p[1][v][j];
        ++num;
      }
      y[v][y[v].length] = [p[0][i], sum / num];
      if (sum / num > b[v].max) b[v].max = sum / num;
      if (sum / num < b[v].min) b[v].min = sum / num;
    }
  }
  return y;
}

function parse3d() {
  function Bound() {
    this.min = Infinity,
      this.max = 0
  }
  numbervalues = 7;
  let otime = new Date(d3data[0].datum).getTime();
  
  let p = [];
  let bounds = [];
  for(let i = 0; i < numbervalues; ++i) {
    bounds[i] = new Bound();
  }
  for (let i = 0; i < d3data.length; ++i) {
    let tdif = new Date(d3data[i].datum).getTime() - otime;
    let index = parseInt(tdif / 86400000);
    
    if(!p[index]) {
      p[index] = [[], [[], [], [], [], [], [], []]];
    }
    p[index][0].push(tdif % 86400000 / 86400000 - 0.5);

    p[index][1][0].push(parseFloat(d3data[i]["temperatur"]));
    p[index][1][1].push(parseFloat(d3data[i]["licht"]));
    p[index][1][2].push(parseFloat(d3data[i]["druck"]));
    p[index][1][3].push(parseFloat(d3data[i]["gamma"]));
    p[index][1][4].push(parseFloat(d3data[i]["windgeschwindigkeit"]));
    p[index][1][5].push(parseFloat(d3data[i]["feuchte"]));
    p[index][1][6].push(parseFloat(d3data[i]["akku"]));
  }
  
  for (let i = 0; i < p.length; ++i) {
    if(p[i]) p[i] = smooth(p[i], 5, 0.005, bounds);
  }

  points = linearize(p);
  for (let j = 0; j < points.length; ++j) {
    for (let i = 0; i < points[j].length / 3; ++i) {
      let temp = ((points[j][i * 3 + 2] - bounds[j].min) / (bounds[j].max - bounds[j].min)).toFixed(5);
      points[j][i * 3 + 2] = temp - .5;
      getcolor(temp, i, j);
    }
  }

  function getcolor(c, i, v) {
    if (!colors[v]) colors[v] = [];
    let indexes = [
      [0, 0, 1], //blue
      [0, 1, 1], //cyan
      [0, 1, 0], //green
      [1, 1, 0], //yellow
      [1, 0, 0] //red
    ];

    let f = 0,
      ilow, ihigh;
    if (c <= 0) ilow = ihigh = 0;
    else if (c >= 1) ilow = ihigh = indexes.length - 1;
    else {
      c = c * (indexes.length - 1);
      ilow = parseInt(c);
      f = c - ilow;
      ihigh = ilow + 1;

    }
    for (let j = 0; j < 3; ++j) {
      colors[v][i * 4 + j] = (indexes[ihigh][j] - indexes[ilow][j]) * f + indexes[ilow][j];
    }
    colors[v][i * 4 + 3] = 1;
  }
}

let diagram3dhandler = {
  data: function () {
    parse3d();
    this.vertex_buffer = [];
    this.vertex_color_buffer = [];
    if (points.length <= 0) throw "no data.";
    this.index = 0;
    for (let i = 0; i < points.length; ++i) {
      this.vertex_buffer[i] = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer[i]);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points[i]), this.gl.STATIC_DRAW);
      this.vertex_color_buffer[i] = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_color_buffer[i]);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors[i]), this.gl.STATIC_DRAW);
    }
  },
  init: function () {
    let value = 0;
    this.canvas = document.getElementById("diagram3d");
    this.gl = this.canvas.getContext("webgl");
    if (!this.gl) {
      this.gl = this.canvas.getContext("experimental-webgl");
      if (!this.gl) {
        alert("WebGL is not supported.")
        return;
      }
    }
    this.program = shaderprogram(this.gl, ["vshader", "fshader"]);
    this.gl.useProgram(this.program);

    this.matrixRotation = this.gl.getUniformLocation(this.program, "rot_matrix");
    this.stdmatrix = [1, 0, 0, 0,
               0, 1, 0, 0,
               0, 0, 1, 0,
               0, 0, 0, 1];

    this.x = -90,
      this.y = 0;
    let dif = 2;

    this.matrixProjection = this.gl.getUniformLocation(this.program, "proj_matrix");
    this.promat = makeproj(Math.PI * .21, this.canvas.width / this.canvas.height, 1.5, 3.5);
    this.data();
  },
  draw: function (idx) {
    if (this.gl.canvas.width !== this.canvas.clientWidth) this.canvas.width = this.gl.canvas.clientWidth;
    if (this.gl.canvas.height !== this.canvas.clientHeight) this.canvas.height = this.gl.canvas.clientHeight;
    if (idx && idx !== this.index) this.index = idx;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer[this.index]);
    var coord = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(coord);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_color_buffer[this.index]);
    var col = this.gl.getAttribLocation(this.program, "a_color");
    this.gl.vertexAttribPointer(col, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(col);
    this.gl.uniformMatrix4fv(this.matrixRotation, false, mul(translate(0, 0, -2.5), mul(rotationX(this.x), mul(rotationY(this.y), this.stdmatrix))));
    this.promat = makeproj(Math.PI * .21, this.canvas.width / this.canvas.height, 1.5, 3.5);
    this.gl.uniformMatrix4fv(this.matrixProjection, false, this.promat);

    //gl.clearColor(0.5, 0.2, 0.5, 0.9); //lila
    //this.gl.clearColor(.2, .28, .36, 1.0); //d-blue
    //this.gl.clearColor(.086, .627, .522,1.0); //green
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.drawArrays(this.gl.LINES, 0, parseInt(points[this.index].length / 3));
  },
  beginrotate: function () {
    let that = this;
    this.interval = setInterval(function () {
      that.y += 2;
      that.draw();
    }, 50);
  },
  endrotate: function () {
    if (this.interval) clearInterval(this.interval);
  },
  addevents: function () {
    let mousedown = false;
    let that = this;
    let timer;

    this.canvas.addEventListener("mousedown", function () {
      that.endrotate();
      if (timer) clearTimeout(timer);
      mousedown = true;
    });
    this.canvas.addEventListener("mouseup", function () {
      timer = setTimeout(function () {
        that.beginrotate();
      }, 3000);
      mousedown = false;
    });
    this.canvas.addEventListener("mousemove", function (e) {
      if (!mousedown) return;
      that.y += e.movementX / 2 * 2;
      that.x += e.movementY / 2 * 2;
      that.draw();
    });
    let touchpos;
    this.canvas.addEventListener("touchstart", function (e) {
      that.endrotate();
      if (timer) clearTimeout(timer);
      touchpos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      e.preventDefault();
    });
    this.canvas.addEventListener("touchmove", function (e) {
      let dx = e.changedTouches[0].clientX - touchpos[0];
      let dy = e.changedTouches[0].clientY - touchpos[1];
      touchpos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
      that.y += dx / 2 * 2;
      that.x += dy / 2 * 2;
      that.draw();
      e.preventDefault();
    });
    this.canvas.addEventListener("touchend", function (e) {
      timer = setTimeout(function () {
        that.beginrotate();
      }, 3000);
    });
  }
};

function r2d(r) {
  return r / 180 * Math.PI;
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

function translate(x, y, z) {
  return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ];
}

function makeproj(fov, ar, near, far) {
  let f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
  let rangeInv = 1 / (near - far);

  return [
    f / ar, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}

function mul(a, b) {
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
  let type = elem.getAttribute("type") === "x-shader/x-vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  let shader = gl.createShader(type);
  gl.shaderSource(shader, elem.textContent);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(id + ">>>" + gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function shaderprogram(gl, ids) {
  var program = gl.createProgram();
  for (let i = 0; i < ids.length; ++i) {
    gl.attachShader(program, getshader(gl, ids[i]));
  }
  gl.linkProgram(program);
  return program;
}