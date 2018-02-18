import cron from 'node-cron'
import crawler from './crawler'

cron.schedule('03 6,9,11-14,16,18,20 * * *', () => {
  crawler()
})
