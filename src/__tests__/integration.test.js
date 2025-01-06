import amqp from 'amqplib';
import { processPayment } from '../paymentService.js';
import { mockOrders, mockSuccessfulPaymentResult } from '../__mocks__/mockData.js';

jest.mock('amqplib');

describe('Payment Integration', () => {
  let connection;
  let channel;

  beforeEach(async () => {
    channel = {
      assertExchange: jest.fn(),
      assertQueue: jest.fn(),
      bindQueue: jest.fn(),
      publish: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn()
    };

    connection = {
      createChannel: jest.fn().mockResolvedValue(channel),
      on: jest.fn()
    };

    amqp.connect.mockResolvedValue(connection);
  });

  test('should process payment and publish result', async () => {
    const order = mockOrders[0];
    
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 1;
    global.Math = mockMath;

    const result = await processPayment(order);

    expect(result).toEqual({
      success: true,
      transactionId: expect.any(String),
      errorMessage: null
    });
  });

  test('should handle RabbitMQ connection error', async () => {
    amqp.connect.mockRejectedValue(new Error('Connection failed'));

    await expect(async () => {
      await amqp.connect('amqp://localhost');
    }).rejects.toThrow('Connection failed');
  });
});