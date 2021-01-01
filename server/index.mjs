import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import registerSubscriptionRoutes from './routes/subscription.routes.mjs'

const app = new Koa()

app.use(bodyParser())
registerSubscriptionRoutes(app)

app.listen(3001)
