import ProductCard from "@/components/ProductCard";
import SiteShell from "@/components/SiteShell";
import { getTagValue } from "@/lib/storefront";
import { staticCatalog } from "@shared/commerce/staticCatalog";
import type { Product } from "@shared/commerce/types";
import { ArrowRight, CircleGauge, Crosshair, Phone, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

function vehicleAccent(vehicle: string) {
  if (vehicle === "รถเก๋ง") return "sedan";
  if (vehicle === "รถกระบะ") return "pickup";
  if (vehicle === "รถบรรทุกขนาดกลาง") return "medium";
  return "heavy";
}

function CatalogGroup({ products, vehicle }: { products: Product[]; vehicle: string }) {
  const grouped = products.filter(product => getTagValue(product, "vehicle") === vehicle);
  if (grouped.length === 0) return null;
  const startIndex = products.findIndex(product => getTagValue(product, "vehicle") === vehicle);

  return (
    <div className="category-block" data-accent={vehicleAccent(vehicle)}>
      <div className="category-heading"><h3 className="thai-headline">{vehicle}</h3><span className="category-count">{grouped.length.toString().padStart(2, "0")} รายการ</span></div>
      <div className="product-grid">{grouped.map((product, offset) => <ProductCard key={product.id} product={product} index={startIndex + offset} />)}</div>
    </div>
  );
}

export default function Home() {
  const products = staticCatalog;

  return <SiteShell>
    <section className="hero-section home-hero--filled">
      <img className="hero-image" src="/manus-storage/contact-hero-full-width-neon-tire_2f9f7246.png" alt="ภาพยางรถยนต์ในอู่ไฟนีออน" />
      <div className="hero-wash" />
      <div className="container hero-content">
        <div className="hero-kicker"><span className="pulse-dot" /> เปิดให้บริการ / จ.พระนครศรีอยุธยา</div>
        <h1 className="hero-brand-name">เป้าการยาง</h1>
        <p className="hero-offsite-note" hidden><span className="hero-offsite-label">บริการถึงที่</span><span className="hero-offsite-service-copy">ปะยางนอกสถานที่สำหรับ<br />รถเก๋ง รถกระบะ และรถบรรทุก</span><span className="hero-offsite-radius">ภายในระยะไม่ไกลมาก</span></p>
        <p className="hero-description">ร้าน เป้าการยาง ให้บริการยางรถเล็ก รถใหญ่ รถเก๋ง รถ 6 ล้อ และรถ 10 ล้อ ทั้งยางใหม่และยาง % ปะยางรถเล็ก รถใหญ่ แผลรั่วข้าง แตกข้าง และหน้ายาง ด้วยระบบสตรีมร้อน อยู่ถาวร พร้อมบริการนอกสถานที่</p>
        <div className="hero-buttons"><a href="#catalog" className="neon-button pink">ดูรายการยาง <ArrowRight size={18} /></a><Link href="/services" className="ghost-button">ดูบริการ</Link></div>
      </div>
      <div className="hero-readout"><span>แรงยึดเกาะ / สูงสุด</span><span>การใส่ยาง / ตรวจสอบแล้ว</span><span>ศูนย์ / TH-01</span></div>
    </section>
    <section className="offsite-service-banner is-hidden" aria-label="บริการปะยางนอกสถานที่"><div className="container offsite-service-banner__content"><span className="offsite-service-banner__label">บริการด่วน // ถึงที่</span><p>ปะยางนอกสถานที่สำหรับรถกระบะและรถบรรทุกตามการนัดหมาย</p><a href="tel:035213134" className="offsite-service-banner__action"><Phone size={18} /> โทรเรียกบริการ</a></div></section>
    <section id="catalog" className="section-pad"><div className="container"><div className="section-heading"><div><h2 className="thai-headline">เลือกยางคู่ใจ <em>ให้ตรงสเป็ค</em></h2></div></div>
      <CatalogGroup products={products} vehicle="รถเก๋ง" />
      <CatalogGroup products={products} vehicle="รถกระบะ" />
      <CatalogGroup products={products} vehicle="รถบรรทุกขนาดกลาง" />
      <CatalogGroup products={products} vehicle="รถ 10 ล้อ" />
      <div className="section-end"><span>ซิงค์รายการยางเรียบร้อย / {products.length.toString().padStart(2, "0")} รายการ</span></div>
    </div></section>
    <section className="section-pad"><div className="container why-grid"><div><h2 className="thai-headline">สร้างมาเพื่อ<br /><em>ทุกคน.</em></h2><p className="why-copy">ร้าน เป้าการยาง เน้นให้คุณเลือกยางได้เร็ว เห็นสเปกชัดเจน และ ได้รับบริการที่เข้าใจระบบรถของคุณอย่างถูกต้อง</p><Link href="/contact" className="text-link">ดูที่ตั้งร้านบริการ <ArrowRight size={16} /></Link></div><div className="protocol-list"><div><ShieldCheck /><span><b>ใส่ได้ทรงเป็นหลัก</b><small>ขนาด ประเภทรถ และการใช้งานครบในที่เดียว</small></span></div><div><CircleGauge /><span><b>บริการแม่นยำ</b><small>ดูแลเกินกว่าการเปลี่ยนยางทั่วไป</small></span></div><div><Crosshair /><span><b>พร้อมออกถนน</b><small>ทุกการตั้งค่าออกแบบมาให้ขับได้มั่นใจ</small></span></div></div></div></section>
    <section className="local-search-section" aria-labelledby="home-local-search-title"><div className="container local-search-grid"><div><h2 id="home-local-search-title" className="thai-headline local-search-heading">มองหา<br /><em>ร้านยาง อยุธยา ?</em></h2></div><div className="local-search-copy home-local-search-copy"><p>ร้าน เป้าการยาง คือ ร้านยางใน ต.ธนู อ.อุทัย จ.พระนครศรีอยุธยา สำหรับผู้ใช้รถเก๋ง รถกระบะ รถ 6 ล้อ และรถ 10 ล้อ ที่ต้องการดูสเปกยาง สอบถามการปะยาง หรือ รับบริการถ่วงล้อ</p><p>ต้องการปะยาง ถ่วงล้อ หรือปะยางนอกสถานที่ตามการนัดหมาย สามารถดู <Link href="/services">รายละเอียดบริการยางในอยุธยา</Link> ก่อนโทรแจ้งประเภทรถหรือขนาดยางที่ใช้อยู่กับร้านได้ที่ <a href="tel:035213134">035-213134</a> ร้านเปิดทุกวัน 08:00–17:00 น.</p><Link href="/contact" className="local-search-action home-local-search-action">ดูที่ตั้งร้านและเส้นทางไปร้านเป้าการยาง <ArrowRight size={17} /></Link></div></div></section>
  </SiteShell>;
}
