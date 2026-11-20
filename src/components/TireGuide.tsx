import { getTagValue } from "@/lib/storefront";
import type { Product } from "@shared/commerce/types";
import { staticCatalog } from "@shared/commerce/staticCatalog";
import { Link } from "wouter";

/** Explains a tire size string in plain Thai. Covers the three formats the catalog uses. */
function readSize(size: string): string[] {
  const metric = size.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
  if (metric) {
    const [, width, ratio, rim] = metric;
    return [
      `${width} คือความกว้างหน้ายาง ${width} มิลลิเมตร`,
      `${ratio} คือความสูงแก้มยาง เท่ากับ ${ratio}% ของความกว้างหน้ายาง`,
      "R คือยางโครงสร้างเรเดียล",
      `${rim} คือใส่กับกระทะล้อขอบ ${rim} นิ้ว`,
    ];
  }
  const radialTruck = size.match(/^(\d+)R\s?([\d.]+)$/);
  if (radialTruck) {
    const [, width, rim] = radialTruck;
    return [
      `${width} คือความกว้างหน้ายางประมาณ ${width} นิ้ว`,
      "R คือยางโครงสร้างเรเดียล",
      `${rim} คือใส่กับกระทะล้อขอบ ${rim} นิ้ว แบบไม่ใช้ยางใน (ทิวบ์เลส)`,
    ];
  }
  const bias = size.match(/^(\d+(?:\.\d+)?)-(\d+)$/);
  if (bias) {
    const [, rawWidth, rim] = bias;
    const width = rawWidth.includes(".") ? rawWidth : (Number(rawWidth) / 100).toFixed(2);
    return [
      `${rawWidth} คือความกว้างหน้ายางประมาณ ${width} นิ้ว`,
      "เครื่องหมาย - คือยางโครงสร้างผ้าใบ (ไบแอส)",
      `${rim} คือใส่กับกระทะล้อขอบ ${rim} นิ้ว`,
    ];
  }
  return [];
}

const treadNotes: Record<string, string> = {
  "ดอกสร้อย": "ดอกสร้อยมีร่องยาวตามแนววิ่ง บังคับเลี้ยวได้นิ่งและวิ่งทางเรียบได้ลื่น นิยมใส่ล้อหน้าหรือรถที่วิ่งถนนลาดยางเป็นหลัก",
  "ดอกบั้ง": "ดอกบั้งมีบั้งขวางหน้ายาง ช่วยยึดเกาะและฉุดลาก นิยมใส่ล้อขับ (ล้อหลัง) หรือรถที่เข้าหน้างาน ถนนลูกรัง และทางดิน",
};

export default function TireGuide({ product }: { product: Product }) {
  const size = getTagValue(product, "size");
  const vehicle = getTagValue(product, "vehicle");
  const tread = getTagValue(product, "tread");
  const sizeLines = readSize(size);
  const related = staticCatalog.filter(item => item.productType === product.productType && item.handle !== product.handle);

  return <section className="tire-guide" aria-labelledby="tire-guide-title">
    <div className="container tire-guide-grid">
      <div>
        <h2 id="tire-guide-title" className="thai-headline">อ่านขนาดยาง {size}</h2>
        {sizeLines.length > 0 && <ul>{sizeLines.map(line => <li key={line}>{line}</li>)}</ul>}
        <p>ก่อนเปลี่ยนยาง ให้ดูขนาดเดิมที่แก้มยางของรถ{vehicle}คันนั้น แล้วเลือกยางขนาดเดียวกันหรือขนาดที่ผู้ผลิตรถกำหนด</p>
        {tread !== "—" && treadNotes[tread] && <>
          <h2 className="thai-headline">ยาง{tread}เหมาะกับงานแบบไหน</h2>
          <p>{treadNotes[tread]}</p>
        </>}
      </div>
      <div>
        <h2 className="thai-headline">ก่อนโทรสอบถาม</h2>
        <ul>
          <li>แจ้งขนาดยาง {size} และจำนวนเส้นที่ต้องการ</li>
          <li>บอกลักษณะการใช้งาน เช่น วิ่งทางไกล บรรทุกหนัก หรือเข้าหน้างาน</li>
          <li>สอบถามบริการถ่วงล้อพร้อมกันได้ ร้านมีบริการปะยางรถเล็กและรถใหญ่ และปะยางนอกสถานที่ตามนัด</li>
        </ul>
        <p>เป้าการยาง ตำบลธนู อำเภออุทัย พระนครศรีอยุธยา เปิดทุกวัน 08:00–17:00 น. โทร <a href="tel:035213134">035-213134</a></p>
        {related.length > 0 && <>
          <h2 className="thai-headline">{product.productType}ขนาดอื่น</h2>
          <ul>{related.map(item => <li key={item.handle}><Link href={`/tires/${item.handle}`}>{item.title}</Link></li>)}</ul>
        </>}
      </div>
    </div>
  </section>;
}
