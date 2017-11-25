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

!function ()
{
  let time = document.getElementById("last-time");
  time.innerHTML=data.datum;
  
  let pressure = document.getElementById("pressure").getElementsByClassName("value")[0];
  let light = document.getElementById("light").getElementsByClassName("value")[0];
  let temperature = document.getElementById("temperature").getElementsByClassName("value")[0];
  let gamma = document.getElementById("gamma").getElementsByClassName("value")[0];
  let humidity = document.getElementById("humidity").getElementsByClassName("value")[0];
  let windd = document.getElementById("windd").getElementsByClassName("value")[0];
  let windv = document.getElementById("windv").getElementsByClassName("value")[0];
  
  pressure.innerHTML=data.druck;
  temperature.innerHTML=data.temperatur;
  light.innerHTML=data.licht;
  gamma.innerHTML=data.gamma;
  windv.innerHTML=data.windgeschwindigkeit;
  windd.innerHTML=data.windrichtung;
  humidity.innerHTML=data.feuchte;
}();