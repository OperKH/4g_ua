import cron from 'node-cron'
import crawler from './crawler'

cron.schedule('3 6,9,11-14,16,18,20 * * *', () => {
  crawler()
})
