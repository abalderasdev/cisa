import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grupo CISA | Desarrollo e inversión inmobiliaria en México",
  description:
    "Grupo CISA convierte terrenos con potencial en desarrollos rentables. Diseño, gestión, construcción y comercialización, con la participación de quien aporta el predio.",
};

const MODALIDADES = [
  {
    label: "Ruta principal",
    icon: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15 M15 6v15",
    title: "Aportación de terreno",
    desc: "Si tiene un terreno urbano o periurbano, lo desarrollamos bajo una figura jurídica con reglas escritas. Usted conserva participación en el proyecto.",
    cta: "Empezar por mi terreno",
    href: "#precalificar",
    primary: true,
  },
  {
    label: "Terreno + capital",
    icon: "M9 7a3 3 0 100-6 3 3 0 000 6z M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2 M16 3h5v5 M21 3l-7 7",
    title: "Co-desarrollo",
    desc: "Buscamos un socio para estructurar el proyecto juntos, si tiene terreno y capital, o solo capital.",
    cta: "Hablar con el agente",
    href: "#agente",
  },
  {
    label: "Si ya tiene el proyecto",
    icon: "M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4",
    title: "Construcción por encargo",
    desc: "Ya tiene proyecto, licencias y financiamiento. Construimos con orden y fecha cierta.",
    cta: "Solicitar cotización",
    href: "#agente",
  },
  {
    label: "Si tiene capital",
    icon: "M3 3v18h18 M7 14l4-4 4 4 5-5",
    title: "Inversión en proyectos",
    desc: "Quiere participar en un desarrollo sin operar. Evaluamos juntos proyecto, riesgo y figura.",
    cta: "Ver proyectos abiertos",
    href: "#agente",
  },
];

const STEPS = [
  { num: "01", title: "Entrevista inicial", desc: "Conocemos su propiedad, objetivo y contexto.", time: "1–2 SEMANAS" },
  { num: "02", title: "Presentación", desc: "Revisamos el potencial de desarrollo de su propiedad.", time: "2–4 SEMANAS" },
  { num: "03", title: "Factibilidad", desc: "Analizamos variables técnicas, jurídicas y financieras.", time: "4–8 SEMANAS" },
  { num: "04", title: "Decisión estratégica", desc: "Se evalúa aportar el terreno o venderlo.", time: "2–3 SEMANAS" },
  { num: "05", title: "Plan de trabajo", desc: "Definimos alcance, responsables y siguientes pasos.", time: "3–4 SEMANAS" },
  { num: "06", title: "Primera fase", desc: "Trámites, permisos, planos finales y estimaciones.", time: "3–6 MESES" },
  { num: "07", title: "Construcción", desc: "Seguimiento de obra conforme al proyecto aprobado.", time: "12–24 MESES" },
  { num: "08", title: "Entrega", desc: "Cerramos la etapa y documentamos el resultado.", time: "2–3 MESES" },
];

const PROYECTOS = [
  {
    chip: "En trámite",
    chipClass: "proj__chip--warning",
    meta: "CDMX · CUH",
    name: "Panorama Algarín",
    loc: "Colonia Algarín · Cuauhtémoc · Ciudad de México",
    desc: "Torre de 23 departamentos. Edificio de uso mixto en zona con alta demanda de vivienda.",
    units: "23",
    levels: "15",
    year: "2027",
  },
  {
    chip: "Terminada 2025",
    chipClass: "proj__chip--success",
    meta: "EDOMEX · JILOTZINGO",
    name: "Residencial Fraile",
    loc: "Jilotzingo · Estado de México",
    desc: "Torre de departamentos en zona con gran plusvalía. Listo para entrega. Algunas unidades aún disponibles.",
    units: "48",
    levels: "8",
    year: "2025",
  },
  {
    chip: "Preventa",
    chipClass: "proj__chip--info",
    meta: "QROO · TULUM",
    name: "Itzaé",
    loc: "Tulum · Quintana Roo",
    desc: "Torre de departamentos. Diseño enfocado en privacidad, confort y conexión con el entorno natural.",
    units: "32",
    levels: "6",
    year: "2027",
  },
];

const FAQS = [
  { q: "¿Pierdo la propiedad de mi terreno?", a: "No lo vende. La aportación se formaliza bajo una figura jurídica que deja por escrito qué aporta cada parte y qué recibe. Usted conserva participación en el proyecto y firma antes de que inicie cualquier obra." },
  { q: "¿Cuánto me tocaría?", a: "Depende de cuatro factores: ubicación, uso de suelo, superficie aprovechable y situación jurídica del predio. Por eso el primer paso es una revisión de factibilidad. Sin ella, cualquier cifra que le den es inventada." },
  { q: "¿Cuánto tarda todo el proceso?", a: "Un desarrollo completo se mide en años, no en meses. Cada etapa tiene un rango estimado y el avance queda documentado con fecha. Lo publicamos porque la opacidad es lo que más cuesta." },
  { q: "¿Quién pone el capital?", a: "El proyecto se estructura con financiamiento y, cuando corresponde, con socios de capital. El propietario del terreno no aporta dinero." },
  { q: "¿Y si mi terreno no aplica?", a: "Se lo decimos con claridad y le explicamos por qué. Si tiene valor comercial, podemos ayudarle a comercializarlo. Un \"no\" honesto se recuerda y se recomienda." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title" style={{ position: "relative", background: "var(--color-bg-page)", paddingTop: 32, paddingBottom: 0, overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "24px 0", marginBottom: 48, flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              30 AÑOS · CDMX · EDOMEX · QRO · QROO
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              ISO 9001:2015
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 64, alignItems: "center" }} className="hero__main">
            <div>
              <h1 id="hero-title">
                Vender un terreno es <span style={{ textDecoration: "underline", textDecorationColor: "var(--color-brand-green-light)", textUnderlineOffset: 8 }}>una operación</span>.<br />
                <span style={{ color: "var(--color-brand-green-dark)" }}>Desarrollarlo, un negocio.</span>
              </h1>
              <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--color-ink-700)", margin: "32px 0", maxWidth: 620 }}>
                Grupo CISA convierte terrenos con potencial en desarrollos rentables. Diseñamos, gestionamos, construimos y comercializamos. Y compartimos el resultado con quien aporta el predio o el capital.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 }}>
                <a href="#precalificar" className="btn btn--primary btn--lg">Precalificar mi terreno</a>
                <a href="#modalidades" className="btn btn--secondary--green btn--lg">Conocer la empresa ↓</a>
              </div>

              <div role="list" aria-label="Prueba inmediata" style={{ display: "flex", gap: 32, flexWrap: "wrap", padding: "20px 0", borderTop: "1px solid var(--color-ink-100)" }}>
                <ProofItem value="30" label="Años en el mercado" />
                <ProofDivider />
                <ProofItem value="[N]" label="Desarrollos entregados" />
                <ProofDivider />
                <ProofItem value="[N]" label="Ciudades con operación" />
                <ProofDivider />
                <ProofItem value="1" label="Proceso certificado" />
              </div>
            </div>

            {/* Polígono protagonista */}
            <div aria-hidden="true" style={{ position: "relative", aspectRatio: "1/1", maxWidth: 560, margin: "0 auto", width: "100%" }}>
              <TerrainPolygon />
            </div>
          </div>
        </div>

        {/* Banda de zonas y datos */}
        <div aria-label="Zonas de operación y datos clave" style={{ marginTop: 80, borderTop: "1px solid var(--color-ink-100)", borderBottom: "1px solid var(--color-ink-100)", padding: "20px 0", overflowX: "auto" }}>
          <div className="container">
            <div className="mono" style={{ display: "flex", gap: 24, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", whiteSpace: "nowrap" }}>
              <span>CDMX · CUAUHTÉMOC</span><span aria-hidden="true">·</span>
              <span>EDOMEX · JILOTZINGO</span><span aria-hidden="true">·</span>
              <span>QROO · TULUM</span><span aria-hidden="true">·</span>
              <span>30 AÑOS</span><span aria-hidden="true">·</span>
              <span>ISO 9001:2015</span>
            </div>
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="section section--cream" id="modalidades" aria-labelledby="mod-title">
        <div className="container">
          <header className="section-header">
            <h2 id="mod-title">Cuatro caminos para trabajar con Grupo CISA.</h2>
            <p>No somos para todos. Somos para quien quiere hacer las cosas en serio, con un equipo que se hace responsable de principio a fin.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="modalidades-grid">
            {MODALIDADES.map((m, i) => (
              <article
                key={i}
                style={{
                  borderRadius: 16,
                  padding: 32,
                  border: "1.5px solid var(--color-ink-100)",
                  background: m.primary ? "var(--color-bg-dark)" : "white",
                  color: m.primary ? "rgba(255,255,255,0.92)" : "var(--color-ink-900)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={m.primary ? "var(--color-brand-green-light)" : "var(--color-brand-green-dark)"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={m.icon} />
                  </svg>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.8 }}>{m.label}</span>
                </div>
                <h3 style={{ color: m.primary ? "white" : "var(--color-ink-900)", fontSize: 24, fontWeight: 800 }}>{m.title}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: m.primary ? "rgba(255,255,255,0.85)" : "var(--color-ink-700)", flex: 1 }}>{m.desc}</p>
                <Link href={m.href} style={{ color: m.primary ? "var(--color-brand-green-light)" : "var(--color-brand-green-dark)", fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  {m.cta} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <style>{`
          @media (min-width: 768px) { .modalidades-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (min-width: 1024px) { .modalidades-grid { grid-template-columns: 1.4fr 1fr 1fr 1fr !important; } }
          @media (min-width: 1024px) { .hero__main { grid-template-columns: 1.2fr 1fr !important; gap: 48px !important; } }
        `}</style>
      </section>

      {/* REVELACIÓN + FORM */}
      <section className="section" id="precalificar" aria-labelledby="revelation-title">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 64 }} className="revelation">
            <div>
              <h2 id="revelation-title">Una <em style={{ color: "var(--color-brand-green-dark)", fontStyle: "normal", textDecoration: "underline", textDecorationColor: "var(--color-brand-green-light)" }}>tercera opción</em> que pocos le explican.</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 24 }}>
                Si tiene un terreno urbano o periurbano, ha visto las mismas dos opciones una y otra vez: venderlo de golpe, casi siempre por debajo de lo que vale, o conservarlo pagando predial mientras algo llega.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 16 }}>
                Hay una <strong>tercera vía que pocos le explican</strong>: aportarlo a un desarrollo, conservar participación y cobrar en metros construidos. La revisión inicial es sin costo y no lo compromete a aportarlo.
              </p>
            </div>
            <aside aria-label="Formulario de precalificación" style={{ background: "var(--color-cream)", border: "1px solid var(--color-ink-100)", borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 24, marginBottom: 8 }}>Cuéntenos sobre su terreno</h3>
              <p style={{ fontSize: 14, color: "var(--color-ink-500)", marginBottom: 24 }}>3 minutos · sin costo · sin compromiso</p>
              <form action="#" method="post" noValidate>
                <Field label="Ubicación del predio" name="ubicacion" placeholder="Municipio y estado" required />
                <Field label="Superficie aproximada (m²)" name="superficie" placeholder="Ej. 480" inputMode="numeric" />
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="uso" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-ink-900)", marginBottom: 6 }}>¿Conoce el uso de suelo?</label>
                  <select id="uso" name="uso" style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-ink-300)", borderRadius: 8, fontSize: 16, fontFamily: "inherit", background: "white" }}>
                    <option value="">Seleccione una opción</option>
                    <option>Sí lo conozco</option>
                    <option>No, quiero que lo revisen ustedes</option>
                    <option>No estoy seguro</option>
                  </select>
                </div>
                <Field label="Su nombre" name="nombre" placeholder="Nombre completo" required />
                <Field label="Teléfono con lada" name="telefono" type="tel" placeholder="55 1234 5678" required />
                <button type="submit" className="btn btn--primary btn--lg" style={{ width: "100%", marginTop: 8 }}>
                  Enviar y recibir escenarios
                </button>
                <p style={{ fontSize: 12, color: "var(--color-ink-500)", marginTop: 12, lineHeight: 1.5 }}>
                  Al enviar, acepta nuestro <a href="/aviso-de-privacidad" style={{ textDecoration: "underline" }}>aviso de privacidad</a>. La evaluación inicial no sustituye un dictamen jurídico, financiero o técnico.
                </p>
              </form>
            </aside>
          </div>
        </div>
        <style>{`@media (min-width: 1024px) { .revelation { grid-template-columns: 1.1fr 1fr !important; gap: 80px !important; } }`}</style>
      </section>

      {/* MÉTODO 8 ETAPAS */}
      <section className="section section--alt" id="metodo" aria-labelledby="method-title">
        <div className="container">
          <header className="section-header">
            <h2 id="method-title">Ocho etapas. En todo momento sabe en cuál está su proyecto.</h2>
            <p>Publicamos el proceso completo porque es la parte que casi nadie explica, y es justo donde nacen todas las dudas.</p>
          </header>
          <ol role="list" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, listStyle: "none", padding: 0, margin: 0 }}>
            {STEPS.map((s) => (
              <li key={s.num} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div className="num" style={{ fontSize: 36, fontWeight: 800, color: "var(--color-brand-green)", lineHeight: 1, flexShrink: 0 }}>{s.num}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{s.title}</h4>
                  <p style={{ color: "var(--color-ink-700)", fontSize: 15, marginBottom: 8 }}>{s.desc}</p>
                  <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)" }}>{s.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <style>{`@media (min-width: 768px) { ol[role="list"] { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { ol[role="list"] { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      </section>

      {/* OBRA · 3 PROYECTOS */}
      <section className="section" id="obra" aria-labelledby="work-title">
        <div className="container">
          <header className="section-header">
            <h2 id="work-title">No es una propuesta teórica. Es lo que hacemos.</h2>
            <p>Obra propia, en desarrollo y entregada, en el centro de México y el Caribe mexicano.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="work">
            {PROYECTOS.map((p, i) => (
              <article key={i} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div aria-hidden="true" style={{ background: "var(--color-bg-section)", aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "1px solid var(--color-ink-100)" }}>
                  <span className="mono" style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: p.chipClass.includes("warning") ? "rgba(180,83,9,0.10)" : p.chipClass.includes("success") ? "rgba(22,163,74,0.10)" : "rgba(29,78,216,0.10)", color: p.chipClass.includes("warning") ? "var(--color-warning)" : p.chipClass.includes("success") ? "var(--color-success)" : "var(--color-info)" }}>
                    {p.chip}
                  </span>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-green-dark)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </div>
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", marginBottom: 8 }}>{p.meta}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ color: "var(--color-ink-500)", fontSize: 14, marginBottom: 8 }}>{p.loc}</p>
                  <p style={{ color: "var(--color-ink-700)", fontSize: 15, lineHeight: 1.5, marginBottom: 16, flex: 1 }}>{p.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, paddingTop: 16, borderTop: "1px solid var(--color-ink-100)" }}>
                    <div>
                      <div className="num" style={{ fontSize: 22, fontWeight: 700, color: "var(--color-ink-900)" }}>{p.units}</div>
                      <div style={{ fontSize: 12, color: "var(--color-ink-500)" }}>Unidades</div>
                    </div>
                    <div>
                      <div className="num" style={{ fontSize: 22, fontWeight: 700, color: "var(--color-ink-900)" }}>{p.levels}</div>
                      <div style={{ fontSize: 12, color: "var(--color-ink-500)" }}>Niveles</div>
                    </div>
                    <div>
                      <div className="num" style={{ fontSize: 22, fontWeight: 700, color: "var(--color-ink-900)" }}>{p.year}</div>
                      <div style={{ fontSize: 12, color: "var(--color-ink-500)" }}>Entrega</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .work { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .work { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
      </section>

      {/* AGENTE */}
      <section className="section section--cream" id="agente" aria-labelledby="agent-title">
        <div className="container">
          <header className="section-header">
            <h2 id="agent-title">¿No quiere llenar formularios? Hable con nuestro agente.</h2>
            <p>Un asistente con voz, entrenado con todo lo que sabemos de desarrollo inmobiliario. Le atiende en lo que sea, al instante. 24/7, en español.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }} className="agent">
            <div>
              <h3>Le pregunta, le orienta, le conecta.</h3>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 16 }}>
                No es un chatbot. Es un agente con voz y contexto. Le pregunta qué necesita — terreno, capital, información de un desarrollo, una cita — y le guía paso a paso.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                <li style={{ paddingLeft: 24, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>Resuelve dudas sobre aportación, co-desarrollo, construcción e inversión</li>
                <li style={{ paddingLeft: 24, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>Da información de cualquier propiedad o desarrollo del catálogo</li>
                <li style={{ paddingLeft: 24, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>Agenda una llamada con un asesor humano cuando hace falta</li>
                <li style={{ paddingLeft: 24, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>Registra su contacto para seguimiento aunque la conversación se corte</li>
              </ul>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#" className="btn btn--primary btn--lg" aria-label="Iniciar conversación con el agente">
                  Hablar con el agente
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8" />
                  </svg>
                </a>
                <a href="https://wa.me/525517964940?text=Hola%2C%20vengo%20del%20sitio%20de%20Grupo%20CISA%20y%20quiero%20informaci%C3%B3n." className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>
            <div aria-hidden="true" style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 12, maxWidth: 420, margin: "0 auto", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--color-ink-100)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-brand-green-tint)", color: "var(--color-brand-green-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Asistente CISA</div>
                  <div style={{ fontSize: 12, color: "var(--color-ink-500)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />Disponible · responde en segundos
                  </div>
                </div>
              </div>
              <AgentMsg side="in">Hola, soy el asistente de Grupo CISA. ¿En qué le ayudo? Tengo información sobre terrenos, desarrollos e inversión.</AgentMsg>
              <AgentMsg side="out">Tengo un terreno en Jilotzingo, ¿qué opciones tengo?</AgentMsg>
              <AgentMsg side="in">Entendido. Para revisar si su terreno aplica, necesito municipio, superficie aproximada y si conoce el uso de suelo. ¿Empezamos?</AgentMsg>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: "var(--color-bg-section)", borderRadius: 12, marginTop: 4 }}>
                <span style={{ flex: 1, color: "var(--color-ink-500)", fontSize: 14 }}>Escriba su mensaje…</span>
                <button type="button" aria-label="Enviar mensaje" style={{ background: "var(--color-brand-green-dark)", color: "white", width: 32, height: 32, borderRadius: 8, border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
              </div>
              <div style={{ fontSize: 11, color: "var(--color-ink-500)", textAlign: "center", marginTop: 4 }}>Desarrollado por ABDev · Powered by ElevenLabs</div>
            </div>
          </div>
        </div>
        <style>{`@media (min-width: 1024px) { .agent { grid-template-columns: 1.1fr 1fr !important; gap: 80px !important; } }`}</style>
      </section>

      {/* EQUIPO */}
      <section className="section" id="equipo" aria-labelledby="team-title">
        <div className="container">
          <header className="section-header">
            <h2 id="team-title">Detrás de cada proyecto hay nombres, no un logotipo.</h2>
            <p>Un desarrollo es una relación de años. Conviene saber con quién la está empezando.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="team">
            {["Director general", "Originación", "Arquitectura", "Construcción", "Comercialización"].map((role) => (
              <div key={role} style={{ background: "var(--color-bg-section)", borderRadius: 12, padding: 24, textAlign: "center" }}>
                <div aria-hidden="true" style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: "50%", background: "var(--color-ink-200)", color: "var(--color-ink-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>[NM]</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>[Nombre]</h4>
                <div style={{ fontSize: 13, color: "var(--color-ink-500)" }}>{role}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--color-ink-500)", textAlign: "center", marginTop: 24, fontStyle: "italic" }}>[Bosque pendiente — CISA debe confirmar nombres, cargos y fotos]</p>
        </div>
        <style>{`@media (min-width: 640px) { .team { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .team { grid-template-columns: repeat(5, 1fr) !important; } }`}</style>
      </section>

      {/* FAQ */}
      <section className="section section--alt" id="faq" aria-labelledby="faq-title">
        <div className="container">
          <header className="section-header">
            <h2 id="faq-title">Lo que todos preguntan antes de dar el primer paso</h2>
          </header>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((f, i) => (
              <details key={i} style={{ borderTop: "1px solid var(--color-ink-100)" }} className="faq__item">
                <summary style={{ padding: "24px 0", cursor: "pointer", fontSize: 18, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none" }}>
                  {f.q}
                  <span aria-hidden="true" style={{ fontSize: 24, color: "var(--color-brand-green-dark)", fontWeight: 400 }}>+</span>
                </summary>
                <div style={{ padding: "0 0 24px", color: "var(--color-ink-700)", fontSize: 16, lineHeight: 1.6 }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="section section--dark" aria-labelledby="closing-title">
        <div className="container">
          <header className="section-header section--center" style={{ marginInline: "auto", textAlign: "center", marginBottom: 48 }}>
            <h2 id="closing-title" style={{ color: "white" }}>Cualquier duda, el agente o nosotros se la resolvemos al instante.</h2>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>Si prefiere hablar directo con una persona, también. Sin compromiso, sin costo inicial.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 64 }} className="closing__grid">
            <div style={{ padding: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12 }}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Si tiene un terreno</h4>
              <a href="#precalificar" className="btn btn--primary-dark btn--lg">Precalificar mi terreno</a>
            </div>
            <div style={{ padding: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12 }}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Si prefiere atención humana</h4>
              <a href="https://wa.me/525517964940?text=Hola%2C%20vengo%20del%20sitio%20de%20Grupo%20CISA%20y%20quiero%20informaci%C3%B3n." className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">Escríbanos por WhatsApp</a>
            </div>
            <div style={{ padding: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12 }}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Si quiere atención inmediata</h4>
              <a href="#agente" className="btn btn--primary-dark btn--lg">Hablar con el agente</a>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.10)" }} className="closing__contact">
            <div>
              <h5 style={{ color: "white", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Oficinas</h5>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>Circuito Circunvalación Poniente No. 16, Local V-W<br />Ciudad Satélite, Naucalpan, Estado de México C.P. 53100</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}><strong style={{ color: "white" }}>Horario:</strong> Lunes a viernes, 9:00 a 18:00. WhatsApp en horario extendido.</p>
            </div>
            <div>
              <h5 style={{ color: "white", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Teléfono</h5>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: 4 }}><a href="tel:+525517964940" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}>55 1796 4940</a></p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: 4 }}><a href="tel:+525553613771" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}>55 5361 3771</a> ext. 251 o 237</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginTop: 8 }}><strong style={{ color: "white" }}>Correo:</strong> <a href="mailto:contacto@grupocisa.mx" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)" }}>contacto@grupocisa.mx</a></p>
            </div>
            <div>
              <h5 style={{ color: "white", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Redes</h5>
              <p style={{ fontSize: 15, marginBottom: 4 }}><a href="https://instagram.com/grupocisamx" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.8)" }}>Instagram</a></p>
              <p style={{ fontSize: 15, marginBottom: 4 }}><a href="https://facebook.com/grupocisamx" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.8)" }}>Facebook</a></p>
              <p style={{ fontSize: 15 }}><a href="https://linkedin.com/company/grupocisa" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.8)" }}>LinkedIn</a></p>
            </div>
          </div>
        </div>
        <style>{`
          @media (min-width: 768px) { .closing__grid { grid-template-columns: repeat(3, 1fr) !important; } .closing__contact { grid-template-columns: repeat(3, 1fr) !important; } }
        `}</style>
      </section>
    </>
  );
}

function ProofItem({ value, label }: { value: string; label: string }) {
  return (
    <div role="listitem" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span className="num" style={{ fontSize: 24, fontWeight: 800, color: "var(--color-brand-green-dark)", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 13, color: "var(--color-ink-500)" }}>{label}</span>
    </div>
  );
}

function ProofDivider() {
  return <div aria-hidden="true" style={{ width: 1, background: "var(--color-ink-100)" }} />;
}

function AgentMsg({ side, children }: { side: "in" | "out"; children: React.ReactNode }) {
  const isIn = side === "in";
  return (
    <div style={{
      padding: "10px 14px",
      borderRadius: 12,
      background: isIn ? "var(--color-brand-green-tint)" : "var(--color-bg-section)",
      color: "var(--color-ink-900)",
      fontSize: 14,
      lineHeight: 1.5,
      maxWidth: "85%",
      alignSelf: isIn ? "flex-start" : "flex-end",
    }}>
      {children}
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, required, inputMode }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; inputMode?: "numeric" | "tel" | "email" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-ink-900)", marginBottom: 6 }}>{label}{required && <span style={{ color: "var(--color-danger)" }}> *</span>}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} required={required} inputMode={inputMode} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-ink-300)", borderRadius: 8, fontSize: 16, fontFamily: "inherit", background: "white" }} />
    </div>
  );
}

function TerrainPolygon() {
  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <g stroke="var(--color-ink-300)" strokeWidth="0.8" fill="none">
        <line x1="250" y1="20" x2="250" y2="40" />
        <text x="250" y="14" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="var(--color-ink-500)" fontWeight="600">N</text>
      </g>
      <polygon points="80,360 160,200 290,180 380,240 400,360 240,400" fill="var(--color-brand-green-tint)" stroke="var(--color-brand-green-dark)" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="290,180 340,140 430,160 380,240" fill="var(--color-brand-green-light)" fillOpacity="0.55" stroke="var(--color-brand-green-dark)" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="380,240 430,160 450,300 400,360" fill="var(--color-brand-green)" fillOpacity="0.40" stroke="var(--color-brand-green-dark)" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke="var(--color-brand-green-dark)" strokeWidth="0.6" strokeDasharray="2,3" opacity="0.5">
        <line x1="160" y1="200" x2="160" y2="360" />
        <line x1="240" y1="180" x2="240" y2="400" />
        <line x1="80" y1="280" x2="400" y2="280" />
      </g>
      <g fill="var(--color-brand-green-dark)">
        <circle cx="80" cy="360" r="5" /><circle cx="160" cy="200" r="5" /><circle cx="290" cy="180" r="5" />
        <circle cx="380" cy="240" r="5" /><circle cx="400" cy="360" r="5" /><circle cx="240" cy="400" r="5" />
      </g>
      <g fill="white" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" textAnchor="middle">
        <text x="80" y="364">01</text><text x="160" y="204">02</text><text x="290" y="184">03</text>
        <text x="380" y="244">04</text><text x="400" y="364">05</text><text x="240" y="404">06</text>
      </g>
      <g fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" fill="var(--color-ink-500)">
        <text x="20" y="200">VÉRTICE 02 · 19.43°N</text>
        <text x="320" y="120" textAnchor="end">USO DE SUELO H4</text>
        <text x="480" y="380" textAnchor="end">SUP. 480 m²</text>
      </g>
    </svg>
  );
}
