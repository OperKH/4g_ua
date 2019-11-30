// eslint-disable-next-line import/extensions, import/no-unresolved
import { Worker } from 'worker_threads'
import path from 'path'
import { promises as fs } from 'fs'
import {
  getOperatorByFreq,
  getTechnologyKey,
  getFreqKey,
  getEquipmentBrandByModelName,
  provinceCorrector,
  cityCorrector,
  // eslint-disable-next-line import/extensions
} from './helpers.mjs'

let prevStartDate = new Date()
const getProgress = () => {
  const currentDate = new Date()
  const result = currentDate - prevStartDate
  prevStartDate = currentDate
  return ` ${result}ms\n\n`
}

const getUCRFStatistic = workerData =>
  new Promise((resolve, reject) => {
    const worker = new Worker('./cron/getUCRFStatisticWorker.mjs', { workerData })
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    })
  })

const getMergedUCRFStatistic = async () => {
  console.log(getProgress(), 'Requesting UCRF Statistic...')
  const statistic = await Promise.all([
    getUCRFStatistic('UMTS'),
    getUCRFStatistic('LTE-1800'),
    getUCRFStatistic('LTE-2600'),
  ])
  return statistic.flat()
}
const processUCRFStatistic = async () => {
  const dateToday = new Date()
  const data = await getMergedUCRFStatistic()

  if (!data || !data.length) {
    console.warn(getProgress(), 'No Statistic from UCRF.')
    return null
  }
  const updateDate = new Date()
  const mainData = {}

  console.log(getProgress(), 'Parsing UCRF Statistic...')

  data.forEach(item => {
    const date = new Date(item[1])
    const dateEnd = new Date(item[2])
    const province = provinceCorrector(item[3])
    const city = cityCorrector(item[4], item[3])
    const equipmentModelName = item[5]
    const freq = item[7]
    const technology = item[9]

    const cityKey = `${city}_${province}`
    const operatorNameKey = getOperatorByFreq(freq)
    const equipmentBrand = getEquipmentBrandByModelName(equipmentModelName)
    const technologyKey = getTechnologyKey(technology)
    const freqKey = getFreqKey(freq)

    // Skip Item if it outdated
    if (dateEnd < dateToday) return

    // Skip Item if UCRF returns corrupted province
    // 'Київ' - the shortest province
    if (province.length < 4) return

    if (typeof mainData[`${technologyKey}-provinces`] === 'undefined') {
      mainData[`${technologyKey}-provinces`] = {
        operators: {},
        updateDate,
      }
    }

    const provinceOperators = mainData[`${technologyKey}-provinces`].operators

    if (typeof provinceOperators[operatorNameKey] === 'undefined') {
      provinceOperators[operatorNameKey] = { total: 0, values: {} }
    }
    if (typeof provinceOperators[operatorNameKey].values[province] === 'undefined') {
      provinceOperators[operatorNameKey].values[province] = {
        province,
        date,
      }
      if (technologyKey === '4g') {
        provinceOperators[operatorNameKey].values[province].qty = { all: 0, 1800: 0, 2600: 0 }
        provinceOperators[operatorNameKey].values[province].brands = { all: {}, 1800: {}, 2600: {} }
      } else {
        provinceOperators[operatorNameKey].values[province].qty = { all: 0 }
        provinceOperators[operatorNameKey].values[province].brands = { all: {} }
      }
    }

    const currentProvince = provinceOperators[operatorNameKey].values[province]

    if (typeof mainData[`${technologyKey}-cities`] === 'undefined') {
      mainData[`${technologyKey}-cities`] = {
        operators: {},
        updateDate,
      }
    }

    const cityOperators = mainData[`${technologyKey}-cities`].operators

    if (typeof cityOperators[operatorNameKey] === 'undefined') {
      cityOperators[operatorNameKey] = { total: 0, values: {} }
    }
    if (typeof cityOperators[operatorNameKey].values[cityKey] === 'undefined') {
      cityOperators[operatorNameKey].values[cityKey] = {
        city,
        province,
        date,
        brands: {},
      }
      if (technologyKey === '4g') {
        cityOperators[operatorNameKey].values[cityKey].qty = { all: 0, 1800: 0, 2600: 0 }
        cityOperators[operatorNameKey].values[cityKey].brands = { all: {}, 1800: {}, 2600: {} }
      } else {
        cityOperators[operatorNameKey].values[cityKey].qty = { all: 0 }
        cityOperators[operatorNameKey].values[cityKey].brands = { all: {} }
      }
    }

    const currentCity = cityOperators[operatorNameKey].values[cityKey]

    provinceOperators[operatorNameKey].total += 1
    cityOperators[operatorNameKey].total += 1

    currentProvince.date = new Date(Math.max(currentProvince.date, date))
    currentProvince.qty.all += 1
    currentProvince.brands.all[equipmentBrand] = currentProvince.brands.all[equipmentBrand]
      ? currentProvince.brands.all[equipmentBrand] + 1
      : 1
    if (technologyKey === '4g') {
      currentProvince.qty[freqKey] += 1
      currentProvince.brands[freqKey][equipmentBrand] = currentProvince.brands[freqKey][equipmentBrand]
        ? currentProvince.brands[freqKey][equipmentBrand] + 1
        : 1
    }

    currentCity.date = new Date(Math.max(currentCity.date, date))
    currentCity.qty.all += 1
    currentCity.brands.all[equipmentBrand] = currentCity.brands.all[equipmentBrand]
      ? currentCity.brands.all[equipmentBrand] + 1
      : 1
    if (technologyKey === '4g') {
      currentCity.qty[freqKey] += 1
      currentCity.brands[freqKey][equipmentBrand] = currentCity.brands[freqKey][equipmentBrand]
        ? currentCity.brands[freqKey][equipmentBrand] + 1
        : 1
    }
  })

  console.log(getProgress(), 'Transforming UCRF Statistic for frontend...')

  Object.values(mainData).forEach(type => {
    Object.values(type.operators).forEach(operator => {
      const values = Object.values(operator.values)
        .map(value => ({
          ...value,
          brands: Object.keys(value.brands).reduce(
            (acc, freq) => ({
              ...acc,
              [freq]: Object.keys(value.brands[freq])
                .sort((a, b) => a.localeCompare(b))
                .map(name => `${name}(${value.brands[freq][name]})`)
                .join(', '),
            }),
            {},
          ),
        }))
        .sort((a, b) => a.province.localeCompare(b.province))
      if ('city' in values[0]) {
        values.sort((a, b) => a.city.localeCompare(b.city))
      }
      // eslint-disable-next-line no-param-reassign
      operator.values = values
    })
  })

  return mainData
}

const apiFolderPath = path.resolve('static', 'api')
const oldApiFolderPath = path.resolve(apiFolderPath, 'old')

const createFolders = async () => {
  try {
    console.log('\n\n Creating api folder...')
    await fs.mkdir(apiFolderPath)
  } catch (e) {
    console.log(' api folder exists. OK.')
  }
  try {
    console.log(' Creating api/old folder...')
    await fs.mkdir(oldApiFolderPath)
  } catch (e) {
    console.log(' api/old folder exists. OK.')
  }
}

const movePrevApiFiles = async () => {
  console.log(getProgress(), 'Moving API files...')
  const files = await fs.readdir(apiFolderPath, 'utf-8')
  const jsons = files.filter(fileName => /\.json$/.test(fileName))
  await Promise.all(
    jsons.map(fileName => {
      const currentPath = path.resolve(apiFolderPath, fileName)
      const newPath = path.resolve(oldApiFolderPath, fileName)
      return fs.rename(currentPath, newPath)
    }),
  )
}

const getOldStatistic = async () => {
  const files = await fs.readdir(oldApiFolderPath, 'utf-8')
  const jsons = files.filter(fileName => /\.json$/.test(fileName))
  const statistics = await Promise.all(
    jsons.map(async fileName => {
      const filePath = path.resolve(oldApiFolderPath, fileName)
      const json = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(json)
    }),
  )

  const oldStatistic = jsons.reduce((acc, fileName, index) => {
    const key = fileName.slice(0, -5)
    acc[key] = statistics[index]
    return acc
  }, {})
  return oldStatistic
}

const addDiff = async newStatistic => {
  const diffQtyKey = 'diffQty'
  try {
    console.log(getProgress(), 'Reading old Statistic...')
    const oldStatistic = await getOldStatistic()
    console.log(getProgress(), 'Calculating diff...')
    Object.keys(newStatistic).forEach(key => {
      if (!oldStatistic[key] || !oldStatistic[key].operators) return
      const newOperators = newStatistic[key].operators
      const oldOperators = oldStatistic[key].operators
      Object.keys(newOperators).forEach(operatorKey => {
        const newOperator = newOperators[operatorKey]
        const oldOperator = oldOperators[operatorKey]
        const diffTotal = newOperator.total - oldOperator.total
        newOperator.diffTotal = diffTotal || oldOperator.diffTotal
        newOperator.diffDate = diffTotal ? oldStatistic[key].updateDate : oldOperator.diffDate || oldStatistic[key].updateDate
        newOperator.values.forEach(newValue => {
          const isCity = 'city' in newValue
          const oldValue = oldOperator.values.find(value =>
            isCity
              ? value.city === newValue.city && value.province === newValue.province
              : value.province === newValue.province,
          )
          // Check if operator has no changes then copy old changes
          if (diffTotal === 0) {
            // eslint-disable-next-line no-param-reassign
            newValue[diffQtyKey] = oldValue[diffQtyKey]
            return
          }
          Object.keys(newValue.qty).forEach(qtyKey => {
            const newQty = newValue.qty[qtyKey]
            const oldQty = (oldValue && oldValue.qty && oldValue.qty[qtyKey]) || 0
            if (!(diffQtyKey in newValue)) {
              // eslint-disable-next-line no-param-reassign
              newValue[diffQtyKey] = {}
            }
            // eslint-disable-next-line no-param-reassign
            newValue[diffQtyKey][qtyKey] = newQty - oldQty
          })
        })
      })
    })
  } catch (e) {
    console.log(e)
  }
}

const saveJson = async (jsonFileName, data) => {
  const jsonPath = path.resolve(apiFolderPath, jsonFileName)
  if (data) {
    await fs.writeFile(jsonPath, JSON.stringify(data), 'utf8')
  } else {
    try {
      await fs.access(jsonPath)
      console.log(` No Data. File "${jsonFileName}" exists, no rewrite.`)
    } catch (e) {
      await fs.writeFile(jsonPath, null)
      console.log(` No Data. File "${jsonFileName}" doesn't exists, created empty.`)
    }
  }
}

const saveJsonFiles = async statistic => {
  try {
    console.log(getProgress(), 'Saving JSONs...')
    await Promise.all(Object.keys(statistic).map(key => saveJson(`${key}.json`, statistic[key])))
  } catch (e) {
    console.log(getProgress(), 'Unable to save file', e)
  }
}

export default async () => {
  try {
    await createFolders()
    const statistic = await processUCRFStatistic()
    if (!statistic) return
    await movePrevApiFiles()
    await addDiff(statistic)
    await saveJsonFiles(statistic)
  } catch (e) {
    console.log(e)
  }

  console.log(getProgress(), 'Crawler finished!')
}
