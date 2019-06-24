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

export const getEquipmentBrandByModelName = modelName => {
  if (
    /RBS2116|RBS 3206|RBS3418|RBS3518|Radio 4415|RBS6000|RBS6101|RBS\s?6102|RBS\s?6201|RBS6301|RBS6302|RBS6601/i.test(
      modelName,
    )
  ) {
    return 'Ericsson'
  }
  if (/Nokia|Flexi Multiradio|BTS Optima|BTS Supreme/i.test(modelName)) {
    return 'Nokia'
  }
  if (/BTS 3803|BTS3812|BTS 3900|DBS 3800|DTS 3803C|DBS\s?3900/i.test(modelName)) {
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

export const provinceCorrector = province => {
  switch (province) {
    case '??Р Крим':
      return 'АР Крим'
    case 'Вінниц??ка':
      return 'Вінницька'
    case '??ніпропетровська':
    case 'Дн??пропетровська':
    case 'Дні??ропетровська':
    case 'Дніпроп??тровська':
    case 'Дніпропе??ровська':
    case 'Дніпропетр??вська':
    case 'Дніпропетров??ька':
    case 'Дніпропетровсь??а':
    case 'Дніпропетровськ??':
      return 'Дніпропетровська'
    case 'Дон??цька':
    case 'Доне??ька':
      return 'Донецька'
    case '??итомирська':
    case 'Жито??ирська':
      return 'Житомирська'
    case 'Закарпа??ська':
      return 'Закарпатська'
    case 'Зап??різька':
    case 'Запоріз??ка':
      return 'Запорізька'
    case 'Київсь??а':
      return 'Київська'
    case 'Кіровогр??дська':
    case 'Кіровогра??ська':
    case 'Кіровоградськ??':
      return 'Кіровоградська'
    case 'Льві??ська':
      return 'Львівська'
    case 'Миколаїв??ька':
      return 'Миколаївська'
    case 'О??еська':
      return 'Одеська'
    case 'Полт??вська':
      return 'Полтавська'
    case 'Рі??ненська':
    case 'Р??вненська':
    case 'Рівненськ??':
      return 'Рівненська'
    case 'Тернопі??ьська':
    case 'Тернопільськ??':
      return 'Тернопільська'
    case '??арківська':
    case 'Хар??івська':
    case 'Харкі??ська':
    case 'Харківськ??':
      return 'Харківська'
    case 'Херс??нська':
    case 'Херсон??ька':
      return 'Херсонська'
    case '??мельницька':
    case 'Хме??ьницька':
    case 'Хмель??ицька':
      return 'Хмельницька'
    case 'Ч??рнівецька':
      return 'Чернівецька'
    case 'Чернігі??ська':
      return 'Чернігівська'
    default:
      return province
  }
}

export const cityCorrector = city => {
  switch (city) {
    case 'Б??лики':
      return 'Білики'
    case 'Бал??вне':
      return 'Баловне'
    case 'Борщі??':
      return 'Борщів'
    case 'Бр??силів':
      return 'Брусилів'
    case 'Воскрес??нське':
      return 'Воскресенське'
    case '??ніпро':
      return 'Дніпро'
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
    case 'Іллінц??':
      return 'Іллінці'
    case 'Ки??в':
      return 'Київ'
    case 'Кіц??ань':
      return 'Кіцмань'
    case 'Конопн??ця':
      return 'Конопниця'
    case 'Кос??янтинівка':
      return 'Костянтинівка'
    case '??ривий Ріг':
    case 'Криви?? Ріг':
      return 'Кривий Ріг'
    case 'Кропив??ицький':
      return 'Кропивницький'
    case 'Лісов?? Гринівці':
      return 'Лісові Гринівці'
    case 'Лу??ьк':
      return 'Луцьк'
    case 'Ль??ів':
    case 'Льв??в':
      return 'Львів'
    case 'М??ріуполь':
    case 'Марі??поль':
    case 'Маріуп??ль':
      return 'Маріуполь'
    case 'Мико??аїв':
      return 'Миколаїв'
    case 'О??еса':
    case 'Од??са':
      return 'Одеса'
    case 'Підг??йці':
      return 'Підгайці'
    case 'Рожняті??':
      return 'Рожнятів'
    case 'Рок??тне':
      return 'Рокитне'
    case 'Стар??й Олексинець':
      return 'Старий Олексинець'
    case 'Стр??мівка':
      return 'Струмівка'
    case 'Х??рол':
      return 'Хорол'
    case 'Цуман??':
      return 'Цумань'
    case 'Чернів??і':
      return 'Чернівці'
    case "К??м'яне":
      return "Кам'яне"
    case "Кам'янець-Поділ??ський":
      return "Кам'янець-Подільський"
    case '??жне':
      return 'Южне'
    default:
      return city
  }
}
