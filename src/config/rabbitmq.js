export const RABBITMQ_CONFIG = {
    url: process.env.AMQP_URL || 'amqp://localhost',
    exchange: 'payment_exchange',
    queues: {
      payment_request: 'payment_request_queue',
      payment_result: 'payment_result_queue'
    },
    routingKeys: {
      payment_request: 'payment_request',
      payment_result: 'payment_result'
    }
};