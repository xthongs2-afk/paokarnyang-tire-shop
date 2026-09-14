import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { useState } from "react";

const mapUrl = "https://www.google.com/maps/search/?api=1&query=14.3517,100.5774";

export default function ContactMap() {
  const [embedReady, setEmbedReady] = useState(false);

  return (
    <div className="contact-map hud-frame" aria-label="แผนที่ที่ตั้งเป้าการยางในจังหวัดพระนครศรีอยุธยา">
      <svg className={`location-map-art ${embedReady ? "is-covered" : ""}`} viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M 38 0 L 0 0 0 38" fill="none" stroke="rgba(106,242,255,.22)" strokeWidth="1" /></pattern>
          <radialGradient id="glow"><stop stopColor="#ff48b3" stopOpacity=".55" /><stop offset="1" stopColor="#ff48b3" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="800" height="500" fill="#091016" /><rect width="800" height="500" fill="url(#grid)" opacity=".7" />
        <path d="M-60 410 C120 310 190 418 320 310 S560 184 890 252" fill="none" stroke="#dffcff" strokeWidth="7" opacity=".8" />
        <path d="M15 80 C160 150 286 98 392 188 S605 346 830 306" fill="none" stroke="#fe5bb7" strokeWidth="4" opacity=".72" />
        <path d="M146 -20 C208 126 155 238 267 333 S450 478 494 550" fill="none" stroke="#7df4ff" strokeWidth="3" opacity=".48" />
        <path d="M639 -12 C590 102 701 185 626 294 S566 421 654 530" fill="none" stroke="#91a9b9" strokeWidth="2" opacity=".5" />
        <path d="M-20 246 C140 226 208 232 336 246 S565 236 816 185" fill="none" stroke="#718190" strokeWidth="2" opacity=".55" />
        <circle cx="422" cy="245" r="105" fill="url(#glow)" /><circle cx="422" cy="245" r="29" fill="none" stroke="#ff75c7" strokeWidth="1.5" /><circle cx="422" cy="245" r="6" fill="#fff" /><path d="M422 214 V276 M391 245 H453" stroke="#b7fbff" strokeWidth="1" opacity=".8" />
        <text x="63" y="128" fill="#82f4ff" fontSize="15" fontFamily="monospace" letterSpacing="4">AYUTTHAYA // TH</text><text x="471" y="233" fill="#ffffff" fontSize="13" fontFamily="monospace" letterSpacing="2">ศูนย์บริการ</text><text x="471" y="254" fill="#92a6b6" fontSize="11" fontFamily="monospace" letterSpacing="1">14.3517° N / 100.5774° E</text>
      </svg>
      <iframe
        className={`live-fallback-map ${embedReady ? "is-ready" : ""}`}
        title="แผนที่ที่ตั้งเป้าการยาง"
        src="https://maps.google.com/maps?q=14.3517,100.5774&z=13&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setEmbedReady(true)}
      />
      <div className="map-center-pin"><MapPin size={20} /><span>เป้าการยาง</span></div>
      <a href={mapUrl} target="_blank" rel="noreferrer" className="map-external-link"><Navigation size={15} /> เปิดดูใน Google Maps <ExternalLink size={14} /></a>
      <div className="map-caption"><span><MapPin size={16} /> ศูนย์บริการพระนครศรีอยุธยา</span><span>14.3517° N / 100.5774° E</span></div>
    </div>
  );
}
