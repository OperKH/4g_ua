import route from 'koa-route'

export default function registerSubscriptionRoutes(app) {
  const routeName = '/api/v2/health-check'
  app.use(
    route.get(routeName, ctx => {
      ctx.body = 'OK'
    }),
  )
}
