const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const csvWriter = createCsvWriter({
  path: 'data.csv.example',
  header: [
    {id: 'id', title: 'Id'},
    {id: 'name', title: 'Name'},
    {id: 'name_zh', title: 'Chinese Name'},
    {id: 'confirmed', title: 'Confirmed'},
    {id: 'death', title: 'Death'}
  ]
})

const rawData = fs.readFileSync('./assets/json/output.json')
const data = JSON.parse(rawData)

const chinaData = data.objects.states_min.geometries.map(item => {
  // console.log(item)
  return {
    id: item.properties.ne_id,
    name: item.properties.name,
    name_zh: item.properties.name_zh,
    confirmed: '',
    death: ''
  }
})
const worldData = data.objects.countries_min.geometries.map(item => {
  // console.log(item)
  return {
    id: item.properties.NE_ID,
    name: item.properties.NAME,
    name_zh: item.properties.NAME_ZH,
    confirmed: '',
    death: ''
  }
})
const csvData = [...chinaData, ...worldData]
// console.log(csvData)

csvWriter
  .writeRecords(csvData)
  .then(() => {
    console.log('The CSV file was written successfully')
  })