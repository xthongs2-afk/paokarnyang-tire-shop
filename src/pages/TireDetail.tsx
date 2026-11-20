import { SITE_URL, useSeo } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import TireGuide from "@/components/TireGuide";
import { getTagValue, productImage } from "@/lib/storefront";
import { staticCatalogByHandle } from "@shared/commerce/staticCatalog";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { Link, useRoute } from "wouter";

function breadcrumbs(title: string, handle: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าแรก", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "รายการยาง", item: `${SITE_URL}/tires` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/tires/${handle}` },
    ],
  };
}

export default function TireDetail() {
  const [, params] = useRoute("/tires/:handle");
  const handle = params?.handle || "";
  const product = staticCatalogByHandle.get(handle);
  const size = product ? getTagValue(product, "size") : "";
  const vehicle = product ? getTagValue(product, "vehicle") : "";
  const image = product ? productImage(product) : undefined;
  useSeo(product
    ? { title: `${product.title} ${size} | เป้าการยาง อยุธยา`, description: `${product.title} ขนาด ${size} สำหรับ${vehicle} ที่เป้าการยาง อ.อุทัย อยุธยา พร้อมติดตั้ง โทรสอบถามสต็อกและราคา 035-213134`, path: `/tires/${product.handle}`, image: image && image.startsWith("/") ? `${SITE_URL}${image}` : image, jsonLd: [breadcrumbs(product.title, product.handle)] }
    : { title: "ไม่พบข้อมูลยาง | เป้าการยาง", description: "ไม่พบข้อมูลยางที่ระบุ ดูรายการยางทั้งหมดของเป้าการยาง", noindex: true });

  if (!product) return <SiteShell><div className="detail-loading"><span>ไม่พบข้อมูลยางที่ระบุ</span><Link href="/tires" className="neon-button cyan mt-5">กลับไปรายการยาง</Link></div></SiteShell>;

  const table = [
    ["แบรนด์", product.vendor || "เป้าการยาง"], ["ขนาดยาง", getTagValue(product, "size")], ["ประเภทรถ", getTagValue(product, "vehicle")], ["โครงสร้าง", product.productType || "—"],
  ];
  return <SiteShell>
    <section className="detail-section">
      <div className="container">
        <Link href="/tires" className="back-link"><ArrowLeft size={16} /> กลับไปรายการยาง</Link>
        <div className="detail-grid">
          <div className="detail-visual hud-frame"><span className="visual-label top">ยาง / สแกน 01</span><img src={productImage(product)} alt={product.title} width={900} height={900} fetchPriority="high" /><span className="visual-label bottom">แรงยึดเกาะ / พร้อมใช้งาน</span></div>
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
    <TireGuide product={product} />
  </SiteShell>;
}
