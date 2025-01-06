import { connect } from 'amqplib';
import { RABBITMQ_CONFIG } from '../config/rabbitmq.js';

jest.mock('amqplib');

describe('RabbitMQ Configuration', () => {
  test('should use default URL when environment variable is not set', () => {
    expect(RABBITMQ_CONFIG.url).toBe('amqp://localhost');
  });

  test('should use correct exchange and queue names', () => {
    expect(RABBITMQ_CONFIG.exchange).toBe('payment_exchange');
    expect(RABBITMQ_CONFIG.queues.payment_request).toBe('payment_request_queue');
    expect(RABBITMQ_CONFIG.queues.payment_result).toBe('payment_result_queue');
  });
});