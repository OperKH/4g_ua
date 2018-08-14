import path from 'path'
import axios from 'axios'
import fs from './libAsync/fs'

let prevStartDate = new Date()
const getProgress = () => {
  const currentDate = new Date()
  const result = currentDate - prevStartDate
  prevStartDate = currentDate
  return ` ${result}ms\n\n`
}

const getOperatorByFreq = freq => {
  if (/-1750|1967|1972|1977|-\s?2535/i.test(freq)) {
    return 'ks'
  } else if (/-1770|1952|1957|1962|-2520/i.test(freq)) {
    return 'mts'
  } else if (/-1725|1922|1927|1932|-2545/i.test(freq)) {
    return 'life'
  } else if (/1937|1942|1947/i.test(freq)) {
    return 'triMob'
  }
  return 'unknown'
}
const getFreqKey = freq => {
  if (/-1725|-1770|-1750/i.test(freq)) {
    return 1800
  } else if (/-2520|-\s?2535|-2545/i.test(freq)) {
    return 2600
  } else if (/1922|1927|1932|1937|1942|1947|1952|1957|1962|1967|1972|1977/i.test(freq)) {
    return 2100
  }
  return 'unknown'
}
const getEquipmentBrandByModelName = modelName => {
  if (
    /RBS2116|RBS 3206|RBS3418|RBS3518|Radio 4415|RBS6000|RBS6101|RBS\s?6102|RBS\s?6201|RBS6301|RBS6302|RBS6601/i.test(
      modelName,
    )
  ) {
    return 'Ericsson'
  } else if (/Nokia|Flexi Multiradio|BTS Optima|BTS Supreme/i.test(modelName)) {
    return 'Nokia'
  } else if (/BTS 3803|BTS3812|BTS 3900|DBS 3800|DTS 3803C|DBS\s?3900/i.test(modelName)) {
    return 'Huawei'
  } else if (/ZXSDR BS8700/i.test(modelName)) {
    return 'ZTE'
  } else if (/MobileAccess GX/i.test(modelName)) {
    return 'Corning'
  }
  return modelName
}

const getUCRFStatistic = async techology => {
  try {
    const res = await axios.get('http://www.ucrf.gov.ua/wp-admin/admin-ajax.php', {
      params: {
        action: 'get_wdtable',
        table_id: 1,
        sEcho: 1,
        sSearch_9: techology,
        bSearchable_9: true,
      },
    })
    return res.data.aaData
  } catch (e) {
    console.log(`UCRF ${techology} Statistic Request Error.`)
    return []
  }
}
const getMergedUCRFStatistic = async () => {
  console.log(getProgress(), 'Requesting UCRF Statistic...')
  const statistic = await Promise.all([
    getUCRFStatistic('UMTS'),
    getUCRFStatistic('LTE-1800'),
    getUCRFStatistic('LTE-2600'),
  ])
  return [].concat(...statistic)
}
const processUCRFStatistic = async () => {
  const data = await getMergedUCRFStatistic()

  if (!data || !data.length) {
    console.warn(getProgress(), 'No Statistic from UCRF.')
    return null
  }
  const updateDate = new Date()
  const mainData = {}

  console.log(getProgress(), 'Parsing UCRF Statistic...')

  data.forEach(item => {
    const date = new Date(
      item[1]
        .split('/')
        .reverse()
        .join('/'),
    )
    const province = item[3]
    const city = item[4]
    const equipmentModelName = item[5]
    const freq = item[7]
    const technology = item[9]

    const cityKey = `${city}_${province}`
    const operatorNameKey = getOperatorByFreq(freq)
    const equipmentBrand = getEquipmentBrandByModelName(equipmentModelName)
    const technologyKey = technology === 'UMTS' ? '3g' : '4g'
    const freqKey = getFreqKey(freq)

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

export default async () => {
  const apiFolderPath = path.resolve('static', 'api')
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

  try {
    console.log(getProgress(), 'Saving JSONs...')
    await fs.writeFile(path.resolve(apiFolderPath, '3g-cities.json'), JSON.stringify(statistic.cities3g || null))
    await fs.writeFile(path.resolve(apiFolderPath, '3g-provinces.json'), JSON.stringify(statistic.provinces3g || null))
    await fs.writeFile(path.resolve(apiFolderPath, '4g-cities.json'), JSON.stringify(statistic.cities4g || null))
    await fs.writeFile(path.resolve(apiFolderPath, '4g-provinces.json'), JSON.stringify(statistic.provinces4g || null))
  } catch (e) {
    console.log(getProgress(), 'Unable to save file', e)
  }

  console.log(getProgress(), 'Crawler finished!')
}
