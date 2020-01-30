const fs = require('fs')
const csv = require('csv-parser')

// csv 数据缓存
const csvData = []

// 读取 csv 并处理 & 写入 json
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    csvData.push(row)
  })
  .on('end', () => {
    const filteredData = csvData
      .filter(item => item.confirmed !== '')
      .sort(sortArea)
    writeData(filteredData).then((data) => {
      console.log(data)
      console.log('Data successfully generated!')
    })
  })

/**
 * 地区排序
 *
 * @param a 地区 a 数据
 * @param b 地区 b 数据
 * @returns {boolean}
 */
function sortArea(a, b) {
  return Number(b.confirmed) - Number(a.confirmed)
}

/**
 * 写入数据
 *
 * @param data
 * @returns {promise}
 */
function writeData (data) {
  return new Promise((resolve, reject) => {
    const fileData = JSON.stringify(data, null, 2)
    fs.writeFile('assets/json/data.json', fileData, 'utf8', error => {
      if (error) {
        reject(error)
        return
      }
      resolve(data)
    })
  })
}

