import { processPayment } from '../paymentService.js';

describe('PaymentService', () => {
  const mockOrder = {
    id: 1,
    amount: 100,
    customerEmail: 'test@example.com'
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should process payment successfully', async () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 1;
    global.Math = mockMath;

    const promise = processPayment(mockOrder);
    jest.advanceTimersByTime(1000);
    const result = await promise;

    expect(result).toEqual({
      success: true,
      transactionId: expect.any(String),
      errorMessage: null
    });
  });

  test('should fail after 3 attempts when payment is declined', async () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0;
    global.Math = mockMath;

    const promise = processPayment(mockOrder);
    
    jest.advanceTimersByTime(1000);
    jest.advanceTimersByTime(1000);
    jest.advanceTimersByTime(1000);

    await expect(promise).rejects.toThrow('Payment failed after 3 attempts');
  });

  test('should timeout if processing takes too long', async () => {
    const promise = processPayment(mockOrder);
    jest.advanceTimersByTime(6000);

    await expect(promise).rejects.toThrow('Payment processing timeout');
  });
});