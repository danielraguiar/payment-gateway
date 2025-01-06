export const mockOrders = [
    {
      id: 1,
      amount: 100.00,
      customerEmail: 'customer1@example.com'
    },
    {
      id: 2,
      amount: 250.00,
      customerEmail: 'customer2@example.com'
    }
  ];
  
  export const mockSuccessfulPaymentResult = {
    success: true,
    transactionId: 'tx_123456789',
    errorMessage: null
  };
  
  export const mockFailedPaymentResult = {
    success: false,
    transactionId: null,
    errorMessage: 'Payment declined by gateway'
  };