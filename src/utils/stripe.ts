import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PRICE_IDS = {
  DEVELOPER: {
    MONTHLY: 'price_developer_monthly',
    YEARLY: 'price_developer_yearly'
  },
  CREATOR: {
    MONTHLY: 'price_creator_monthly',
    YEARLY: 'price_creator_yearly'
  },
  ENTERPRISE: 'price_enterprise_custom'
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
