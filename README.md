# CTEC3905: Front-End-Web dev.
## Background
In 2014 four students and me developed a weather station that is currently in use in Maulburg, Germany. The data is sent to a server that saves it in a database. In this module I decided to develop a website which can display these data (including an unusual 3D chart).
## Wireframes and Tasks
Three versions of the wireframe are availabe in the [Documentation](./Documentation) folder. The latest one is the following [Mobile](./Documentation/V3M.jpg) and [Desktop](./Documentation/V3D.jpg)

According to this wireframe, following tasks had to be considered:
- [x] Fetching Data from the server
  - [x] writing a proxy server who changes the origin-header-attribute to '*'
- [x] Creating a 2d-diagram
  - [x] parsing data
  - [x] find suitable tick intervals for the axis
  - [x] display the graph in a svg element
- [x] Creating a 3d-diagram
  - [x] parsing data
  - [x] smoothing data (otherwise the fluctuation is too high)
  - [x] find lines in the 3D space
  - [x] write shader programs to colour the vertices
  - [x] include basic matrix multiplications to accomplish rotations according to a user input or automatically after three seconds.
  - [x] include a projection matrix
- [x] Responiveness of the site through CSS
  - [x] making a table look nice on a mobile device without loosing information
  - [x] general repositioning and changed behaviour of elements
- [] History as content

## The site in more detail
The website is a single-page-app (index.html). When this page is loaded, data is requested via ajax from the localhost (127.0.0.1:12346). On this socket, the C# program [ProxyWebServer](./Proxy/ProxyWebServer) listens and forwards the requests the weather server located at http://wetter-maulburg.de and returns the response with a new header to avoid same-origin-policy problems (Workaround). If the local server is not responding (or not started) the website will display [example data](./js/json.js) and will show the user that a problem occured (alert message). JavaScript injects the gathered data at specific points in the DOM (table, latest values, diagrams) to build the webpage.

## IA
The webpage leads the user through the weather data in a particular order. Maybe the most important information is the development of the values over time in the last week. This is shown in the 2d and the 3d diagram at the beginning of the page. Followed by the question what the current values are; The next section of the page will provide the answer. Last but not least the table shows the bounds of the values (maximum, minimum and average). 

## PARC
principle | example
------------ | -------------
**Proximity**  | see latest data visualization (grouping together).
**Alignment**  | mobile-design: left padding
**Repetition** | see latest data visualization (same styling)
**Contrast**   | each section has its own color
