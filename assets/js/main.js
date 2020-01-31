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

const infoCard = d3.select('#map').append('div')
  .attr('class', 'info-card')
  .style("display", "none")

const fetchMapData = d3.json("./assets/json/output.json")
// const fetchMapData = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json")
const fetchCsvData = d3.json("./assets/json/data.json")

Promise.all([fetchMapData, fetchCsvData]).then(([mapData, csvData]) => {
  const csvMap = {}
  Object.keys(csvData).forEach(key => {
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
        .attr("fill", function(d) {
          const id = d.properties.ne_id || d.properties.NE_ID
          if (csvMap[id]) {
            return getAreaColor(csvMap[id].confirmed)
          }
          return '#ccc'
        })
        .attr("class", object)
        .on("mouseover", function (d) {
          const id = d.properties.ne_id || d.properties.NE_ID
          showInfoCard(d, csvMap[id])
        })
        .on("mouseout", function (d) {
          hideInfoCard()
        })
  })
})

const zoom = d3.zoom().scaleExtent([0.8, 2]).on("zoom", () => {
  g.attr('transform', d3.event.transform)
  hideInfoCard()
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
  console.log(d);
  console.log(data)

  if (data) {
    infoCard
      .style("display", "block")
      .style("left", (d3.event.pageX) + 10 + 'px')
      .style("top", (d3.event.pageY) - 30 + 'px')
      .html(infoCardHtmlMaker(data))
  }
}
