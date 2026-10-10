import { getTagValue, productImage } from "@/lib/storefront";
import type { Product } from "@shared/commerce/types";
import { ArrowUpRight, Phone } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "wouter";

const SHOP_PHONE = "035213134";
const SHOP_PHONE_DISPLAY = "035-213134";
const TILT_MAX_DEG = 9;
const IMAGE_SHIFT_PX = 7;

// Tilts the card toward the mouse in 3D. Uses the individual `rotate`/`translate`
// properties so it composes with the existing transform-based hover and reveal motion.
function useCardTilt() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const image = card.querySelector<HTMLElement>(".product-tire-image");
    const grid = card.parentElement;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const render = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      const angle = Math.min(1, Math.hypot(current.x, current.y)) * TILT_MAX_DEG;
      card.style.rotate = angle < 0.02 ? "" : `${-current.y} ${current.x} 0 ${angle.toFixed(2)}deg`;
      if (image) image.style.translate = `${(-current.x * IMAGE_SHIFT_PX).toFixed(2)}px ${(-current.y * IMAGE_SHIFT_PX).toFixed(2)}px`;
      const settled = Math.abs(target.x - current.x) < 0.002 && Math.abs(target.y - current.y) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(render);
      if (settled && target.x === 0 && target.y === 0) {
        card.style.rotate = "";
        if (image) image.style.translate = "";
      }
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(render); };

    const onEnter = () => {
      if (!grid) return;
      const g = grid.getBoundingClientRect(), c = card.getBoundingClientRect();
      grid.style.perspectiveOrigin = `${c.left - g.left + c.width / 2}px ${c.top - g.top + c.height / 2}px`;
    };
    const onMove = (event: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (event.clientX - r.left) / r.width, py = (event.clientY - r.top) / r.height;
      target.x = px * 2 - 1;
      target.y = py * 2 - 1;
      card.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
      kick();
    };
    const onLeave = () => { target.x = 0; target.y = 0; kick(); };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const vehicle = getTagValue(product, "vehicle");
  const size = getTagValue(product, "size");
  const treadTag = product.tags.find(tag => tag.toLowerCase().startsWith("tread:"));
  const tread = treadTag?.slice("tread:".length);
  const treadBadgeClass = tread === "ดอกบั้ง" ? "tread-badge--lug" : tread === "ดอกสร้อย" ? "tread-badge--rib" : null;
  const vehicleBadgeTone = vehicle === "รถเก๋ง" ? "sedan" : vehicle === "รถกระบะ" ? "pickup" : vehicle === "รถบรรทุกขนาดกลาง" ? "medium" : "heavy";

  const tiltRef = useCardTilt();

  return (
    <article ref={tiltRef} className="product-card" style={{ "--delay": `${index * 55}ms` } as CSSProperties}>
      <Link href={`/tires/${product.handle}`} className="product-image-frame" aria-label={`View ${product.title}`}>
        <span className="product-index">0{index + 1}</span>
        <img className="product-tire-image" src={productImage(product)} alt={product.title} />
        <span className="image-scan" />
        <span className="product-more"><ArrowUpRight size={18} /></span>
      </Link>
      <span className="product-card-glare" aria-hidden="true" />
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
