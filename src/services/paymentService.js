const PAYMENT_TIMEOUT = 5000;
export async function processPayment(order) {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Payment processing timeout'));
    }, PAYMENT_TIMEOUT);

    try {
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        console.log(`Processing payment for order ${order.id} - Attempt ${attempts + 1}`);
        
        try {
          const paymentResult = await simulatePaymentGateway(order);
          
          if (paymentResult.success) {
            clearTimeout(timeoutId);
            console.log(`Payment successful for order ${order.id}`);
            return resolve(paymentResult);
          }
          
          attempts++;
          console.log(`Payment attempt ${attempts} failed for order ${order.id}`);
        } catch (error) {
          attempts++;
          console.error(`Payment attempt ${attempts} error:`, error.message);
        }
      }
      
      clearTimeout(timeoutId);
      reject(new Error(`Payment failed after ${maxAttempts} attempts`));
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

async function simulatePaymentGateway(order) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const success = Math.random() > 0.2;

  if (success) {
    return {
      success: true,
      transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
      errorMessage: null
    };
  }

  return {
    success: false,
    transactionId: null,
    errorMessage: 'Payment declined by gateway'
  };
}