import cron from 'node-cron'
// eslint-disable-next-line import/extensions
import crawler from './crawler.mjs'

cron.schedule('3 6,9,11-14,16,18,20 * * *', () => {
  crawler()
})
