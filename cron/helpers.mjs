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
    case 'GSM-900':
    case 'GSM-1800':
      return '2g'
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

const provincesList = [
  'АР Крим',
  'Вінницька',
  'Волинська',
  'Дніпропетровська',
  'Донецька',
  'Житомирська',
  'Закарпатська',
  'Запорізька',
  'Івано-Франківська',
  'Київ',
  'Київська',
  'Кіровоградська',
  'Луганська',
  'Львівська',
  'Миколаївська',
  'Одеська',
  'Полтавська',
  'Рівненська',
  'Сумська',
  'Тернопільська',
  'Харківська',
  'Херсонська',
  'Хмельницька',
  'Черкаська',
  'Чернівецька',
  'Чернігівська',
]

const corruptedSymbol = '??'

export const provinceCorrector = province => {
  const corruptedIndex = province.indexOf(corruptedSymbol)
  if (corruptedIndex === -1) return province
  const corruptedProvincesList = provincesList.map(p => `${p.slice(0, corruptedIndex)}??${p.slice(corruptedIndex + 1)}`)
  const provinceIndex = corruptedProvincesList.indexOf(province)
  return provinceIndex === -1 ? province : provincesList[provinceIndex]
}

export const cityCorrector = (city, province) => {
  switch (city) {
    case 'А??ушта':
      return 'Алушта'
    case 'Б??лики':
      return 'Білики'
    case 'Бал??вне':
      return 'Баловне'
    case 'Ба??вінок':
      return 'Барвінок'
    case 'Бі??а Церква':
      return 'Біла Церква'
    case 'Боров??':
      return province === 'Рівненська' ? 'Борове' : 'Борова'
    case 'Борщі??':
      return 'Борщів'
    case '??ровари':
      return 'Бровари'
    case 'Бр??силів':
      return 'Брусилів'
    case 'Ве??ика Северинка':
      return 'Велика Северинка'
    case 'Великосілк??':
      return 'Великосілки'
    case 'Він??иця':
      return 'Вінниця'
    case 'Волод??мир-Волинський':
      return 'Володимир-Волинський'
    case 'Воскрес??нське':
      return 'Воскресенське'
    case 'Г??ушово':
      return 'Грушово'
    case 'Гу??яйполе':
      return 'Гуляйполе'
    case '??ніпро':
    case 'Д??іпро':
    case 'Дн??про':
    case 'Дні??ро':
    case 'Дніпр??':
      return 'Дніпро'
    case 'До??ецьк':
      return 'Донецьк'
    case '??олинівка':
      return 'Долинівка'
    case 'Д??лятин':
      return 'Делятин'
    case 'Дубровиц??':
      return 'Дубровиця'
    case 'З??іїв':
      return 'Зміїв'
    case 'З??лізний Порт':
      return 'Залізний Порт'
    case 'Запор??жжя':
      return 'Запоріжжя'
    case 'І??анівка':
    case 'Іван??вка':
    case 'Іванівк??':
      return 'Іванівка'
    case 'Іллін??і':
    case 'Іллінц??':
      return 'Іллінці'
    case 'Іллічівсь??':
      return 'Іллічівськ'
    case 'Ірп??нь':
      return 'Ірпінь'
    case "К??м'яне":
      return "Кам'яне"
    case "Кам'янець-Поділ??ський":
      return "Кам'янець-Подільський"
    case 'Ки??в':
      return 'Київ'
    case 'Кіц??ань':
      return 'Кіцмань'
    case 'Конопн??ця':
      return 'Конопниця'
    case 'Кос??янтинівка':
    case 'Костянт??нівка':
      return 'Костянтинівка'
    case '??ривий Ріг':
    case 'К??ивий Ріг':
    case 'Криви?? Ріг':
    case 'Кривий Рі??':
      return 'Кривий Ріг'
    case 'Кропив??ицький':
      return 'Кропивницький'
    case 'Лісов?? Гринівці':
      return 'Лісові Гринівці'
    case 'Лі??ки':
      return 'Літки'
    case 'Лу??ьк':
      return 'Луцьк'
    case 'Л??вів':
    case 'Ль??ів':
    case 'Льв??в':
      return 'Львів'
    case 'М??ріуполь':
    case 'Марі??поль':
    case 'Маріуп??ль':
      return 'Маріуполь'
    case 'Межирі??ка':
      return 'Межирічка'
    case 'Мико??аїв':
      return 'Миколаїв'
    case 'М??ргород':
      return 'Миргород'
    case 'Н??жин':
      return 'Ніжин'
    case 'Оршанец??':
      return 'Оршанець'
    case 'О??еса':
    case 'Од??са':
      return 'Одеса'
    case 'Олександр??вка':
      return 'Олександрівка'
    case 'Переход??':
      return 'Переходи'
    case 'Підг??йці':
      return 'Підгайці'
    case 'Пі??аний Брід':
      return 'Піщаний Брід'
    case '??олтава':
    case 'Полт??ва':
      return 'Полтава'
    case 'Поча??в':
      return 'Почаїв'
    case 'При??ипче':
      return 'Прилипче'
    case 'Рожня??ів':
    case 'Рожняті??':
      return 'Рожнятів'
    case 'Рок??тне':
      return 'Рокитне'
    case 'Ружи??':
      return 'Ружин'
    case 'Свято??етрівське':
      return 'Святопетрівське'
    case 'С??вєродонецьк':
      return 'Сєвєродонецьк'
    case "??лов'янськ":
      return "Слов'янськ"
    case 'С??фіївська Борщагівка':
      return 'Софіївська Борщагівка'
    case 'Старос??лля':
      return 'Старосілля'
    case 'Стар??й Олексинець':
      return 'Старий Олексинець'
    case 'Сторожин??ць':
      return 'Сторожинець'
    case 'Стр??мівка':
      return 'Струмівка'
    case 'Су??и':
    case '??уми':
      return 'Суми'
    case 'Теребо??ля':
      return 'Теребовля'
    case 'Т??полі':
      return 'Тополі'
    case 'Ужг??род':
      return 'Ужгород'
    case '??арків':
    case 'Ха??ків':
      return 'Харків'
    case 'Херсо??':
      return 'Херсон'
    case 'Х??ельницький':
    case 'Хмельни??ький':
      return 'Хмельницький'
    case 'Х??рол':
      return 'Хорол'
    case 'Цюрупинс??к':
      return 'Цюрупинськ'
    case 'Цуман??':
      return 'Цумань'
    case '??еркаси':
    case 'Черкас??':
      return 'Черкаси'
    case 'Чернів??і':
      return 'Чернівці'
    case 'Черн??гів':
      return 'Чернігів'
    case '??асливцеве':
      return 'Щасливцеве'
    case '??жне':
      return 'Южне'
    default:
      return city
  }
}
