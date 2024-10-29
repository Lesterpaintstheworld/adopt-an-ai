import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PRICE_IDS = {
  DEVELOPER: {
    MONTHLY: import.meta.env.VITE_STRIPE_DEVELOPER_MONTHLY_PRICE_ID,
    YEARLY: import.meta.env.VITE_STRIPE_DEVELOPER_YEARLY_PRICE_ID
  },
  CREATOR: {
    MONTHLY: import.meta.env.VITE_STRIPE_CREATOR_MONTHLY_PRICE_ID,
    YEARLY: import.meta.env.VITE_STRIPE_CREATOR_YEARLY_PRICE_ID
  }
};

export async function redirectToCheckout(priceId: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/payment/success`,
    cancelUrl: `${window.location.origin}/pricing`,
  });

  if (error) {
    console.error('Error:', error);
    throw error;
  }
}
