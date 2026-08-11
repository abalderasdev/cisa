import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desarrollos vigentes | Grupo CISA · CDMX, EdoMex, Quintana Roo",
  description: "Tres proyectos en marcha en distintas etapas. Estatus, datos clave y zonas de operación publicados con fecha de actualización.",
};

const PROYECTOS = [
  {
    id: "panorama-algarin",
    chip: "En trámite",
    chipStyle: { background: "rgba(180,83,9,0.10)", color: "var(--color-warning)" },
    loc: "CDMX · CUH · MIXTO",
    code: "CDMX-001",
    updated: "2025-Q4",
    name: "Panorama Algarín",
    subloc: "Colonia Algarín · Cuauhtémoc · Ciudad de México",
    desc: "Torre de 23 departamentos. Edificio de uso mixto en zona con alta demanda de vivienda, a pasos de vialidades principales.",
    stats: [
      { dt: "Producto", dd: "23 departamentos + 1 local" },
      { dt: "Niveles", dd: "15" },
      { dt: "Entrega estimada", dd: "2027 · Q4" },
      { dt: "Unidades", dd: "[N] disponibles" },
    ],
    cta: "Ver desarrollo",
    wa: "Panorama%20Algar%C3%ADn",
  },
  {
    id: "residencial-fraile",
    chip: "Terminada 2025",
    chipStyle: { background: "rgba(22,163,74,0.10)", color: "var(--color-success)" },
    loc: "EDOMEX · JILOTZINGO",
    code: "EDOMEX-002",
    updated: "2025-Q4",
    name: "Residencial Fraile",
    subloc: "Jilotzingo · Estado de México",
    desc: "Torre de departamentos en zona con gran plusvalía. Listo para entrega. Algunas unidades aún disponibles.",
    stats: [
      { dt: "Producto", dd: "48 departamentos" },
      { dt: "Niveles", dd: "8" },
      { dt: "Entrega", dd: "2025 · entregada" },
      { dt: "Unidades", dd: "[N] disponibles" },
    ],
    cta: "Ver desarrollo",
    wa: "Residencial%20Fraile",
  },
  {
    id: "itzae",
    chip: "Preventa",
    chipStyle: { background: "rgba(29,78,216,0.10)", color: "var(--color-info)" },
    loc: "QROO · TULUM",
    code: "QROO-003",
    updated: "2026-Q2",
    name: "Itzaé",
    subloc: "Tulum · Quintana Roo",
    desc: "Torre de departamentos. Diseño enfocado en privacidad, confort y conexión con el entorno natural. Preventa abierta.",
    stats: [
      { dt: "Producto", dd: "32 departamentos" },
      { dt: "Niveles", dd: "6" },
      { dt: "Entrega estimada", dd: "2027 · Q2" },
      { dt: "Unidades", dd: "Preventa abierta" },
    ],
    cta: "Conocer Itzaé",
    wa: "Itza%C3%A9%20Tulum",
  },
];

const LINEAS = [
  { chip: "First Summit", title: "Primera vivienda", desc: "Departamentos accesibles, personalizables en acabados, pensados para que el propietario los adapte a su medida y posibilidades." },
  { chip: "Urban Summit", title: "Uso mixto", desc: "Proyectos en zonas de crecimiento. Diseño vanguardista integrado al contexto, con locales comerciales en planta baja." },
  { chip: "Green Summit", title: "Lotes residenciales", desc: "Privadas residenciales con urbanización de primer nivel, amenidades y reglamento de construcción controlado." },
  { chip: "Seaside Summit", title: "Destinos turísticos", desc: "Desarrollos en zonas turísticas de alto crecimiento, con diseño vanguardista y amenidades de bajo mantenimiento." },
];

export default function DesarrollosPage() {
  return (
    <>
      {/* HERO COMPACTO */}
      <section className="hero" aria-labelledby="hero-title" style={{ background: "var(--color-bg-page)", paddingTop: 32, paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "24px 0", marginBottom: 48, flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              3 PROYECTOS VIGENTES · CDMX · EDOMEX · QROO
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>ESTATUS ACTUALIZADO</span>
          </div>

          <div style={{ maxWidth: 880, marginBottom: 64 }}>
            <h1 id="hero-title">
              Desarrollos en marcha, en distintas <span style={{ textDecoration: "underline", textDecorationColor: "var(--color-brand-green-light)", textUnderlineOffset: 8 }}>etapas</span>.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--color-ink-700)", margin: "32px 0", maxWidth: 760 }}>
              Cada proyecto en una fase distinta: en trámite, terminado y en preventa. El estatus se publica con la fecha de actualización para que pueda revisarlo antes de cualquier conversación.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#proyectos" className="btn btn--primary btn--lg">Ver proyectos vigentes</a>
              <a href="https://wa.me/525517964940?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20desarrollos%20de%20Grupo%20CISA." className="btn btn--secondary--green btn--lg" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section style={{ padding: "32px 0", borderTop: "1px solid var(--color-ink-100)", borderBottom: "1px solid var(--color-ink-100)" }} aria-label="Filtros de desarrollos">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", textTransform: "uppercase", display: "block", marginBottom: 12 }}>Estatus</span>
              <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Todos", "En trámite", "Terminada", "Preventa"].map((s, i) => (
                  <button key={s} type="button" aria-pressed={i === 0 ? "true" : "false"} className="chip" style={{ padding: "8px 14px", borderRadius: 999, border: "1.5px solid", borderColor: i === 0 ? "var(--color-brand-green-dark)" : "var(--color-ink-100)", background: i === 0 ? "var(--color-brand-green-dark)" : "white", color: i === 0 ? "white" : "var(--color-ink-700)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {i > 0 && <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: i === 1 ? "var(--color-warning)" : i === 2 ? "var(--color-success)" : "var(--color-info)" }} />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", textTransform: "uppercase", display: "block", marginBottom: 12 }}>Zona</span>
              <div role="group" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Todas", "CDMX", "Estado de México", "Quintana Roo"].map((s, i) => (
                  <button key={s} type="button" aria-pressed={i === 0 ? "true" : "false"} style={{ padding: "8px 14px", borderRadius: 999, border: "1.5px solid", borderColor: i === 0 ? "var(--color-brand-green-dark)" : "var(--color-ink-100)", background: i === 0 ? "var(--color-brand-green-dark)" : "white", color: i === 0 ? "white" : "var(--color-ink-700)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 PROYECTOS */}
      <section className="section" id="proyectos" aria-labelledby="devs-title">
        <div className="container">
          <header className="section-header">
            <h2 id="devs-title">Tres proyectos en marcha.</h2>
            <p>Consulte el estatus real y los datos clave de cada desarrollo antes de solicitar información.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="devs-grid">
            {PROYECTOS.map((p) => (
              <article key={p.id} id={p.id} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, overflow: "hidden" }}>
                <div aria-hidden="true" style={{ background: "var(--color-bg-section)", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "1px solid var(--color-ink-100)" }}>
                  <span className="mono" style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", ...p.chipStyle }}>
                    {p.chip}
                  </span>
                  <span className="mono" style={{ position: "absolute", bottom: 12, right: 12, padding: "4px 10px", borderRadius: 999, fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", background: "rgba(15,20,25,0.85)", color: "white" }}>{p.loc}</span>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-green-dark)" strokeWidth={1}>
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                  <div className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", marginBottom: 8, display: "flex", gap: 8 }}>
                    <span>{p.code}</span><span>·</span><span>Actualizado {p.updated}</span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ color: "var(--color-ink-500)", fontSize: 14, marginBottom: 12 }}>{p.subloc}</p>
                  <p style={{ color: "var(--color-ink-700)", fontSize: 15, lineHeight: 1.55, marginBottom: 20, flex: 1 }}>{p.desc}</p>
                  <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 20, borderTop: "1px solid var(--color-ink-100)", margin: 0, marginBottom: 20 }}>
                    {p.stats.map((s) => (
                      <div key={s.dt}>
                        <dt style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", textTransform: "uppercase", marginBottom: 4 }}>{s.dt}</dt>
                        <dd style={{ fontSize: 15, fontWeight: 600, color: "var(--color-ink-900)", margin: 0 }}>{s.dd}</dd>
                      </div>
                    ))}
                  </dl>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href={`#${p.id}`} className="btn btn--primary">{p.cta}</a>
                    <a href={`https://wa.me/525517964940?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20${p.wa}.`} className="btn btn--secondary--green" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .devs-grid { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .devs-grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
      </section>

      {/* LÍNEAS DE PRODUCTO */}
      <section className="section section--alt" aria-labelledby="lineas-title">
        <div className="container">
          <header className="section-header">
            <h2 id="lineas-title">Cuatro líneas de producto.</h2>
            <p>Lo que diseñamos y construimos, en cuatro familias. Los desarrollos vigentes pueden combinar más de una.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="lines__grid">
            {LINEAS.map((l) => (
              <article key={l.chip} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 24 }}>
                <span className="mono" style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", background: "var(--color-brand-green-tint)", color: "var(--color-brand-green-dark)", marginBottom: 12 }}>{l.chip}</span>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{l.title}</h4>
                <p style={{ fontSize: 15, color: "var(--color-ink-700)", lineHeight: 1.5 }}>{l.desc}</p>
              </article>
            ))}
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .lines__grid { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .lines__grid { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      </section>

      {/* CTA PRÓXIMO DESARROLLO */}
      <section className="section section--cream" aria-labelledby="next-title">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "center" }} className="next">
            <div>
              <h2 id="next-title">El próximo desarrollo puede ser el suyo.</h2>
              <p style={{ fontSize: 18, color: "var(--color-ink-700)", lineHeight: 1.6, marginTop: 16, maxWidth: 560 }}>
                Si tiene un terreno con potencial, forme parte del próximo proyecto. La revisión inicial es sin costo y no lo compromete a aportarlo.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <Link href="/su-terreno" className="btn btn--primary btn--lg">Precalificar mi terreno</Link>
                <a href="https://wa.me/525517964940?text=Hola%2C%20quiero%20saber%20si%20mi%20terreno%20puede%20ser%20parte%20del%20pr%C3%B3ximo%20desarrollo." className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>
            <div aria-hidden="true" style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 16, padding: 24, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DADCE0" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#grid)" />
                <polygon points="60,210 130,80 240,70 320,140 340,230 200,250" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="240,70 280,30 360,40 320,140" fill="#8BC34A" fillOpacity="0.45" stroke="#1F4D2A" strokeWidth="1.5" />
                <polygon points="320,140 360,40 380,180 340,230" fill="#2E7D32" fillOpacity="0.40" stroke="#1F4D2A" strokeWidth="1.5" />
                <text x="200" y="160" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fill="#1F4D2A" fontWeight="700" letterSpacing="0.10em">SU TERRENO</text>
                <text x="200" y="180" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#5C636A" letterSpacing="0.10em">PRÓXIMO PROYECTO</text>
              </svg>
            </div>
          </div>
        </div>
        <style>{`@media (min-width: 1024px) { .next { grid-template-columns: 1fr 1fr !important; gap: 80px !important; } }`}</style>
      </section>
    </>
  );
}
