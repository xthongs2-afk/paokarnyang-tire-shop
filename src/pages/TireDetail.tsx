import SiteShell from "@/components/SiteShell";
import { getTagValue, productImage } from "@/lib/storefront";
import { staticCatalogByHandle } from "@shared/commerce/staticCatalog";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function TireDetail() {
  const [, params] = useRoute("/tires/:handle");
  const handle = params?.handle || "";
  const product = staticCatalogByHandle.get(handle);

  if (!product) return <SiteShell><div className="detail-loading"><span>ไม่พบข้อมูลยางที่ระบุ</span><Link href="/tires" className="neon-button cyan mt-5">กลับไปรายการยาง</Link></div></SiteShell>;

  const table = [
    ["แบรนด์", product.vendor || "เป้าการยาง"], ["ขนาดยาง", getTagValue(product, "size")], ["ประเภทรถ", getTagValue(product, "vehicle")], ["โครงสร้าง", product.productType || "—"],
  ];
  return <SiteShell>
    <section className="detail-section">
      <div className="container">
        <Link href="/tires" className="back-link"><ArrowLeft size={16} /> กลับไปรายการยาง</Link>
        <div className="detail-grid">
          <div className="detail-visual hud-frame"><span className="visual-label top">ยาง / สแกน 01</span><img src={productImage(product)} alt={product.title} /><span className="visual-label bottom">แรงยึดเกาะ / พร้อมใชังาน</span></div>
          <div className="detail-copy">
            <p className="eyebrow text-pink-300">{product.vendor || "เป้าการยาง"} / {product.productType || "ยาง"}</p>
            <h1>{product.title}</h1>
            <p className="detail-description">{product.description}</p>
            <a className="neon-button pink call-button-detail" href="tel:035213134"><Phone size={17} />โทรสอบถามสต็อกและราคา 035-213134</a>
            <span className="stock-line"><Check size={16} />มีสต็อก / พร้อมติดตั้ง</span>
            <div className="spec-block"><div className="spec-title">สเปคเต็ม <span>///</span></div>{table.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          </div>
        </div>
      </div>
    </section>
  </SiteShell>;
}
