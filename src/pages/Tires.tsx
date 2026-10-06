import ProductCard from "@/components/ProductCard";
import SiteShell from "@/components/SiteShell";
import { filterTires, getTagValue } from "@/lib/storefront";
import { staticCatalog } from "@shared/commerce/staticCatalog";
import { FilterX, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function FilterSelect({ label, value, values, onChange, disabled }: { label: string; value: string; values: string[]; onChange: (next: string) => void; disabled?: boolean }) {
  return <label className="filter-control"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)} disabled={disabled}><option value="all">ทุก{label}</option>{values.map(item => <option key={item} value={item}>{item}</option>)}</select></label>;
}

export default function Tires() {
  const products = staticCatalog;
  const [brand, setBrand] = useState("all");
  const [size, setSize] = useState("all");
  const [vehicle, setVehicle] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const filterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brands = useMemo(() => Array.from(new Set(products.map(item => getTagValue(item, "brand")).filter(item => item !== "—"))), [products]);
  const sizes = useMemo(() => Array.from(new Set(products.map(item => getTagValue(item, "size")).filter(item => item !== "—"))), [products]);
  const vehicles = useMemo(() => Array.from(new Set(products.map(item => getTagValue(item, "vehicle")).filter(item => item !== "—"))), [products]);
  const results = filterTires(products, { brand, size, vehicle });
  const filtersActive = brand !== "all" || size !== "all" || vehicle !== "all";

  useEffect(() => () => { if (filterTimer.current) clearTimeout(filterTimer.current); }, []);

  const updateFilter = (update: (next: string) => void) => (next: string) => {
    update(next);
    setIsFiltering(true);
    if (filterTimer.current) clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => setIsFiltering(false), 260);
  };

  const resetFilters = () => {
    setBrand("all");
    setSize("all");
    setVehicle("all");
    setIsFiltering(true);
    if (filterTimer.current) clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => setIsFiltering(false), 260);
  };

  const statusMessage = isFiltering ? "กำลังอัปเดตผลการกรอง..." : `พบยาง ${results.length.toString().padStart(2, "0")} รายการ`;

  return <SiteShell>
    <section className="hero-section tires-hero tires-hero--background tires-hero--filled">
      <img className="hero-image" src="/hero-tire-violet-2560.webp" srcSet="/hero-tire-violet-1280.webp 1280w, /hero-tire-violet-2560.webp 2560w" sizes="100vw" alt="ภาพยางรถยนต์ในอู่ไฟนีออน" />
      <div className="hero-wash" />
      <div className="container hero-content tires-hero-content">
        <p className="hero-kicker"><span className="pulse-dot" /> แค็ตตาล็อก / สต็อกจริง</p>
        <h1 className="thai-headline">ยางที่ใช้สำหรับคุณ</h1>
      </div>
    </section>
    <section className="section-pad pt-0" aria-busy={isFiltering} aria-label="รายการยางและตัวกรอง">
      <div className="container">
        <div className={`filter-deck hud-frame${isFiltering ? " is-busy" : ""}`}>
          <div className="filter-heading"><SlidersHorizontal size={18} /><span>สัญญาณตัวกรอง</span></div>
          <div className="filter-fields">
            <FilterSelect label="แบรนด์" value={brand} values={brands} onChange={updateFilter(setBrand)} />
            <FilterSelect label="ขนาด" value={size} values={sizes} onChange={updateFilter(setSize)} />
            <FilterSelect label="ประเภทรถ" value={vehicle} values={vehicles} onChange={updateFilter(setVehicle)} />
          </div>
          <button className="clear-filters" disabled={!filtersActive} onClick={resetFilters}><FilterX size={15} /> ล้าง</button>
          <output className="filter-feedback" aria-live="polite"><span>{statusMessage}</span></output>
        </div>
        <div className="catalog-status" aria-live="polite"><span>{statusMessage}</span><span>ศูนย์ / อยุธยา</span></div>
        {results.length ? <div className="product-grid">{results.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="empty-results"><FilterX size={28} /><h2>ไม่พบรายการที่ตรงกับตัวกรอง</h2><p>ลองล้างตัวกรองเพื่อดูรายการยางทั้งหมด</p><button className="neon-button cyan" onClick={resetFilters}>ล้างตัวกรอง</button></div>}
      </div>
    </section>
  </SiteShell>;
}
