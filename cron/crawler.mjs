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
  if (/1922|1927|1932/i.test(freq)) {
    return 'life'
  } else if (/1937|1942|1947/i.test(freq)) {
    return 'triMob'
  } else if (/1952|1957|1962/i.test(freq)) {
    return 'mts'
  } else if (/1967|1972|1977/i.test(freq)) {
    return 'ks'
  }
  return 'unknown'
}
const getEquipmentBrandByModelName = modelName => {
  if (/RBS2116|RBS 3206|RBS3418|RBS3518|RBS6000|RBS6101|RBS6102|RBS6201|RBS6301|RBS6302|RBS6601/i.test(modelName)) {
    return 'Ericsson'
  } else if (/Nokia|Flexi Multiradio/i.test(modelName)) {
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

const getUCRFStatistic = async () => {
  let data
  try {
    console.log(getProgress(), 'Requesting UCRF Statistic...')

    const res = await axios.get('http://www.ucrf.gov.ua/wp-admin/admin-ajax.php', {
      params: {
        action: 'get_wdtable',
        table_id: 1,
        sEcho: 1,
        sSearch_0: 'БС2100',
        bSearchable_0: true,
      },
    })
    data = res.data.aaData
  } catch (e) {
    console.log(getProgress(), 'UCRF 3G Statistic Request Error')
    return null
  }
  if (!data || !data.length) {
    console.warn(getProgress(), 'No 3G Statistic from UCRF')
    return null
  }
  const updateDate = new Date()
  const mainData = {
    provinces3g: {
      operators: {
        life: { total: 0, values: {} },
        triMob: { total: 0, values: {} },
        mts: { total: 0, values: {} },
        ks: { total: 0, values: {} },
      },
      updateDate,
    },
    cities3g: {
      operators: {
        life: { total: 0, values: {} },
        triMob: { total: 0, values: {} },
        mts: { total: 0, values: {} },
        ks: { total: 0, values: {} },
      },
      updateDate,
    },
  }

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

    const cityKey = `${city}_${province}`
    const operatorNameKey = getOperatorByFreq(freq)
    const equipmentBrand = getEquipmentBrandByModelName(equipmentModelName)

    if (typeof mainData.provinces3g.operators[operatorNameKey].values[province] === 'undefined') {
      mainData.provinces3g.operators[operatorNameKey].values[province] = { province, date, quantity: 0, brands: {} }
    }
    if (typeof mainData.cities3g.operators[operatorNameKey].values[cityKey] === 'undefined') {
      mainData.cities3g.operators[operatorNameKey].values[cityKey] = {
        city,
        province,
        date,
        quantity: 0,
        brands: {},
      }
    }
    mainData.provinces3g.operators[operatorNameKey].total += 1
    mainData.cities3g.operators[operatorNameKey].total += 1

    mainData.provinces3g.operators[operatorNameKey].values[province].date = new Date(
      Math.max(mainData.provinces3g.operators[operatorNameKey].values[province].date, date),
    )
    mainData.provinces3g.operators[operatorNameKey].values[province].quantity += 1
    mainData.provinces3g.operators[operatorNameKey].values[province].brands[equipmentBrand] = mainData.provinces3g
      .operators[operatorNameKey].values[province].brands[equipmentBrand]
      ? mainData.provinces3g.operators[operatorNameKey].values[province].brands[equipmentBrand] + 1
      : 1

    mainData.cities3g.operators[operatorNameKey].values[cityKey].date = new Date(
      Math.max(mainData.cities3g.operators[operatorNameKey].values[cityKey].date, date),
    )
    mainData.cities3g.operators[operatorNameKey].values[cityKey].quantity += 1
    mainData.cities3g.operators[operatorNameKey].values[cityKey].brands[equipmentBrand] = mainData.cities3g.operators[
      operatorNameKey
    ].values[cityKey].brands[equipmentBrand]
      ? mainData.cities3g.operators[operatorNameKey].values[cityKey].brands[equipmentBrand] + 1
      : 1
  })

  console.log(getProgress(), 'Transforming UCRF Statistic for frontend...')

  Object.values(mainData).forEach(type => {
    Object.values(type.operators).forEach(operator => {
      // eslint-disable-next-line no-param-reassign
      operator.values = Object.values(operator.values).map((value, valueIndex) => ({
        ...value,
        id: valueIndex + 1,
        brands: Object.keys(value.brands).map((name, brandIndex) => ({
          name,
          id: brandIndex + 1,
          quantity: value.brands[name],
        })),
      }))
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
    statistic = await getUCRFStatistic()
  } catch (e) {
    console.log(e)
  }

  try {
    console.log(getProgress(), 'Saving JSONs...')
    await fs.writeFile(path.resolve(apiFolderPath, '3g-cities.json'), JSON.stringify(statistic.cities3g))
    await fs.writeFile(path.resolve(apiFolderPath, '3g-provinces.json'), JSON.stringify(statistic.provinces3g))
  } catch (e) {
    console.log(getProgress(), 'Unable to save file', e)
  }

  console.log(getProgress(), 'Crawler finished!')
}
