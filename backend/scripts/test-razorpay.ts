import Razorpay from 'razorpay';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('💳 Testing Razorpay credentials from .env...');
  console.log(`Key ID: "${process.env.RAZORPAY_KEY_ID}"`);

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });

  try {
    const order = await razorpay.orders.create({
      amount: 50000,
      currency: 'INR',
      receipt: `test_${Date.now()}`,
    });
    console.log('✅ Order created successfully on Razorpay live test API!');
    console.log('Order Details:', order);
  } catch (err: any) {
    console.error('❌ Razorpay Order Creation Error:', err?.error || err?.message || err);
  }
}

main();
