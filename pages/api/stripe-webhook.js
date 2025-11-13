// pages/api/stripe-webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = { api: { bodyParser: false } }; // raw body is required

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

async function provisionBuyer(session) {
  const customerEmail = session.customer_details?.email || session.customer_email || null;
  if (!customerEmail) {
    console.warn('No customer email found in session', session.id);
    return;
  }

  // ConvertKit example
  try {
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email: customerEmail,
          fields: { source: 'stripe' }
        })
      });
      console.log('Added buyer to ConvertKit:', customerEmail);
    }
  } catch (err) {
    console.error('ConvertKit add failed', err);
  }

  // Google Sheet webhook example
  try {
    if (process.env.GOOGLE_SHEET_WEBHOOK) {
      await fetch(process.env.GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          sessionId: session.id,
          product: session.metadata?.product || 'AI Skills Beta',
          amount_total: session.amount_total || null,
          currency: session.currency || null,
          timestamp: new Date().toISOString()
        })
      });
      console.log('Appended buyer to Google Sheet via webhook');
    }
  } catch (err) {
    console.error('Google sheet append failed', err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('✅ checkout.session.completed', session.id);
        await provisionBuyer(session);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook event', err);
    res.status(500).send('Server error');
  }
}
