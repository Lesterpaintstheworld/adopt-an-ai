/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_DEVELOPER_MONTHLY_PRICE_ID: string;
  readonly VITE_STRIPE_DEVELOPER_YEARLY_PRICE_ID: string;
  readonly VITE_STRIPE_CREATOR_MONTHLY_PRICE_ID: string;
  readonly VITE_STRIPE_CREATOR_YEARLY_PRICE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
