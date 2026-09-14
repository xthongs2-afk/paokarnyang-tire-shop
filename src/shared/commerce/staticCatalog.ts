import type { Product } from "./types";

type CatalogEntry = {
  handle: string;
  title: string;
  vendor: string;
  size: string;
  vehicle: string;
  tread?: string;
  productType: string;
};

const inquiryOnlyMoney = { amount: "0.00", currencyCode: "THB" };

function makeCatalogProduct(entry: CatalogEntry): Product {
  return {
    id: `static-${entry.handle}`,
    handle: entry.handle,
    title: entry.title,
    description: "รายการแนะนำสำหรับสอบถามกับเป้าการยาง กรุณาโทรตรวจสอบรุ่น ดอกยาง และความพร้อมก่อนเข้ารับบริการ",
    descriptionHtml: "<p>รายการแนะนำสำหรับสอบถามกับเป้าการยาง กรุณาโทรตรวจสอบรุ่น ดอกยาง และความพร้อมก่อนเข้ารับบริการ</p>",
    productType: entry.productType,
    vendor: entry.vendor,
    tags: [
      `brand:${entry.vendor}`,
      `size:${entry.size}`,
      `vehicle:${entry.vehicle}`,
      ...(entry.tread ? [`tread:${entry.tread}`] : []),
    ],
    images: [],
    priceRange: { min: inquiryOnlyMoney, max: inquiryOnlyMoney },
    options: [
      { name: "ขนาด", values: [entry.size] },
      ...(entry.tread ? [{ name: "ดอกยาง", values: [entry.tread] }] : []),
    ],
    variants: [
      {
        id: `static-variant-${entry.handle}`,
        title: "สอบถามรายละเอียด",
        price: inquiryOnlyMoney,
        compareAtPrice: null,
        availableForSale: true,
        selectedOptions: [
          { name: "ขนาด", value: entry.size },
          ...(entry.tread ? [{ name: "ดอกยาง", value: entry.tread }] : []),
        ],
      },
    ],
  };
}

/**
 * รายการสินค้าที่ดูแลโดยโค้ดเว็บไซต์โดยตรงสำหรับรูปแบบสอบถามทางโทรศัพท์
 * ไม่ดึงสต็อก ราคา หรือความพร้อมจำหน่ายจาก Shopify
 */
const catalogEntries: CatalogEntry[] = [
  { handle: "hankook-ventus-prime-4-205-55r16", title: "ยางรถเก๋ง HANKOOK VENTUS PRIME 4", vendor: "HANKOOK", size: "205/55R16", vehicle: "รถเก๋ง", productType: "ยางรถเก๋ง" },
  { handle: "michelin-primacy-4-plus-205-55r16", title: "ยางรถเก๋ง MICHELIN PRIMACY 4+", vendor: "MICHELIN", size: "205/55R16", vehicle: "รถเก๋ง", productType: "ยางรถเก๋ง" },
  { handle: "yokohama-bluearth-gt-ae51-205-55r16", title: "ยางรถเก๋ง YOKOHAMA BLUEARTH-GT AE51", vendor: "YOKOHAMA", size: "205/55R16", vehicle: "รถเก๋ง", productType: "ยางรถเก๋ง" },

  { handle: "pickup-highway-265-70r16", title: "ยางรถกระบะ 265/70R16", vendor: "เป้าการยาง", size: "265/70R16", vehicle: "pickup", productType: "ยางรถกระบะ" },
  { handle: "pickup-all-terrain-265-65r17", title: "ยางรถกระบะ 265/65R17", vendor: "เป้าการยาง", size: "265/65R17", vehicle: "pickup", productType: "ยางรถกระบะ" },
  { handle: "pickup-all-terrain-265-60r18", title: "ยางรถกระบะ 265/60R18", vendor: "เป้าการยาง", size: "265/60R18", vehicle: "pickup", productType: "ยางรถกระบะ" },

  { handle: "medium-700-16-rib", title: "ยางขนาดกลาง 700-16 ดอกสร้อย", vendor: "เป้าการยาง", size: "700-16", vehicle: "medium truck", tread: "ดอกสร้อย", productType: "ยางรถบรรทุกขนาดกลาง" },
  { handle: "medium-700-16-lug", title: "ยางขนาดกลาง 700-16 ดอกบั้ง", vendor: "เป้าการยาง", size: "700-16", vehicle: "medium truck", tread: "ดอกบั้ง", productType: "ยางรถบรรทุกขนาดกลาง" },
  { handle: "medium-750-16-rib", title: "ยางขนาดกลาง 750-16 ดอกสร้อย", vendor: "เป้าการยาง", size: "750-16", vehicle: "medium truck", tread: "ดอกสร้อย", productType: "ยางรถบรรทุกขนาดกลาง" },
  { handle: "medium-750-16-lug", title: "ยางขนาดกลาง 750-16 ดอกบั้ง", vendor: "เป้าการยาง", size: "750-16", vehicle: "medium truck", tread: "ดอกบั้ง", productType: "ยางรถบรรทุกขนาดกลาง" },
  { handle: "medium-825-16-rib", title: "ยางขนาดกลาง 825-16 ดอกสร้อย", vendor: "เป้าการยาง", size: "825-16", vehicle: "medium truck", tread: "ดอกสร้อย", productType: "ยางรถบรรทุกขนาดกลาง" },
  { handle: "medium-825-16-lug", title: "ยางขนาดกลาง 825-16 ดอกบั้ง", vendor: "เป้าการยาง", size: "825-16", vehicle: "medium truck", tread: "ดอกบั้ง", productType: "ยางรถบรรทุกขนาดกลาง" },

  { handle: "bridgestone-r249-9-00-20", title: "ยางรถ 10 ล้อ 9.00-20 ดอกบั้ง", vendor: "เป้าการยาง", size: "9.00-20", vehicle: "truck", tread: "ดอกบั้ง", productType: "ยางรถ 10 ล้อ" },
  { handle: "bridgestone-r268-9-00-20", title: "ยางรถ 10 ล้อ 9.00-20 ดอกสร้อย", vendor: "เป้าการยาง", size: "9.00-20", vehicle: "truck", tread: "ดอกสร้อย", productType: "ยางรถ 10 ล้อ" },
  { handle: "hankook-smartwork-th31-10-00-20", title: "ยางรถ 10 ล้อ 10.00-20 ดอกบั้ง", vendor: "เป้าการยาง", size: "10.00-20", vehicle: "truck", tread: "ดอกบั้ง", productType: "ยางรถ 10 ล้อ" },
  { handle: "hankook-smartflex-dh35-10-00-20", title: "ยางรถ 10 ล้อ 10.00-20 ดอกสร้อย", vendor: "เป้าการยาง", size: "10.00-20", vehicle: "truck", tread: "ดอกสร้อย", productType: "ยางรถ 10 ล้อ" },
  { handle: "yokohama-ry617-11-00-20", title: "ยางรถ 10 ล้อ 11.00-20 ดอกบั้ง", vendor: "เป้าการยาง", size: "11.00-20", vehicle: "truck", tread: "ดอกบั้ง", productType: "ยางรถ 10 ล้อ" },
  { handle: "yokohama-ry722-11-00-20", title: "ยางรถ 10 ล้อ 11.00-20 ดอกสร้อย", vendor: "เป้าการยาง", size: "11.00-20", vehicle: "truck", tread: "ดอกสร้อย", productType: "ยางรถ 10 ล้อ" },
  { handle: "dunlop-sp811-11r22-5", title: "ยางรถ 10 ล้อ 11R 22.5 ดอกบั้ง", vendor: "เป้าการยาง", size: "11R 22.5", vehicle: "truck", tread: "ดอกบั้ง", productType: "ยางรถ 10 ล้อ" },
  { handle: "goodyear-kmax-s-11r22-5", title: "ยางรถ 10 ล้อ 11R 22.5 ดอกสร้อย", vendor: "เป้าการยาง", size: "11R 22.5", vehicle: "truck", tread: "ดอกสร้อย", productType: "ยางรถ 10 ล้อ" },
];

export const staticCatalog: Product[] = catalogEntries.map(makeCatalogProduct);

export const staticCatalogByHandle = new Map(
  staticCatalog.map(product => [product.handle, product])
);
