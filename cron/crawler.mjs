import path from 'path'
import axios from 'axios'
import fs from './libAsync/fs'

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
  if (/RBS 3206|RBS3418|RBS3518|RBS6102|RBS6201|RBS6301|RBS6302|RBS6000|RBS6601/i.test(modelName)) {
    return 'Ericsson'
  } else if (/Nokia|Flexi Multiradio/i.test(modelName)) {
    return 'Nokia'
  } else if (/BTS 3803|DBS 3800|BTS3812|BTS 3900|DBS\s?3900/i.test(modelName)) {
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
    console.log('UCRF 3G basestations Request Error')
    return null
  }
  if (!data || !data.length) {
    console.warn('No 3G data from UCRF')
    return null
  }
  const updateDate = new Date()
  const mainData = {
    provinces3g: {
      life: { total: 0, values: {} },
      triMob: { total: 0, values: {} },
      mts: { total: 0, values: {} },
      ks: { total: 0, values: {} },
      updateDate,
    },
    cities3g: {
      life: { total: 0, values: {} },
      triMob: { total: 0, values: {} },
      mts: { total: 0, values: {} },
      ks: { total: 0, values: {} },
      updateDate,
    },
  }
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

    if (typeof mainData.provinces3g[operatorNameKey].values[province] === 'undefined') {
      mainData.provinces3g[operatorNameKey].values[province] = { date, quantity: 0, brand: {} }
    }
    if (typeof mainData.cities3g[operatorNameKey].values[cityKey] === 'undefined') {
      mainData.cities3g[operatorNameKey].values[cityKey] = {
        city,
        province,
        date,
        quantity: 0,
        brand: {},
      }
    }
    mainData.provinces3g[operatorNameKey].total += 1
    mainData.cities3g[operatorNameKey].total += 1

    mainData.provinces3g[operatorNameKey].values[province].date = new Date(
      Math.max(mainData.provinces3g[operatorNameKey].values[province].date, date),
    )
    mainData.provinces3g[operatorNameKey].values[province].quantity += 1
    mainData.provinces3g[operatorNameKey].values[province].brand[equipmentBrand] = mainData
      .provinces3g[operatorNameKey].values[province].brand[equipmentBrand]
      ? mainData.provinces3g[operatorNameKey].values[province].brand[equipmentBrand] + 1
      : 1

    mainData.cities3g[operatorNameKey].values[cityKey].date = new Date(
      Math.max(mainData.cities3g[operatorNameKey].values[cityKey].date, date),
    )
    mainData.cities3g[operatorNameKey].values[cityKey].quantity += 1
    mainData.cities3g[operatorNameKey].values[cityKey].brand[equipmentBrand] = mainData.cities3g[
      operatorNameKey
    ].values[cityKey].brand[equipmentBrand]
      ? mainData.cities3g[operatorNameKey].values[cityKey].brand[equipmentBrand] + 1
      : 1
  })

  return mainData
}

export default async () => {
  const apiFolderPath = path.resolve('static', 'api')
  try {
    await fs.mkdir(apiFolderPath)
  } catch (e) {
    console.log('')
  }

  let statistic
  try {
    statistic = await getUCRFStatistic()
  } catch (e) {
    console.log(e)
  }

  try {
    await fs.writeFile(
      path.resolve(apiFolderPath, '3g-cities.json'),
      JSON.stringify(statistic.cities3g),
    )
    await fs.writeFile(
      path.resolve(apiFolderPath, '3g-provinces.json'),
      JSON.stringify(statistic.provinces3g),
    )
  } catch (e) {
    console.log('Enable to save file', e)
  }

  console.log('Crawler finished')
}
