import { useSeo } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import { Link } from "wouter";

export default function NotFound() {
  useSeo({ title: "ไม่พบหน้าที่ต้องการ | เป้าการยาง", description: "ไม่พบหน้าที่ต้องการ กลับไปหน้าแรกของเป้าการยาง ร้านยาง อยุธยา", noindex: true });
  return (
    <SiteShell>
      <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <h1 className="thai-headline">ไม่พบหน้าที่ต้องการ</h1>
        <p style={{ margin: "1rem 0" }}>หน้าที่คุณค้นหาอาจถูกย้ายหรือไม่มีอยู่</p>
        <Link href="/" className="neon-button pink">กลับหน้าแรก</Link>
      </div>
    </SiteShell>
  );
}
