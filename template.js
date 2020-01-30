const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const csvWriter = createCsvWriter({
  path: 'data.csv.example',
  header: [
    {id: 'id', title: 'id'},
    {id: 'type', title: 'type'},
    {id: 'name', title: 'name'},
    {id: 'name_zh', title: 'name_zh'},
    {id: 'name_zh_hk', title: 'name_zh_hk'},
    {id: 'confirmed', title: 'confirmed'},
    {id: 'death', title: 'death'},
    {id: 'note', title: 'note'}
  ]
})

const rawData = fs.readFileSync('./assets/json/output.json')
const data = JSON.parse(rawData)

const chinaData = data.objects.states_min.geometries.map(item => {
  // console.log(item)
  return {
    id: item.properties.ne_id,
    name: item.properties.name,
    type: 'china',
    name_zh: item.properties.name_zh,
    name_zh_hk: item.properties.name_zh,
    confirmed: '',
    death: '',
    note: ''
  }
})
const worldData = data.objects.countries_min.geometries.map(item => {
  // console.log(item)
  return {
    id: item.properties.NE_ID,
    name: item.properties.NAME,
    type: 'world',
    name_zh: item.properties.NAME_ZH,
    name_zh_hk: item.properties.NAME_ZH,
    confirmed: '',
    death: '',
    note: ''
  }
})
const csvData = [...chinaData, ...worldData]
// console.log(csvData)

csvWriter
  .writeRecords(csvData)
  .then(() => {
    console.log('The CSV file was written successfully')
  })
