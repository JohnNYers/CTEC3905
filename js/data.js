! function () {
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
          "name": "druck",
          max: 0,
          min: Infinity,
          data: []
        }, {
          "name": "licht",
          max: 0,
          min: Infinity,
          data: []
        }, {
          "name": "gamma",
          max: 0,
          min: Infinity,
          data: []
        }
      ]
    }
  };
  diagram.axis = document.getElementById("diagram").getElementsByClassName("axis");
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
  //diagram.d("M10 80 Q 52.5 10, 95 80 T 180 80 T 290 80");
  
  for (let i = 0; i < ddata.length; ++i) {
    let date = new Date(ddata[i].datum).getTime();
    diagram.v.datum[i] = date;
    if (diagram.v.dmax < date) diagram.v.dmax = date;
    if (diagram.v.dmin > date) diagram.v.dmin = date;
    for(let j = 0; j < diagram.v.method.length; ++j)
      {
        let tmp = parseFloat(ddata[i][diagram.v.method[j].name]);
        diagram.v.method[j].data[i] = tmp;
        if (diagram.v.method[j].max < tmp) diagram.v.method[j].max = tmp;
        if (diagram.v.method[j].min > tmp) diagram.v.method[j].min = tmp;
      }
    
  }


  let testdata = {
    data: [[10, 80], [52.5, 10], [95, 80], [180, 80], [290, 80]]
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
      str += this.con(e, i);
    }
    this.anim.setAttribute("to", str);
    this.anim.beginElement();
  }

  diagram.init();
  let c=0;
  setInterval(function(){ 
    if(c === diagram.v.method.length) c = 0;
    diagram.build(diagram.v.method[c++]);
  }, 3000);
  
  console.log(diagram.v);
}();




let data = {
  "id": "33360",
  "datum": "2017-11-25 05:30:20",
  "temperatur": "10.68",
  "druck": "1008.88",
  "licht": "0",
  "feuchte": "-21.22",
  "windgeschwindigkeit": "4.85",
  "windboe": "8.65",
  "windrichtung": "252.86",
  "gamma": "0.133",
  "akku": "12.41"
};

! function () {
  let time = document.getElementById("last-time");
  time.innerHTML = data.datum;

  let pressure = document.getElementById("pressure").getElementsByClassName("value")[0];
  let light = document.getElementById("light").getElementsByClassName("value")[0];
  let temperature = document.getElementById("temperature").getElementsByClassName("value")[0];
  let gamma = document.getElementById("gamma").getElementsByClassName("value")[0];
  let humidity = document.getElementById("humidity").getElementsByClassName("value")[0];
  let windd = document.getElementById("windd").getElementsByClassName("value")[0];
  let windv = document.getElementById("windv").getElementsByClassName("value")[0];

  pressure.innerHTML = data.druck;
  temperature.innerHTML = data.temperatur;
  light.innerHTML = data.licht;
  gamma.innerHTML = data.gamma;
  windv.innerHTML = data.windgeschwindigkeit;
  windd.innerHTML = data.windrichtung;
  humidity.innerHTML = data.feuchte;
}();