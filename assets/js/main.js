var m_width = $("#map").width(),
  width = 960,
  height = 500,
  rotate = -150,
  centered;

var projection = d3.geoMercator()
  .rotate([rotate,0])
  .center([-40, 36])
  .scale(400)
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

var svg = d3.select("#map").append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("width", '100%')
  .attr("height", '100%');

svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)

var g = svg.append("g");

const infoCard = d3.select('#map').append('div')
  .attr('class', 'info-card')
  .style("display", "none")

const csvMap = {}

const fetchMapData = d3.json("./assets/json/output.json")
// const fetchMapData = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json")
const fetchCsvData = d3.json("./assets/json/data.json")

Promise.all([fetchMapData, fetchCsvData]).then(([mapData, csvData]) => {
  const keys = ['china', 'world']
  keys.forEach(key => {
    csvData[key].forEach(item => {
      csvMap[item.id] = item
    })
  })

  Object.keys(mapData.objects).map(object => {
    g.append("g")
      .attr("id", object)
      .selectAll("path")
      .data(topojson.feature(mapData, mapData.objects[object]).features)
      .enter().append("path")
        .attr("d", path)
        .attr("fill", getAreaColor)
        .attr("class", object)
        .on("mouseover", function (d) {
          const id = d.properties.ne_id || d.properties.NE_ID
          showInfoCard(d, csvMap[id])
          d3.select(this).attr("fill", function () {
            return d3.color(getAreaColor(d)).brighter(0.5)
          })
        })
        .on("mouseout", function (d) {
          hideInfoCard()
          d3.select(this).attr("fill", getAreaColor(d))
        })
  })
})

const zoom = d3.zoom().scaleExtent([0.2, 5]).on("zoom", () => {
  g.attr('transform', d3.event.transform)
  hideInfoCard()
})

d3.selectAll("button[data-zoom]")
  .on("click", zoomClick)

svg
  .call(zoom)
  .on("wheel.zoom", null)

function zoomClick () {
  svg.transition().call(zoom.scaleBy, Math.pow(2, +this.getAttribute("data-zoom")))
}

function getAreaColor(d) {
  const id = d.properties.ne_id || d.properties.NE_ID
  let num = 0
  if (csvMap[id]) {
    num = csvMap[id].confirmed
  }

  switch (true) {
    case num > 2999:
      return '#350000'
      break
    case num > 999:
      return '#600000'
      break
    case num > 499:
      return '#910000'
      break
    case num > 199:
      return '#d32f2f'
      break
    case num > 99:
      return '#f95050'
      break
    case num > 29:
      return '#ff7373'
      break
    case num > 0:
      return '#ffabab'
      break
    default:
      return '#9b9b9b'
  }
}

function hideInfoCard () {
  infoCard
    .style("display", "none")
}

function infoCardHtmlMaker (data) {
  return `
    <p class="title">${data.name_zh}</p>
    <p class="confirmed">確診 ${data.confirmed}</p>
    <p class="death">死亡 ${data.death}</p>
    <p class="note">${data.note}</p>
  `
}

function showInfoCard(d, data) {
  if (data) {
    infoCard
      .style("display", "block")
      .style("left", (d3.event.pageX) + 10 + 'px')
      .style("top", (d3.event.pageY) - 30 - $('#map').offset().top + 'px')
      .html(infoCardHtmlMaker(data))
  }
}
