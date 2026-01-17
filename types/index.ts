export interface Tag {
  id: string;
  label: string;
  promptInjection: string;
  exampleImageUrl?: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  colorCode: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  selectionType: 'single' | 'multi';
  allowUpload: boolean;
  uploadPlaceholder?: string;
  order: number;
  tags: Tag[];
}

export interface ExampleImage {
  id: string;
  url: string;
  order: number;
  isHero: boolean;
}

export interface Analytics {
  views: number;
  generations: number;
  revenue: number;
  conversionRate: number;
  trafficSources?: {
    instagram: number;
    tiktok: number;
    direct: number;
    other: number;
  };
  topTags?: Array<{
    categoryName: string;
    tagLabel: string;
    percentage: number;
  }>;
}

export interface SecretPrompt {
  id: string;
  name: string;
  displayTitle: string;
  urlSlug: string;
  tagline: string;
  baseSystemPrompt: string;
  categories: Category[];
  exampleImages: ExampleImage[];
  pricing: {
    base: number;
    withUpload: number;
  };
  settings: {
    allowRandomizer: boolean;
    allowTextDescription: boolean;
    status: 'draft' | 'published' | 'archived';
    showOnBrowsePage: boolean;
  };
  marketing: {
    tiktok?: string;
    instagram?: string;
    linktreeUrl?: string;
    metaDescription: string;
  };
  analytics: Analytics;
  createdAt: string;
  updatedAt: string;
}
