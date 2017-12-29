# CTEC3905: Front-End-Web dev.
## Background
In 2014 four students and I developed a weather station that is currently in use in Maulburg, Germany. Its data is sent to a server that saves it in a database. In this module, I decided to develop a website which can display these data (including an *unusual* 3D visualization).

## Wireframes and Tasks
Three versions of the wireframe are available in the [Documentation](./Documentation) folder. The latest one is the following [Mobile](./Documentation/V3M.jpg) and [Desktop](./Documentation/V3D.jpg)

Following tasks were considered:
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
  - [x] include labelling and axis
- [x] Responsiveness of the site through CSS
  - [x] making a table look nice on a mobile device without losing information
  - [x] general repositioning and changed behaviour of elements
- [x] History as content
- [x] Idea for loading the page faster (e.g. waiting animation)

## The site in more detail
The website is a single-page-app (index.html). When this page is loaded, data is requested via ajax from the localhost (127.0.0.1:12346). On this socket, the C# program [ProxyWebServer](./Proxy/ProxyWebServer) listens and forwards the requests the weather server located at http://wetter-maulburg.de and returns the response with a new header to avoid same-origin-policy problems (Workaround). If the local server is not responding (or not started) the website will display [example data](./scripts/json.js) and will show the user that a problem occurred (alert message). JavaScript injects the gathered data at specific points in the DOM (table, latest values, diagrams) to build the webpage.

## IA
The webpage leads the user through the weather data in a particular order. Maybe the most important information is the development of the values over time in the last week. This is shown in the 2d and the 3d diagram at the beginning of the page. Followed by the question what the current values are; The next section of the page will provide the answer. Last but not least the table shows the bounds of the values (maximum, minimum and average). 

## PARC
principle | example
------------ | -------------
**Proximity**  | see latest data visualization (grouping together).
**Alignment**  | mobile-design: left padding
**Repetition** | see latest data visualization (same styling)
**Contrast**   | colour separates information

## Development process
Trial and error has been used for building the solution due to the prototyping characteristic of the project. Therefore, the solution might not be as clean and straightforward as possible. 

## User testing results
*only tested on chrome!*
+ **Issue 1:** rotation timer is started more than once if the user touches the diagram with two fingers.
  + *solution:* only starting the timer if it has a null reference
+ **Issue 2:** animation between data sets (in the 2d diagram) are cancelled when the user switches the values too quickly.
  + *solution:* overwriting the points attribute when the new value is selected.

## References
+ WebGL:
  + Tutorials and examples at https://developer.mozilla.org/de/docs/Web/API/WebGL_API
  + Ideas and implementation examples at https://webglfundamentals.org/
  + Projection matrix at https://stackoverflow.com/questions/28286057/trying-to-understand-the-math-behind-the-perspective-matrix-in-webgl/28301213#28301213
+ JavaScript
  + Starting animation at https://properdesign.rs/blog/2015/02/animating-svg-with-beginelement/
+ CSS
  + Making triangles at https://css-tricks.com/snippets/css/css-triangle/
+ Algorithms
  + Smoothing ideas at https://en.wikipedia.org/wiki/Smoothing
  + Mashing alg. (totally different implementation, though) idea at https://de.wikipedia.org/wiki/Delaunay-Triangulierung
+ Icon image is developed with GIMP; Favicons are derived automatically with https://realfavicongenerator.net 
+ Sitemaps protocol at https://de.wikipedia.org/wiki/Sitemaps-Protokoll
+ Smaller searches (names of functions, parameter order and so on) at https://developer.mozilla.org, https://css-tricks.com/ and https://www.w3schools.com/.
