import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ChevronUp, House, List, MapPin, Phone, Wrench } from "lucide-react";
import { applyMotionCue } from "@/lib/motionRegistry";
import { applyMobileMotionCue } from "@/lib/mobileMotionRegistry";

const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=14.3517,100.5774&travelmode=driving";

const navigation = [
  { href: "/", label: "หน้าแรก" },
  { href: "/tires", label: "รายการยาง" },
  { href: "/services", label: "บริการ" },
  { href: "/contact", label: "ติดต่อเรา" },
];

const mobileShortcutItems = [
  { href: "/", label: "หน้าแรก", icon: House },
  { href: "/tires", label: "ยาง", icon: List },
  { href: "/services", label: "บริการ", icon: Wrench },
  { href: "/contact", label: "ติดต่อ", icon: MapPin },
] as const;

const mobileShortcutRoutes = ["/", "/tires", "/services"] as const;


function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="top-signal">
        <div className="container flex items-center justify-between gap-4">
          <span className="top-signal-location">พระนครศรีอยุธยา<br />ตลาดแกรนด์</span>
          <span className="hidden sm:block">ให้บริการ: 08:00 — 17:00 น.</span>
        </div>
      </div>
      <div className="container header-main">
        <Link href="/" className="brand-mark" aria-label="เป้าการยาง home">
          <span className="brand-dot" />
          <span className="brand-name">เป้าการยาง</span>
        </Link>
        <nav className="desktop-nav" aria-label="เมนูหลัก">
          {navigation.map(item => <Link key={item.href} href={item.href} className={location === item.href ? "active" : ""}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <a className="header-call" href="tel:035213134" aria-label="โทรสอบถาม 035-213134">
            <Phone size={18} />
            <span className="hidden md:inline">035-213134</span>
          </a>
          <button className="mobile-menu-button" onClick={() => setMobileOpen(open => !open)} aria-label="เปิด/ปิดเมนู" aria-expanded={mobileOpen}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      <nav className={`mobile-nav ${mobileOpen ? "open" : ""}`} aria-label="Mobile navigation">
        {navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
      </nav>
    </header>
  );
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 360);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = shouldReduceMotion ? "auto" : "smooth";

    // Use the browser's scrolling root as well as window for mobile WebViews and embedded previews.
    document.documentElement.scrollTo({ top: 0, behavior });
    document.body.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  };

  return <button type="button" className={`scroll-top-button${isVisible ? " is-visible" : ""}`} onClick={scrollToTop} aria-label="เลื่อนกลับขึ้นบนสุด">
    <ChevronUp size={20} aria-hidden="true" />
    <span>บนสุด</span>
  </button>;
}

function PageMotion() {
  const [location] = useLocation();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>(".site-shell .site-main");
    if (!main) return;

    main.classList.add("is-page-loaded");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealTargets = Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > .contact-page > section, .product-card, .service-row, .service-faq, .contact-line, .contact-home-link"));
    revealTargets.forEach((target, index) => target.classList.add("scroll-reveal", `scroll-reveal--${index % 4}`));

    const variationTargets = [
      document.querySelector<HTMLElement>(".site-header"),
      ...Array.from(main.querySelectorAll<HTMLElement>(":scope > section, :scope > .contact-page > section")),
      document.querySelector<HTMLElement>(".site-footer"),
    ].filter((target): target is HTMLElement => target !== null);
    variationTargets.forEach((target, index) => applyMotionCue(target, location, index));

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(target => target.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    revealTargets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, [location]);

  useEffect(() => {
    if (window.matchMedia("(min-width: 641px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector<HTMLElement>(".site-shell .site-main");
    if (!main) return;

    const mobileTargets = [
      document.querySelector<HTMLElement>(".mobile-menu-button"),
      document.querySelector<HTMLElement>(".mobile-nav"),
      ...Array.from(main.querySelectorAll<HTMLElement>(".mobile-home-nav, .mobile-home-nav-links a, .mobile-home-cta-pair, .mobile-home-cta-actions a, .mobile-call-bar, .scroll-top-button, .product-card, .service-row, .service-faq, .contact-line, .contact-home-link")),
      document.querySelector<HTMLElement>(".site-footer"),
    ].filter((target): target is HTMLElement => target !== null);

    mobileTargets.forEach((target, index) => applyMobileMotionCue(target, location, index));
    return () => mobileTargets.forEach(target => {
      target.removeAttribute("data-mobile-motion-cue");
      Object.keys(target.style).forEach(property => {
        if (property.startsWith("--mobile-motion-")) target.style.removeProperty(property);
      });
    });
  }, [location]);

  return null;
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileHomeCtaCollapsed, setIsMobileHomeCtaCollapsed] = useState(false);
  const showMobileShortcuts = mobileShortcutRoutes.includes(location as (typeof mobileShortcutRoutes)[number]);
  const currentShortcut = mobileShortcutItems.find(item => item.href === location);
  const mainClassName = showMobileShortcuts
    ? location === "/"
      ? "home-main mobile-shortcuts-main mobile-home-map-main"
      : "mobile-shortcuts-main"
    : undefined;
  const shellClassName = location === "/" ? "site-shell site-shell--home" : location === "/contact" ? "site-shell site-shell--contact" : "site-shell";

  useEffect(() => {
    if (location !== "/") {
      setIsMobileHomeCtaCollapsed(false);
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 640px)").matches;
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isMobileViewport || shouldReduceMotion) {
      setIsMobileHomeCtaCollapsed(false);
      return;
    }

    let idleTimer: number | undefined;
    const resetIdleTimer = () => {
      setIsMobileHomeCtaCollapsed(false);
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIsMobileHomeCtaCollapsed(true), 5000);
    };
    const activityEvents = ["scroll", "touchstart", "touchmove", "pointerdown", "pointermove", "wheel", "keydown", "focusin"] as const;

    resetIdleTimer();
        activityEvents.forEach(eventName => window.addEventListener(eventName, resetIdleTimer, { passive: eventName !== "focusin" && eventName !== "keydown" }));
    return () => {
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
      activityEvents.forEach(eventName => window.removeEventListener(eventName, resetIdleTimer));
    };
  }, [location]);

  function triggerMobileCallHaptic() {
    if (typeof navigator === "undefined") return;

    const hapticNavigator = navigator as Navigator & {
      vibrate?: (pattern: number | number[]) => boolean;
    };
    hapticNavigator.vibrate?.(12);
  }

  return (
    <div className={shellClassName}>
      <PageMotion />
      <Header />
      <main className={`site-main${mainClassName ? ` ${mainClassName}` : ""}`}>{children}</main>
      {showMobileShortcuts && currentShortcut && (
        <nav className="mobile-home-nav" aria-label="ทางลัดสำหรับมือถือ">
          <Link href={currentShortcut.href} className="mobile-home-nav-current" aria-current="page">
            <currentShortcut.icon size={15} aria-hidden="true" />
            <span>ตอนนี้: <strong>{currentShortcut.label}</strong></span>
          </Link>
          <div className="mobile-home-nav-links">
            {mobileShortcutItems
              .filter(item => item.href !== currentShortcut.href)
              .map(item => {
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <Icon size={17} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </div>
        </nav>
      )}
      {location === "/" && (
        <div className={`mobile-home-cta-pair${isMobileHomeCtaCollapsed ? " is-collapsed" : ""}`} aria-label="ทางลัดติดต่อและนำทางสำหรับมือถือ">
          <div id="mobile-home-cta-content" className="mobile-home-cta-content" aria-hidden={isMobileHomeCtaCollapsed}>
            <p className="mobile-home-hours"><span>เปิดทุกวัน</span><strong>08:00–17:00 น.</strong></p>
            <div className="mobile-home-cta-actions">
                <a className="mobile-map-bar mobile-home-map-bar" href={directionsUrl} target="_blank" rel="noreferrer" aria-label="นำทางไปยังเป้าการยางด้วย Google Maps" tabIndex={isMobileHomeCtaCollapsed ? -1 : 0}>
                <MapPin size={18} aria-hidden="true" />
                <span>นำทาง</span>
                <small>Google Maps</small>
              </a>
              <a className="mobile-home-quick-call" href="tel:035213134" aria-label="โทรด่วน ติดต่อเป้าการยาง 035-213134" onClick={triggerMobileCallHaptic} tabIndex={isMobileHomeCtaCollapsed ? -1 : 0}>
                <Phone size={18} aria-hidden="true" />
                <span>โทรด่วน</span>
              </a>
            </div>
          </div>
        </div>
      )}
      <a className="mobile-call-bar" href="tel:035213134" aria-label="โทรออกหรือนัดหมายกับเป้าการยาง 035-213134" onClick={triggerMobileCallHaptic}>
        <Phone size={19} aria-hidden="true" />
        <span className="mobile-call-label">โทร</span>
        <span className="mobile-call-divider" aria-hidden="true" />
        <small className="mobile-call-number">035-213134</small>
      </a>
      <ScrollToTopButton />
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-brand-eyebrow">เป้าการยาง / ไทยแลนด์</p>
            <p className="footer-brand-description">ร้านยางรถยนต์ในตำบลธนู อำเภออุทัย จังหวัดพระนครศรีอยุธยา พร้อมบริการปะยางและถ่วงล้อสำหรับรถหลากหลายประเภท</p>
            <address className="footer-address">9J36+4VX ตำบลธนู อำเภออุทัย จ.พระนครศรีอยุธยา 13210</address>
          </div>
          <div className="footer-stats">
            <a href="tel:035213134">โทร // 035-213134</a>
            <span className="footer-hours">เปิดทุกวัน // 08:00–17:00</span>
            <div className="footer-copyright-group">
              <span className="footer-copyright">© 2026 เป้าการยาง</span>
              {location === "/contact" && <a className="contact-home-link footer-home-link" href="/" aria-label="กลับไปหน้าแรก"><ArrowLeft size={18} aria-hidden="true" /><span>กลับหน้าแรก</span></a>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
