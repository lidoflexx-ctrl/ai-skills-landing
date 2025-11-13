// pages/api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { priceId, quantity = 1, customerEmail } = req.body;
    if (!priceId) return res.status(400).json({ error: 'Missing priceId' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity }],
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CANCEL_URL || (process.env.NEXT_PUBLIC_BASE_URL || '/'),
      customer_email: customerEmail || undefined,
      metadata: { product: 'AI Skills Beta' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
