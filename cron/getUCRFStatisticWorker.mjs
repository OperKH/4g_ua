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
  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
})

const getUCRFStatistic = async (technology, page = 1, prevStatistic = {}, errorCount = 0) => {
  try {
    const res = await ucrfAPI.post('', null, {
      params: {
        technology,
        page,
        per_page: 200,
      },
    })
    const $html = $(res.data[ucrfPartialsKey])
    const lastPageText = $html
      .siblings('.row')
      .find('.pagination')
      .find('li')
      .last()
      .prev()
      .text()
    const lastPage = parseInt(lastPageText, 10) || 1

    if (lastPage < page) {
      return Object.values(prevStatistic)
    }

    const statistic = Array.from(
      $html
        .siblings('table')
        .find('tbody')
        .find('tr'),
    ).map(tr => Array.from($(tr).find('td')).map(td => td.innerHTML))

    const result = { ...prevStatistic, ...statistic.reduce((acc, s) => ({ ...acc, [s[0]]: s }), {}) }
    console.log(`   ${technology.padEnd(8)} page: ${page.toString().padStart(3, 0)}/${lastPage.toString().padStart(3, 0)}`)
    return page === lastPage ? Object.values(result) : getUCRFStatistic(technology, page + 1, result)
  } catch (e) {
    if (errorCount < 10) {
      console.log(`     ${technology.padEnd(8)} page: ${page} - Retry (${errorCount + 1})`)
      return getUCRFStatistic(technology, page, prevStatistic, errorCount + 1)
    }
    console.log(`UCRF ${technology} Statistic Request Error.`)
    return null
  }
}

;(async () => parentPort.postMessage(await getUCRFStatistic(workerData)))()
