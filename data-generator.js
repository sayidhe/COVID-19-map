const fs = require('fs')
const csv = require('csv-parser')
const moment = require('moment')

const args = process.argv.slice(2)

// csv 数据缓存
const csvData = {}

// 读取 csv 并处理 & 写入 json
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (!Number(row.confirmed)) {
      return
    }

    const { type } = row
    if (csvData[type]) {
      csvData[type].push(row)
    } else {
      csvData[type] = [row]
    }
  })
  .on('end', () => {
    const calculatedData = {
      updateTime: '',
      chinaCount: {},
      worldCount: {},
      outsideChinaCount: {},
      china: {},
      world: {}
    }

    Object.keys(csvData).forEach(key => {
      calculatedData[key] = csvData[key].sort(sortArea)
    })

    // 写入更新时间
    calculatedData.updateTime = args[0] || moment().format('YYYY年M月D日HH時mm分')

    // 大陆数据统计
    calculatedData.chinaCount.confirmed = calculatedData.china
      .map(item => Number(item.confirmed))
      .reduce((acc, cur) => acc + cur)

    calculatedData.chinaCount.death = calculatedData.china
      .map(item => Number(item.death))
      .reduce((acc, cur) => acc + cur)

    // 大陆外数据统计
    calculatedData.outsideChinaCount.confirmed = calculatedData.world
      .map(item => Number(item.confirmed))
      .reduce((acc, cur) => acc + cur)

    calculatedData.outsideChinaCount.death = calculatedData.world
      .map(item => Number(item.death))
      .reduce((acc, cur) => acc + cur)

    // 全球数据统计
    calculatedData.worldCount.confirmed = calculatedData.chinaCount.confirmed + calculatedData.outsideChinaCount.confirmed
    calculatedData.worldCount.death = calculatedData.chinaCount.death + calculatedData.outsideChinaCount.death

    writeData(calculatedData).then((data) => {
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

