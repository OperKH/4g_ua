/* eslint-disable import/extensions */
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import registerHealthCheckRoutes from './routes/health-check.routes.mjs'
import registerSubscriptionRoutes from './routes/subscription.routes.mjs'

const app = new Koa()

app.use(bodyParser())
registerHealthCheckRoutes(app)
registerSubscriptionRoutes(app)

app.listen(3001)
