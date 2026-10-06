import SiteShell from "@/components/SiteShell";
import { Spinner } from "@/components/ui/spinner";
import { CircleGauge, MapPin, Wrench } from "lucide-react";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Link } from "wouter";

const serviceList = [{ code: "01", title: "ปะยาง รถเล็ก รถใหญ่", note: "ปะยางรถเล็ก–รถใหญ่", icon: Wrench }, { code: "02", title: "ถ่วงล้อ รถเล็ก รถใหญ่", note: "ถ่วงล้อแม่นยำ ขับนุ่ม ลดอาการสั่น", icon: CircleGauge }, { code: "03", title: "ปะยางนอกสถานที่", note: "บริการถึงที่ สำหรับรถกระบะและรถบรรทุก", icon: MapPin }];

function ServiceFaq({ question, answer, initiallyOpen = false }: { question: string; answer: string; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [isUpdating, setIsUpdating] = useState(false);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (statusTimer.current) clearTimeout(statusTimer.current); }, []);

  const handleFaqToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const nextOpen = event.currentTarget.open;
    setOpen(nextOpen);
    setIsUpdating(true);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setIsUpdating(false), 220);
  };

  const status = isUpdating ? nextStatus(open) : open ? "คำตอบพร้อมอ่าน" : "กดเพื่อดูคำตอบ";
  return <details className="service-faq" open={open} onToggle={handleFaqToggle} aria-busy={isUpdating}><summary><span>{question}</span><span className="faq-status" aria-live="polite">{isUpdating && <Spinner aria-hidden="true" />}{status}</span></summary><p>{answer}</p></details>;
}

function nextStatus(open: boolean) {
  return open ? "กำลังแสดงคำตอบ" : "กำลังซ่อนคำตอบ";
}

export default function Services() {
  return <SiteShell><section className="hero-section services-hero services-hero--background services-hero--filled"><img className="hero-image" src="/hero-tire-violet-2560.webp" srcSet="/hero-tire-violet-1280.webp 1280w, /hero-tire-violet-2560.webp 2560w" sizes="100vw" alt="ภาพยางรถยนต์ในอู่ไฟนีออน" /><div className="hero-wash" /><div className="container hero-content services-hero-content"><p className="hero-kicker"><span className="pulse-dot" /> ศูนย์บริการ / อู่บริการ</p><h1 className="thai-headline">ปะยาง ถ่วงล้อ<br /><em>ร้านยาง อยุธยา</em></h1></div></section><section className="section-pad pt-0 services-section" aria-label="บริการร้านเป้าการยาง"><div className="container"><div className="service-list"><p className="service-status"><span className="pulse-dot" aria-hidden="true" /> บริการ 3 รายการพร้อมให้เลือก</p>{serviceList.map(service => { const Icon = service.icon; return <article className={`service-row hud-frame service-row--${service.code}`} key={service.code}><span className="service-code">{service.code}</span><span className="service-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span><div className="service-main"><h2>{service.title}</h2><p className="service-detail">{service.note}</p></div></article>; })}</div></div></section><section className="service-local-section" aria-labelledby="service-local-title"><div className="container service-local-grid"><div className="service-local-intro"><p className="eyebrow text-cyan-300">ร้านยางในอำเภออุทัย</p><h2 id="service-local-title" className="thai-headline">บริการยางที่<br /><em>เข้าใจการใช้งานจริง</em></h2><p>เป้าการยางเป็นร้านยาง อยุธยา ในตำบลธนู อำเภออุทัย สำหรับรถเก๋ง รถกระบะ รถบรรทุกขนาดกลาง และรถ 10 ล้อ เลือกสอบถามบริการให้ตรงกับการใช้งานรถได้ก่อนเข้าร้าน</p><div className="service-local-actions"><a href="tel:035213134">โทรสอบถาม 035-213134</a><Link href="/contact">ดูที่ตั้งร้าน</Link></div></div><div className="service-faq-list"><ServiceFaq initiallyOpen question="ร้านเป้าการยางให้บริการอะไรบ้าง?" answer="มีบริการปะยางรถเล็กและรถใหญ่ บริการถ่วงล้อ และบริการปะยางนอกสถานที่ตามการนัดหมาย" /><ServiceFaq question="ก่อนโทรเข้ามาควรแจ้งข้อมูลอะไร?" answer="แจ้งประเภทรถและขนาดยางที่ใช้อยู่หากทราบ เพื่อให้ร้านช่วยแนะนำการสอบถามหรือเตรียมบริการได้ตรงความต้องการ" /><ServiceFaq question="ร้านอยู่ที่ไหนและเปิดเมื่อไร?" answer="ร้านอยู่ที่ 9J36+4VX ตำบลธนู อำเภออุทัย จังหวัดพระนครศรีอยุธยา 13210 เปิดทุกวัน 08:00–17:00 น." /></div></div></section></SiteShell>;
}
