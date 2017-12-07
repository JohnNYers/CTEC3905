let diagram2dhandler;
!function () {
  let diagram = {
    position: {
      x: 0,
      y: 0
    },
    v: {
      datum: [],
      dmax: 0,
      dmin: Infinity,
      method: [{
          "name": "temperatur",
          max: 0,
          min: Infinity,
          data: []
        
        }, {
          "name": "licht",
          max: 0,
          min: Infinity,
          data: []
        }, {
          "name": "druck",
          max: 0,
          min: Infinity,
          data: []
        }, {
          "name": "gamma",
          max: 0,
          min: Infinity,
          data: []
        },
               {
          "name": "windgeschwindigkeit",
          max: 0,
          min: Infinity,
          data: []
        
        },
               {
          "name": "feuchte",
          max: 0,
          min: Infinity,
          data: []
        
        },
               {
          "name": "akku",
          max: 0,
          min: Infinity,
          data: []
        
        }
      ]
    }
  };
  diagram.axis = document.getElementById("diagram2d").getElementsByClassName("axis");
  diagram.width = parseInt(diagram.axis[1].getAttribute("x2")) - parseInt(diagram.axis[1].getAttribute("x1"));

  diagram.height = parseInt(diagram.axis[0].getAttribute("y2")) - parseInt(diagram.axis[0].getAttribute("y1"));
  diagram.position.x = parseInt(diagram.axis[0].getAttribute("x1"));
  diagram.position.y = parseInt(diagram.axis[0].getAttribute("y2"));
  diagram.d = function (e) {
    document.getElementById("diagram-path").setAttribute("points", e);
  };
  diagram.anim =
    document.getElementById("diagram-path").getElementsByTagName("animate")[0];

  diagram.anim.addEventListener("endEvent", function () {
    diagram.anim.setAttribute("from", diagram.anim.getAttribute("to"));
  }, false);

  for (let i = 0; i < d3data.length; ++i) {
    let date = new Date(d3data[i].datum).getTime();
    diagram.v.datum[i] = date;
    if (diagram.v.dmax < date) diagram.v.dmax = date;
    if (diagram.v.dmin > date) diagram.v.dmin = date;
    for (let j = 0; j < diagram.v.method.length; ++j) {
      let tmp = parseFloat(d3data[i][diagram.v.method[j].name]);
      diagram.v.method[j].data[i] = tmp;
      if (diagram.v.method[j].max < tmp) diagram.v.method[j].max = tmp;
      if (diagram.v.method[j].min > tmp) diagram.v.method[j].min = tmp;
    }

  }

  diagram.init = function () {
    let str = "";
    for (let i = 0; i < this.v.datum.length; ++i) {
      str += ` ${(this.v.datum[i]-this.v.dmin)*this.width/(this.v.dmax - this.v.dmin) + this.position.x},${this.position.y - this.height/2}`;
    }
    //this.d(str);
    this.anim.setAttribute("from", str);
  }

  diagram.con = function (e, i) {
    return ` ${(this.v.datum[i]-this.v.dmin)*this.width/(this.v.dmax - this.v.dmin) + this.position.x},${this.position.y - (e.max-e.min !== 0?(e.data[i]-e.min)*this.height/(e.max - e.min):0)}`;
  }

  diagram.build = function (e) {
    let str = "";
    for (let i = 0; i < this.v.datum.length; ++i) {
      str += this.con(diagram.v.method[e], i);
    }
    this.anim.setAttribute("to", str);
    this.anim.beginElement();
  }

  diagram.init();
  diagram.build(0);
  diagram2dhandler = diagram;
}();


!function () {
  let time = document.getElementById("last-time");
  let data = d3data[d3data.length-1];
  time.innerHTML = data.datum;

  let pressure = document.getElementById("pressure").getElementsByClassName("value")[0];
  let light = document.getElementById("light").getElementsByClassName("value")[0];
  let temperature = document.getElementById("temperature").getElementsByClassName("value")[0];
  let gamma = document.getElementById("gamma").getElementsByClassName("value")[0];
  let humidity = document.getElementById("humidity").getElementsByClassName("value")[0];
  let windd = document.getElementById("windd").getElementsByClassName("value")[0];
  let windv = document.getElementById("windv").getElementsByClassName("value")[0];
  let battery = document.getElementById("battery").getElementsByClassName("value")[0];

  pressure.innerHTML = data.druck;
  temperature.innerHTML = data.temperatur;
  light.innerHTML = data.licht;
  gamma.innerHTML = data.gamma;
  windv.innerHTML = data.windgeschwindigkeit;
  windd.innerHTML = data.windrichtung;
  humidity.innerHTML = data.feuchte;
  battery.innerHTML = data.akku;
  
  let maxvaltable = document.getElementById("max-val-table");
  
  maxvaltable.appendChild(addTablerow("Temperature", maxval.mintemperatur, maxval.maxtemperatur, maxval.avgtemperatur, " °C"));
  maxvaltable.appendChild(addTablerow("Pressure", maxval.mindruck, maxval.maxdruck, maxval.avgdruck, " hPa"));
  maxvaltable.appendChild(addTablerow("Light", maxval.minlicht, maxval.maxlicht, maxval.avglicht, " lux"));
  maxvaltable.appendChild(addTablerow("Gamma", maxval.mingamma, maxval.maxgamma, maxval.avggamma, " mµSv/h"));
  maxvaltable.appendChild(addTablerow("Humidity", maxval.minfeuchte, maxval.maxfeuchte, maxval.avgfeuchte, " %"));
  maxvaltable.appendChild(addTablerow("Wind", maxval.minwindgeschwindigkeit, maxval.maxwindgeschwindigkeit, maxval.avgwindgeschwindigkeit, " km/h"));
  maxvaltable.appendChild(addTablerow("Battery", maxval.minakku, maxval.maxakku, maxval.avgakku, " V"));
  
}();

function addTablerow(name, min, max, avg, ex)
{
  let node = document.createElement("tr");
  node.innerHTML = `<td>${name}</td><td>${max}${ex}</td><td>${min}${ex}</td><td>${avg}${ex}</td>`;
  return node;
}