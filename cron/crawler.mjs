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

    if (typeof mainData[`provinces${technologyKey}`] === 'undefined') {
      mainData[`provinces${technologyKey}`] = {
        operators: {},
        updateDate,
      }
    }

    const provinceOperators = mainData[`provinces${technologyKey}`].operators

    if (typeof provinceOperators[operatorNameKey] === 'undefined') {
      provinceOperators[operatorNameKey] = { total: 0, values: {} }
    }
    if (typeof provinceOperators[operatorNameKey].values[province] === 'undefined') {
      provinceOperators[operatorNameKey].values[province] = {
        province,
        date,
      }
      if (technologyKey === '3g') {
        provinceOperators[operatorNameKey].values[province].qty = { all: 0 }
        provinceOperators[operatorNameKey].values[province].brands = { all: {} }
      } else {
        provinceOperators[operatorNameKey].values[province].qty = { all: 0, 1800: 0, 2600: 0 }
        provinceOperators[operatorNameKey].values[province].brands = { all: {}, 1800: {}, 2600: {} }
      }
    }

    const currentProvince = provinceOperators[operatorNameKey].values[province]

    if (typeof mainData[`cities${technologyKey}`] === 'undefined') {
      mainData[`cities${technologyKey}`] = {
        operators: {},
        updateDate,
      }
    }

    const cityOperators = mainData[`cities${technologyKey}`].operators

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
      if (technologyKey === '3g') {
        cityOperators[operatorNameKey].values[cityKey].qty = { all: 0 }
        cityOperators[operatorNameKey].values[cityKey].brands = { all: {} }
      } else {
        cityOperators[operatorNameKey].values[cityKey].qty = { all: 0, 1800: 0, 2600: 0 }
        cityOperators[operatorNameKey].values[cityKey].brands = { all: {}, 1800: {}, 2600: {} }
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

export default async () => {
  try {
    console.log('\n\n Creating api folder...')
    await fs.mkdir(apiFolderPath)
  } catch (e) {
    console.log(' api folder exists. OK.')
  }

  let statistic
  try {
    statistic = await processUCRFStatistic()
  } catch (e) {
    console.log(e)
  }

  if (!statistic) return

  try {
    console.log(getProgress(), 'Saving JSONs...')
    await saveJson('3g-cities.json', statistic.cities3g)
    await saveJson('3g-provinces.json', statistic.provinces3g)
    await saveJson('4g-cities.json', statistic.cities4g)
    await saveJson('4g-provinces.json', statistic.provinces4g)
  } catch (e) {
    console.log(getProgress(), 'Unable to save file', e)
  }

  console.log(getProgress(), 'Crawler finished!')
}
