import express from 'express';
import { connect as amqpConnect } from 'amqplib';
import { processPayment } from './services/paymentService.js';

const app = express();
app.use(express.json());

const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const PAYMENT_EXCHANGE = 'payment_exchange';
const PAYMENT_QUEUE = 'payment_request_queue';

async function setupMessageQueue() {
  try {
    const connection = await amqpConnect(AMQP_URL);
    console.log('Connected to RabbitMQ');
    
    const channel = await connection.createChannel();
    console.log('Channel created');

    await channel.assertExchange(PAYMENT_EXCHANGE, 'direct');
    await channel.assertQueue(PAYMENT_QUEUE);
    await channel.bindQueue(
      PAYMENT_QUEUE,
      PAYMENT_EXCHANGE,
      'payment_request'
    );

    console.log('Exchange and queues configured');

    channel.consume(PAYMENT_QUEUE, async (msg) => {
      if (msg) {
        const order = JSON.parse(msg.content.toString());
        console.log('Received payment request for order:', order.id);

        try {
          const paymentResult = await processPayment(order);
          
          channel.publish(
            PAYMENT_EXCHANGE,
            'payment_result',
            Buffer.from(JSON.stringify({
              orderId: order.id,
              success: true,
              transactionId: paymentResult.transactionId,
              errorMessage: null
            }))
          );
          
          console.log(`Payment processed successfully for order ${order.id}`);
          
        } catch (error) {
          console.error('Payment processing failed:', error.message);
          
          channel.publish(
            PAYMENT_EXCHANGE,
            'payment_result',
            Buffer.from(JSON.stringify({
              orderId: order.id,
              success: false,
              transactionId: null,
              errorMessage: error.message
            }))
          );
        }

        channel.ack(msg);
      }
    });

    connection.on('error', (error) => {
      console.error('RabbitMQ connection error:', error);
    });

    channel.on('error', (error) => {
      console.error('RabbitMQ channel error:', error);
    });

    console.log('Message queue setup completed');
  } catch (error) {
    console.error('Failed to setup message queue:', error);
    process.exit(1);
  }
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payment gateway service listening on port ${PORT}`);
  setupMessageQueue();
});