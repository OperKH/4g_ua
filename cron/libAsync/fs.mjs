import util from 'util'
import fs from 'fs'

export default {
  readFile: util.promisify(fs.readFile),
  writeFile: util.promisify(fs.writeFile),
  mkdir: util.promisify(fs.mkdir),
}
