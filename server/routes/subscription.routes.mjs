import route from 'koa-route'
import subscriptionController from '../controllers/subscription.controller.mjs'

export default function registerSubscriptionRoutes(app) {
  const routeName = '/api/v2/subscription'
  app.use(route.post(routeName, subscriptionController.subscribe))
  app.use(route.delete(routeName, subscriptionController.unsubscribe))
}
