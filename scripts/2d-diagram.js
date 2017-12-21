let diagram2dhandler;
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
  diagram.xticks = document.getElementById("x-labels");
  diagram.yticks = document.getElementById("y-labels");
  diagram.unit = document.getElementById("unit");
  diagram.axis = document.getElementsByClassName("axis");
  diagram.width = parseInt(diagram.axis[1].getAttribute("x2")) - parseInt(diagram.axis[1].getAttribute("x1"));

  diagram.height = parseInt(diagram.axis[0].getAttribute("y2")) - parseInt(diagram.axis[0].getAttribute("y1"));
  diagram.position.x = parseInt(diagram.axis[0].getAttribute("x1"));
  diagram.position.y = parseInt(diagram.axis[0].getAttribute("y2"));
  diagram.animLine =
    document.getElementById("diagram-path").getElementsByTagName("animate")[0];
  diagram.animArea =
    document.getElementById("diagram-area").getElementsByTagName("animate")[0];
  diagram.animLine.addEventListener("endEvent", function () {
    diagram.animLine.setAttribute("from", diagram.animLine.getAttribute("to"));
  }, false);
  diagram.animArea.addEventListener("endEvent", function () {
    diagram.animArea.setAttribute("from", diagram.animArea.getAttribute("to"));
  }, false);

  diagram.contime = function (t) {
    return ((t - this.v.dmin) * this.width / (this.v.dmax - this.v.dmin) + this.position.x);
  }

  diagram.conx = function (e, x) {
    return (this.position.y - (e.max - e.min !== 0 ? (x - e.min) * this.height / (e.max - e.min) : 0));
  }
  diagram.con = function (e, i) {
    return ` ${this.contime(this.v.datum[i])},${this.conx(e, e.data[i])}`;
  }

  diagram.init = function () {
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
    if (this.animLine.beginElement) {
      let str = "";
      for (let i = 0; i < this.v.datum.length; ++i) {
        str += ` ${this.contime(this.v.datum[i])},${this.position.y - this.height/2}`;
      }

      this.animLine.setAttribute("from", str);
      this.animArea.setAttribute("from", str + ` ${this.position.x+this.width},${this.position.y}` + ` ${this.position.x},${this.position.y}`);
    }
    this.makeLabels();
  }



  diagram.build = function (e) {
    let str = "";
    for (let i = 0; i < this.v.datum.length; ++i) {
      str += this.con(diagram.v.method[e], i);
    }
    if (this.animLine.beginElement) {
      this.animLine.setAttribute("to", str);
      this.animArea.setAttribute("to", str + ` ${this.position.x+this.width},${this.position.y}` + ` ${this.position.x},${this.position.y}`);

      this.animArea.beginElement();
      this.animLine.beginElement();
    } else {
      document.getElementById("diagram-path").setAttribute("points", str);
      document.getElementById("diagram-area").setAttribute("points", str + ` ${this.position.x+this.width},${this.position.y}` + ` ${this.position.x},${this.position.y}`);
    }
    switch (e) {
      case 0:
        this.unit.textContent = "°C";
        break;
      case 1:
        this.unit.textContent = "lux";
        break;
      case 2:
        this.unit.textContent = "hPa";
        break;
      case 3:
        this.unit.textContent = "µSv/h";
        break;
      case 4:
        this.unit.textContent = "km/h";
        break;
      case 5:
        this.unit.textContent = "%";
        break;
      case 6:
        this.unit.textContent = "V";
        break;
    }
    this.ticksY(e);
  }



  diagram.ticksY = function (e) {
    while (this.yticks.firstChild) {
      this.yticks.removeChild(this.yticks.firstChild);
    }
    let m = diagram.v.method[e];

    function ticks(range) {
      let s = 10 ** (Math.floor(Math.log10(range / 10)));
      let interval = [s, 2 * s, 5 * s];
      let mult = 1;
      let ticks;
      for (let i = 0; i < interval.length; ++i) {
        ticks = mult * interval[i];
        if (range / ticks <= 10) break;
        if (i === interval.length - 1) {
          mult *= 10;
          i = 0;
        }
      }
      return ticks;
    }


    let tickInterval = ticks(m.max - m.min);
    let rest = tickInterval * (Math.floor(m.min / tickInterval) + 1);

    let num = tickInterval >= 1 ? 0 : -Math.log10(tickInterval) + 1;
    for (let i = rest; i < m.max; i += tickInterval) {
      let y = diagram.conx(m, i)
      let node = document.createElementNS("http://www.w3.org/2000/svg", "text");
      node.setAttribute("x", 55);
      node.setAttribute("y", y + 5);
      node.innerHTML = i.toFixed(num);
      diagram.yticks.appendChild(node);
      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", 65);
      line.setAttribute("y1", y);
      line.setAttribute("x2", 75);
      line.setAttribute("y2", y);
      diagram.yticks.appendChild(line);
    }
  }

  diagram.makeLabels = function () {
    let interval = [1, 15, 2,
                  2, 15, 2,
                  2, 6, 2,
                  2, 7,
                  4,
                  12];

    function timestring(t) {
      return `${t.getDate()}.${t.getMonth()+1} ${t.getHours()}:${t.getMinutes()}`;
    }

    function ticks(range, num) {
      let start = 1000;
      for (let i = 0; i < interval.length; ++i) {
        start *= interval[i];
        if (range / start <= num) break;
      }
      return start;
    }

    let tickInterval = ticks(diagram.v.dmax - diagram.v.dmin, 10);
    for (let i = diagram.v.dmin % tickInterval; i + diagram.v.dmin < diagram.v.dmax; i += tickInterval) {
      let x = diagram.contime(i + diagram.v.dmin)
      let node = document.createElementNS("http://www.w3.org/2000/svg", "text");
      node.setAttribute("x", x);
      node.setAttribute("y", "700");
      let time = new Date(diagram.v.dmin + i);
      node.innerHTML = timestring(time);
      node.setAttribute("transform", `rotate(-60 ${x} 700)`);
      diagram.xticks.appendChild(node);

      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("y1", "675");
      line.setAttribute("x2", x);
      line.setAttribute("y2", "685");
      diagram.xticks.appendChild(line);
    }
  }
  diagram2dhandler = diagram;
}();