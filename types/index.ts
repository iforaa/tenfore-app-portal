// App configuration
export interface AppConfig {
  id: string;
  name: string;
  appStoreId: string;
  googlePlayId: string;
  isWhitelabel: boolean;
  primaryColor: string;
}

export interface AppsData {
  apps: AppConfig[];
}

// Store metadata (from scrapers)
export interface AppStoreMetadata {
  id: string;
  appId: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  genres: string[];
  genreIds: string[];
  primaryGenre: string;
  primaryGenreId: number;
  contentRating: string;
  languages: string[];
  size: string;
  requiredOsVersion: string;
  released: string;
  updated: string;
  releaseNotes: string;
  version: string;
  price: number;
  currency: string;
  free: boolean;
  developerId: number;
  developer: string;
  developerUrl: string;
  developerWebsite: string;
  score: number;
  reviews: number;
  currentVersionScore: number;
  currentVersionReviews: number;
  screenshots: string[];
  ipadScreenshots: string[];
  appletvScreenshots: string[];
  supportedDevices: string[];
}

export interface GooglePlayMetadata {
  appId: string;
  title: string;
  url: string;
  description: string;
  descriptionHTML: string;
  summary: string;
  installs: string;
  minInstalls: number;
  maxInstalls: number;
  score: number;
  scoreText: string;
  ratings: number;
  reviews: number;
  histogram: Record<string, number>;
  price: number;
  free: boolean;
  currency: string;
  priceText: string;
  available: boolean;
  offersIAP: boolean;
  IAPRange: string;
  size: string;
  androidVersion: string;
  androidVersionText: string;
  developer: string;
  developerId: string;
  developerEmail: string;
  developerWebsite: string;
  developerAddress: string;
  privacyPolicy: string;
  genre: string;
  genreId: string;
  icon: string;
  headerImage: string;
  screenshots: string[];
  video: string;
  videoImage: string;
  contentRating: string;
  contentRatingDescription: string;
  adSupported: boolean;
  released: string;
  updated: number;
  version: string;
  recentChanges: string;
}

// Combined metadata for display
export interface AppMetadata {
  appId: string;
  fetchedAt: string;
  ios?: AppStoreMetadata;
  android?: GooglePlayMetadata;
}

// Reviews
export interface Review {
  id: string;
  userName: string;
  userImage?: string;
  date: string | number;
  score: number;
  scoreText?: string;
  url?: string;
  title?: string;
  text: string;
  replyDate?: string;
  replyText?: string;
  version?: string;
  thumbsUp?: number;
}

export interface AppReviews {
  appId: string;
  store: 'ios' | 'android';
  fetchedAt: string;
  reviews: Review[];
}

// API responses
export interface AppWithMetadata extends AppConfig {
  metadata?: AppMetadata;
  iosReviewCount?: number;
  androidReviewCount?: number;
}

export type Store = 'ios' | 'android';

// Extended review with app context (used in reviews feed)
export interface ReviewWithApp extends Review {
  appId: string;
  appName: string;
  store: Store;
}

// Unified metadata interface for both stores
export interface UnifiedMetadata {
  version: string;
  developer: string;
  size: string;
  contentRating: string;
  screenshots: string[];
  releaseNotes?: string;
  score?: number;
}
