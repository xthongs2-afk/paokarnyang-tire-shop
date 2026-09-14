import type { Money, Product } from "@shared/commerce/types";

export const heroImage = "/manus-storage/contact-hero-full-width-neon-tire_2f9f7246.png";
export const productFallbackImage = "/manus-storage/paokarnyang-phantom-grip_49b11f0c.jpg";

const catalogProductImages: Record<string, string> = {
  "hankook-ventus-prime-4-205-55r16": "/manus-storage/paokarnyang-phantom-grip_49b11f0c.jpg",
  "michelin-primacy-4-plus-205-55r16": "/manus-storage/paokarnyang-phantom-grip_49b11f0c.jpg",
  "yokohama-bluearth-gt-ae51-205-55r16": "/manus-storage/paokarnyang-phantom-grip_49b11f0c.jpg",
  "pickup-highway-265-70r16": "/manus-storage/pickup-all-terrain-tire_e64d1097.png",
  "pickup-all-terrain-265-65r17": "/manus-storage/pickup-all-terrain-tire_e64d1097.png",
  "pickup-all-terrain-265-60r18": "/manus-storage/pickup-all-terrain-tire_e64d1097.png",
  "bridgestone-r249-9-00-20": "/manus-storage/truck-tire-b_4075aac3.png",
  "bridgestone-r268-9-00-20": "/manus-storage/truck-tire-a_62666b32.png",
  "hankook-smartwork-th31-10-00-20": "/manus-storage/truck-tire-b_4075aac3.png",
  "hankook-smartflex-dh35-10-00-20": "/manus-storage/truck-tire-a_62666b32.png",
  "yokohama-ry617-11-00-20": "/manus-storage/truck-tire-b_4075aac3.png",
  "yokohama-ry722-11-00-20": "/manus-storage/truck-tire-a_62666b32.png",
  "dunlop-sp811-11r22-5": "/manus-storage/truck-tire-b_4075aac3.png",
  "goodyear-kmax-s-11r22-5": "/manus-storage/truck-tire-a_62666b32.png",
  "medium-700-16-rib": "/manus-storage/medium-truck-tire-rib_8290b181.png",
  "medium-700-16-lug": "/manus-storage/medium-truck-tire-lug_17d3276a.png",
  "medium-750-16-rib": "/manus-storage/medium-truck-tire-rib_8290b181.png",
  "medium-750-16-lug": "/manus-storage/medium-truck-tire-lug_17d3276a.png",
  "medium-825-16-rib": "/manus-storage/medium-truck-tire-rib_8290b181.png",
  "medium-825-16-lug": "/manus-storage/medium-truck-tire-lug_17d3276a.png",
};

const vehicleTitleCase: Record<string, string> = {
  sedan: "รถเก๋ง",
  suv: "SUV",
  pickup: "รถกระบะ",
  truck: "รถ 10 ล้อ",
  "10-wheel truck": "รถ 10 ล้อ",
  "medium truck": "รถบรรทุกขนาดกลาง",
};

const featuredHandles = new Set([
  "hankook-ventus-prime-4-205-55r16",
  "michelin-primacy-4-plus-205-55r16",
  "yokohama-bluearth-gt-ae51-205-55r16",
  "pickup-highway-265-70r16",
  "pickup-all-terrain-265-65r17",
  "pickup-all-terrain-265-60r18",
  "medium-700-16-rib",
  "medium-700-16-lug",
  "medium-750-16-rib",
  "medium-750-16-lug",
  "medium-825-16-rib",
  "medium-825-16-lug",
  "bridgestone-r249-9-00-20",
  "bridgestone-r268-9-00-20",
  "hankook-smartwork-th31-10-00-20",
  "hankook-smartflex-dh35-10-00-20",
  "yokohama-ry617-11-00-20",
  "yokohama-ry722-11-00-20",
  "dunlop-sp811-11r22-5",
  "goodyear-kmax-s-11r22-5",
]);

export function isFeaturedProduct(handle: string) {
  return featuredHandles.has(handle);
}

export function getTagValue(product: Product, prefix: string) {
  const tag = product.tags.find(item => item.toLowerCase().startsWith(`${prefix.toLowerCase()}:`));
  if (!tag && prefix.toLowerCase() === "brand" && product.vendor) {
    return product.vendor.toUpperCase();
  }
  if (!tag) return "—";
  let value = tag.slice(prefix.length + 1);
  if (prefix.toLowerCase() === "vehicle") {
    value = vehicleTitleCase[value.toLowerCase()] ?? value;
  }
  if (prefix.toLowerCase() === "size") {
    value = value.replace(/\s+/g, "");
  }
  return value;
}

export function formatMoney(money: Money) {
  const amount = Number(money.amount);
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: money.currencyCode || "THB",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function primaryVariant(product: Product) {
  return product.variants[0];
}

export function productImage(product: Product) {
  return product.images[0]?.url || catalogProductImages[product.handle] || productFallbackImage;
}

export type TireFilter = {
  brand: string;
  size: string;
  vehicle: string;
};

export function filterTires(products: Product[], filter: TireFilter) {
  return products
    .filter(product => isFeaturedProduct(product.handle))
    .filter(product =>
      (filter.brand === "all" || getTagValue(product, "brand") === filter.brand) &&
      (filter.size === "all" || getTagValue(product, "size") === filter.size) &&
      (filter.vehicle === "all" || getTagValue(product, "vehicle") === filter.vehicle)
    );
}

export const catalogPageSize = 12;

export function visibleTires(products: Product[], limit: number) {
  return products.slice(0, Math.max(0, limit));
}
