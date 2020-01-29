var m_width = $("#map").width(),
  width = 960,
  height = 400,
  centered;

var projection = d3.geoMercator()
  .center([104, 36])
  .scale(250)
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

var svg = d3.select("#map").append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("width", m_width)
  .attr("height", m_width * height / width);

svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)

var g = svg.append("g");

d3.json("./assets/json/output.json").then(data => {
  Object.keys(data.objects).map(object => {
    g.append("g")
      .attr("id", object)
      .selectAll("path")
      .data(topojson.feature(data, data.objects[object]).features)
      .enter().append("path")
      .attr("d", path)
      .attr("class", object)
  })
  g.selectAll(".place-label")
    .data(topojson.feature(data, data.objects.countries_min).features)
    .enter().append("text")
    .attr("class", "place-label")
    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.properties.NAME })
})

const zoom = d3.zoom().on("zoom", () => {
  g.attr('transform', d3.event.transform)
})

svg.call(zoom)

function clicked(d) {
  console.log(d);
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
    .classed("active", centered && function (d) { return d === centered; });

  g.transition()
    .duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
}