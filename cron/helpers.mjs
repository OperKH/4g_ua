export const getOperatorByFreq = freq => {
  if (/-1750|1967|1972|1977|-\s?2535/i.test(freq)) {
    return 'ks'
  }
  if (/-1770|1952|1957|1962|-2520/i.test(freq)) {
    return 'mts'
  }
  if (/-1725|1922|1927|1932|-2545/i.test(freq)) {
    return 'life'
  }
  if (/1937|1942|1947/i.test(freq)) {
    return 'triMob'
  }
  return 'unknown'
}

export const getFreqKey = freq => {
  if (/-1725|-1770|-1750/i.test(freq)) {
    return 1800
  }
  if (/-2520|-\s?2535|-2545/i.test(freq)) {
    return 2600
  }
  if (/1922|1927|1932|1937|1942|1947|1952|1957|1962|1967|1972|1977/i.test(freq)) {
    return 2100
  }
  return 'unknown'
}

export const getTechnologyKey = technology => {
  switch (technology) {
    case 'UMTS':
      return '3g'
    case 'LTE-1800':
    case 'LTE-2600':
      return '4g'
    default:
      return 'unknown'
  }
}

export const getEquipmentBrandByModelName = modelName => {
  if (
    /RBS2116|RADIO 2219|RBS 3206|RBS3418|RBS3518|Radio 4415|RBS6000|RBS6101|RBS\s?6102|RBS\s?6201|RBS6301|RBS6302|RBS6501|RBS6601/i.test(
      modelName,
    )
  ) {
    return 'Ericsson'
  }
  if (/Nokia|Flexi Multiradio|BTS Optima|BTS Supreme/i.test(modelName)) {
    return 'Nokia'
  }
  if (/BTS 3803|BTS3812|BTS\s?3900|DBS 3800|DTS 3803C|DBS\s?3900/i.test(modelName)) {
    return 'Huawei'
  }
  if (/ZXSDR BS8700/i.test(modelName)) {
    return 'ZTE'
  }
  if (/MobileAccess GX/i.test(modelName)) {
    return 'Corning'
  }
  return modelName
}

const operatorsDic = {
  ks: 'Київстар',
  mts: 'Vodafone',
  life: 'lifecell',
  triMob: '3Mob',
}
const addSign = n => {
  if (n > 0) return `+${n}`
  return String(n)
}
const formatNotificationDigit = n => addSign(n).padStart(4)
const formatOperatorKey = operatorKey => `${operatorsDic[operatorKey] || ''}:`.padEnd(9)

export const getNotification = diff => {
  const title = 'Нові Базові Станції'
  const body = Object.entries(diff)
    .sort(([technologyA], [technologyB]) => technologyB.localeCompare(technologyA))
    .reduce((acc, [technology, operators]) => {
      const tech = `${acc}${technology.toUpperCase()}  `
      const q = Object.entries(operators)
        .sort(([operatorKeyA], [operatorKeyB]) => {
          if (operatorKeyA === 'triMob') return 1
          if (operatorKeyB === 'triMob') return -1
          return operatorKeyA.localeCompare(operatorKeyB)
        })
        .reduce((opAcc, [operatorKey, qty]) => {
          return `${opAcc} ${formatOperatorKey(operatorKey)} ${formatNotificationDigit(qty)};`
        }, '')
      return `${tech}${q}\n`
    }, '')
  return { title, body }
}
