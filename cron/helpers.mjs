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
    case 'Вінни??ька':
    case 'Вінниц??ка':
    case 'Вінницьк??':
      return 'Вінницька'
    case '??ніпропетровська':
    case 'Дн??пропетровська':
    case 'Дні??ропетровська':
    case 'Дніп??опетровська':
    case 'Дніпроп??тровська':
    case 'Дніпропе??ровська':
    case 'Дніпропетр??вська':
    case 'Дніпропетров??ька':
    case 'Дніпропетровсь??а':
    case 'Дніпропетровськ??':
      return 'Дніпропетровська'
    case 'Дон??цька':
    case 'Доне??ька':
    case 'Донець??а':
      return 'Донецька'
    case '??итомирська':
    case 'Ж??томирська':
    case 'Жито??ирська':
      return 'Житомирська'
    case 'За??арпатська':
    case 'Закарпа??ська':
    case 'Закарпатс??ка':
      return 'Закарпатська'
    case 'Зап??різька':
    case 'Запоріз??ка':
    case 'Запорізьк??':
      return 'Запорізька'
    case 'Івано-Франкі??ська':
      return 'Івано-Франківська'
    case '??иїв':
    case 'Киї??':
      return 'Київ'
    case 'К??ївська':
    case 'Київсь??а':
      return 'Київська'
    case 'Кіров??градська':
    case 'Кіровогр??дська':
    case 'Кіровогра??ська':
    case 'Кіровоградськ??':
      return 'Кіровоградська'
    case 'Луг??нська':
      return 'Луганська'
    case 'Льві??ська':
    case 'Львівськ??':
      return 'Львівська'
    case '??иколаївська':
    case 'Миколаї??ська':
    case 'Миколаїв??ька':
    case 'Миколаївс??ка':
      return 'Миколаївська'
    case '??деська':
    case 'О??еська':
      return 'Одеська'
    case 'Пол??авська':
    case 'Полт??вська':
    case 'Полтав??ька':
      return 'Полтавська'
    case 'Рі??ненська':
    case 'Р??вненська':
    case 'Рівнен??ька':
    case 'Рівненсь??а':
    case 'Рівненськ??':
      return 'Рівненська'
    case 'Сумсь??а':
      return 'Сумська'
    case 'Тернопі??ьська':
    case 'Тернопільськ??':
      return 'Тернопільська'
    case '??арківська':
    case 'Хар??івська':
    case 'Харк??вська':
    case 'Харкі??ська':
    case 'Харківсь??а':
    case 'Харківськ??':
      return 'Харківська'
    case 'Хе??сонська':
    case 'Хер??онська':
    case 'Херс??нська':
    case 'Херсон??ька':
    case 'Херсонсь??а':
      return 'Херсонська'
    case '??мельницька':
    case 'Хме??ьницька':
    case 'Хмель??ицька':
    case 'Хмельни??ька':
    case 'Хмельниць??а':
      return 'Хмельницька'
    case '??еркаська':
    case 'Черк??ська':
      return 'Черкаська'
    case 'Ч??рнівецька':
      return 'Чернівецька'
    case 'Ч??рнігівська':
    case 'Черн??гівська':
    case 'Чернігі??ська':
      return 'Чернігівська'
    default:
      return province
  }
}

export const cityCorrector = city => {
  switch (city) {
    case 'А??ушта':
      return 'Алушта'
    case 'Б??лики':
      return 'Білики'
    case 'Бал??вне':
      return 'Баловне'
    case 'Ба??вінок':
      return 'Барвінок'
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
    case 'Воскрес??нське':
      return 'Воскресенське'
    case 'Г??ушово':
      return 'Грушово'
    case '??ніпро':
    case 'Д??іпро':
    case 'Дні??ро':
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
    case 'Іллінц??':
      return 'Іллінці'
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
    case 'Межирі??ка':
      return 'Межирічка'
    case 'Мико??аїв':
      return 'Миколаїв'
    case 'О??еса':
    case 'Од??са':
      return 'Одеса'
    case 'Переход??':
      return 'Переходи'
    case 'Підг??йці':
      return 'Підгайці'
    case 'Поча??в':
      return 'Почаїв'
    case 'При??ипче':
      return 'Прилипче'
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
    case 'Старос??лля':
      return 'Старосілля'
    case 'Стар??й Олексинець':
      return 'Старий Олексинець'
    case 'Стр??мівка':
      return 'Струмівка'
    case 'Су??и':
    case '??уми':
      return 'Суми'
    case 'Ужг??род':
      return 'Ужгород'
    case 'Х??рол':
      return 'Хорол'
    case 'Цюрупинс??к':
      return 'Цюрупинськ'
    case 'Цуман??':
      return 'Цумань'
    case '??еркаси':
      return 'Черкаси'
    case 'Чернів??і':
      return 'Чернівці'
    case '??асливцеве':
      return 'Щасливцеве'
    case '??жне':
      return 'Южне'
    default:
      return city
  }
}
