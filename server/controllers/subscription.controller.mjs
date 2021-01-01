import subscriptionService from '../services/subscription.service.mjs'

export default class subscriptionController {
  static async subscribe(ctx) {
    const { token, topic } = ctx.request.body
    if (!token || !topic) {
      ctx.response.status = 400
      return
    }
    try {
      await subscriptionService.subscribe(token, topic)
      ctx.response.status = 200
      ctx.response.body = 'Subscribed'
    } catch (e) {
      ctx.response.status = 500
    }
  }
  static async unsubscribe(ctx) {
    const { token, topic } = ctx.request.query
    if (!token || !topic) {
      ctx.response.status = 400
      return
    }
    try {
      await subscriptionService.unsubscribe(token, topic)
      ctx.response.status = 200
      ctx.response.body = 'Unsubscribed'
    } catch (e) {
      ctx.response.status = 500
    }
  }
}
