export async function processPayment(order) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.2;
    
    if (!success) {
      throw new Error('Payment failed');
    }
    
    return true;
  }