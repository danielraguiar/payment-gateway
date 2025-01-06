import express from 'express';
import { connect as amqpConnect } from 'amqplib';
import { processPayment } from './services/paymentService.js';

const app = express();
app.use(express.json());

const AMQP_URL = 'amqp://localhost';

async function setupMessageQueue() {
  try {
    const connection = await amqpConnect(AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange('payment_exchange', 'direct');
    await channel.assertQueue('payment_request_queue');
    await channel.bindQueue(
      'payment_request_queue',
      'payment_exchange',
      'payment_request'
    );

    channel.consume('payment_request_queue', async (msg) => {
      if (msg) {
        const order = JSON.parse(msg.content.toString());
        console.log('Received payment request for order:', order.id);

        try {
          const success = await processPayment(order);
          channel.publish(
            'payment_exchange',
            'payment_result',
            Buffer.from(JSON.stringify({
              orderId: order.id,
              success
            }))
          );
        } catch (error) {
          console.error('Payment processing failed:', error);
          channel.publish(
            'payment_exchange',
            'payment_result',
            Buffer.from(JSON.stringify({
              orderId: order.id,
              success: false
            }))
          );
        }

        channel.ack(msg);
      }
    });

    console.log('Message queue setup completed');
  } catch (error) {
    console.error('Failed to setup message queue:', error);
    process.exit(1);
  }
}