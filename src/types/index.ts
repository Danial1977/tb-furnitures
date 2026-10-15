// TB Furnitures Brand Types & Models

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  primaryImage: string;
  brandName?: string | null;
  categoryName?: string | null;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  shortDescription?: string | null;
  specifications?: Record<string, string> | null;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  weightKg?: number | null;
  isLargeItem: boolean;
  deliveryTier: string;
  images: { id: string; url: string; altText?: string | null }[];
  variants: ProductVariantSummary[];
  reviews: ProductReviewSummary[];
}

export interface ProductVariantSummary {
  id: string;
  title: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  priceOverride?: number | null;
  stockOnHand: number;
  stockReserved: number;
  availableStock: number;
  imageUrl?: string | null;
}

export interface ProductReviewSummary {
  id: string;
  userName: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string;
}

export interface CartItemDto {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  sku: string;
  variantTitle?: string | null;
  price: number;
  quantity: number;
  imageUrl: string;
  isLargeItem: boolean;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
  children?: { id: string; name: string; slug: string }[];
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalAmount: number;
  itemCount: number;
  trackingNumber?: string | null;
}
