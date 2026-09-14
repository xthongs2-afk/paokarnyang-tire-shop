import { getTagValue, productImage } from "@/lib/storefront";
import type { Product } from "@shared/commerce/types";
import { ArrowUpRight, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "wouter";

const SHOP_PHONE = "035213134";
const SHOP_PHONE_DISPLAY = "035-213134";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const vehicle = getTagValue(product, "vehicle");
  const size = getTagValue(product, "size");
  const treadTag = product.tags.find(tag => tag.toLowerCase().startsWith("tread:"));
  const tread = treadTag?.slice("tread:".length);
  const treadBadgeClass = tread === "ดอกบั้ง" ? "tread-badge--lug" : tread === "ดอกสร้อย" ? "tread-badge--rib" : null;
  const vehicleBadgeTone = vehicle === "รถเก๋ง" ? "sedan" : vehicle === "รถกระบะ" ? "pickup" : vehicle === "รถบรรทุกขนาดกลาง" ? "medium" : "heavy";

  return (
    <article className="product-card" style={{ "--delay": `${index * 55}ms` } as CSSProperties}>
      <Link href={`/tires/${product.handle}`} className="product-image-frame" aria-label={`View ${product.title}`}>
        <span className="product-index">0{index + 1}</span>
        <img className="product-tire-image" src={productImage(product)} alt={product.title} />
        <span className="image-scan" />
        <span className="product-more"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="product-info">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-pink-300">{product.vendor || "เป้าการยาง"}</p>
            <h3>{product.title}</h3>
          </div>
        </div>
        <div className="product-meta">
          <span className="tire-size-badge" aria-label={`ขนาดยาง ${size}`}>
            <span className="tire-size-badge__label">ขนาดยาง</span>
            <span className="tire-size-badge__value">{size}</span>
          </span><span className="tire-vehicle-badge" data-accent={vehicleBadgeTone}>{vehicle}</span>
          {tread && treadBadgeClass && <span className={`tread-badge ${treadBadgeClass}`}>{tread}</span>}
        </div>
        <a className="call-button" href={`tel:${SHOP_PHONE}`} aria-label={`Call shop at ${SHOP_PHONE_DISPLAY}`}>
          <Phone size={14} /><span>โทรสอบถาม {SHOP_PHONE_DISPLAY}</span>
        </a>
      </div>
    </article>
  );
}
