export interface PricingPlan {
  name: string;
  tag: string;
  price: {
    monthly: number | string;
    yearly: number | string;
  };
  description: string;
  limitations?: string[];
  features: string[];
  cta: {
    text: string;
    url: string;
  };
}

export interface FeatureItem {
  name: string;
  explorer: boolean | string;
  developer: boolean | string;
  creator: boolean | string;
  enterprise: boolean | string;
}

export interface FeatureCategory {
  name: string;
  features: FeatureItem[];
}

export interface PricingContent {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    headline: string;
    subheadline: string;
  };
  pricing_table: {
    frequency_toggle: {
      monthly: string;
      yearly: string;
      yearly_discount: string;
    };
    plans: PricingPlan[];
  };
  feature_comparison: {
    title: string;
    categories: FeatureCategory[];
  };
  faq: {
    title: string;
    questions: {
      question: string;
      answer: string;
    }[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: {
      text: string;
      url: string;
    };
  };
}
