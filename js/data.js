! function () {
  let now = new Date;
  let weekago = new Date(now.getTime() - 604800000);
  update(d2str(weekago), d2str(now));
}();

function d2str(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

function update(dstart, dend, reqest) {
  let finish = 0;
  let alertBit = 0;
  function initcall() {
    if(finish >= 1) {
      if(alertBit !== 0) alert("Fetching data was not successful.\nTry to restart the local server or check whether (not weather :D) the server http://wetter-maulburg.de is working as expected.\n This site will continue with saved example data.");
      init();
    }
    else ++finish;
  }
  let xhttpVal = new XMLHttpRequest();
  xhttpVal.onreadystatechange = function () {
    if (this.readyState === 4) {
      if(this.status === 200) {
        d3data = JSON.parse(this.responseText);
      }
      else {
        alertBit |= 1; 
      }
      initcall();
    }
  };
  xhttpVal.open("GET", `http://127.0.0.1:12346/jsonSql.php?start=${dstart}&end=${dend}`, true);
  xhttpVal.send();
  
  let xhttpMax = new XMLHttpRequest();
  xhttpMax.onreadystatechange = function () {
    if (this.readyState === 4) {
      if(this.status === 200) {
        maxval = JSON.parse(this.responseText);
      }
      else {
        alertBit |= 2; 
      }
      initcall();
    }
  };
  xhttpMax.open("GET", `http://127.0.0.1:12346/maxValues.php?start=${dstart}&end=${dend}`, true);
  xhttpMax.send();
};

function init() {
  diagram2dhandler.init();
  diagram2dhandler.build(0);
  diagram3dhandler.init();
  diagram3dhandler.draw();
  diagram3dhandler.beginrotate();
  diagram3dhandler.addevents();

  let time = document.getElementById("last-time");
  let data = d3data[d3data.length - 1];
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
  let active = addTablerow("Temperature", maxval.mintemperatur, maxval.maxtemperatur, maxval.avgtemperatur, " °C");
  active.classList.add("active");
  maxvaltable.appendChild(active);
  maxvaltable.appendChild(addTablerow("Pressure", maxval.mindruck, maxval.maxdruck, maxval.avgdruck, " hPa"));
  maxvaltable.appendChild(addTablerow("Light", maxval.minlicht, maxval.maxlicht, maxval.avglicht, " lux"));
  maxvaltable.appendChild(addTablerow("Gamma", maxval.mingamma, maxval.maxgamma, maxval.avggamma, " mµSv/h"));
  maxvaltable.appendChild(addTablerow("Humidity", maxval.minfeuchte, maxval.maxfeuchte, maxval.avgfeuchte, " %"));
  maxvaltable.appendChild(addTablerow("Wind", maxval.minwindgeschwindigkeit, maxval.maxwindgeschwindigkeit, maxval.avgwindgeschwindigkeit, " km/h"));
  maxvaltable.appendChild(addTablerow("Battery", maxval.minakku, maxval.maxakku, maxval.avgakku, " V"));
  let trs = maxvaltable.getElementsByTagName("tr");

  for (let i = 1; i < trs.length; ++i) {
    trs[i].addEventListener("click", function () {
      active.classList.remove("active");
      trs[i].classList.add("active");
      active = trs[i];
    });
  }
}

function addTablerow(name, min, max, avg, ex) {
  let node = document.createElement("tr");
  node.innerHTML = `<td>${name}</td><td>${max}${ex}</td><td>${min}${ex}</td><td>${avg}${ex}</td>`;
  return node;
}