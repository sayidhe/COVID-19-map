var m_width = $("#map").width(),
  width = 960,
  height = 500,
  centered;

var projection = d3.geoMercator()
  .center([104, 36])
  .scale(200)
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

const fetchMapData = d3.json("./assets/json/output.json")
// const fetchMapData = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json")
const fetchCsvData = d3.json("./assets/json/data.json")

Promise.all([fetchMapData, fetchCsvData]).then(results => {
  const mapData = results[0]
  const csvData = results[1]
  const csvMap = {}
  csvData.forEach(item => {
    csvMap[item.id] = item
  })

  Object.keys(mapData.objects).map(object => {
    g.append("g")
      .attr("id", object)
      .selectAll("path")
      .data(topojson.feature(mapData, mapData.objects[object]).features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", function(d) {
        const id = d.properties.ne_id || d.properties.NE_ID
        if (csvMap[id]) {
          return getAreaColor(csvMap[id].confirmed)
        }
        return '#ccc'
      })
      .attr("class", object)
      .on("click", clicked)
  })
})

const zoom = d3.zoom().scaleExtent([0.8, 2]).on("zoom", () => {
  g.attr('transform', d3.event.transform)
})

svg.call(zoom)

function getAreaColor(arg) {
  const num = Number(arg)
  switch (true) {
    case num > 1000:
      return '#FF5151'
      break
    case num > 500:
      return '#FF9797'
      break
    case num > 100:
      return '#FFB5B5'
      break
    case num > 10:
      return '#FFD2D2'
      break
    case num > 0:
      return '#FFECEC'
      break
    default:
      return '#F0F0F0'
  }
}

function clicked(d) {
  console.log(d);
  console.log(d.properties.name_zh)
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

  // g.transition()
  //   .duration(750)
  //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
  //   .style("stroke-width", 1.5 / k + "px");
}
