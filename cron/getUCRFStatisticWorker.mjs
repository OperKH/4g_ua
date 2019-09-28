// eslint-disable-next-line import/extensions, import/no-unresolved
import { workerData, parentPort } from 'worker_threads'
import https from 'https'
import axios from 'axios'
import jsdom from 'jsdom'
import jquery from 'jquery'

const { JSDOM } = jsdom
const { window } = new JSDOM()
const $ = jquery(window)

const ucrfPartialsKey = 'listRegistriesCentralized::items'
const ucrfAPI = axios.create({
  baseURL: 'https://www.ucrf.gov.ua/ua/services/centralized-registries',
  headers: {
    'X-OCTOBER-REQUEST-HANDLER': 'listRegistriesCentralized::onFilterRegistries',
    'X-OCTOBER-REQUEST-PARTIALS': ucrfPartialsKey,
    'X-Requested-With': 'XMLHttpRequest',
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
})

const getUCRFStatistic = async (technology, page = 1, prevStatistic = {}) => {
  try {
    const res = await ucrfAPI.post('', null, {
      params: {
        technology,
        page,
        per_page: 200,
      },
    })
    const $html = $(res.data[ucrfPartialsKey])
    const statistic = Array.from(
      $html
        .siblings('table')
        .find('tbody')
        .find('tr'),
    ).map(tr => Array.from($(tr).find('td')).map(td => td.innerHTML))
    const lastPageText = $html
      .siblings('.row')
      .find('.pagination')
      .find('li')
      .last()
      .prev()
      .text()
    const lastPage = parseInt(lastPageText, 10)
    const result = { ...prevStatistic, ...statistic.reduce((acc, s) => ({ ...acc, [s[0]]: s }), {}) }
    console.log(`     ${technology} page: ${page}/${lastPage}`)
    return page === lastPage ? Object.values(result) : getUCRFStatistic(technology, page + 1, result)
  } catch (e) {
    console.log(`UCRF ${technology} Statistic Request Error.`)
    return prevStatistic
  }
}

;(async () => parentPort.postMessage(await getUCRFStatistic(workerData)))()
