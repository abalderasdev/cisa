import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inversión en proyectos | Grupo CISA · Participación caso por caso",
  description: "Grupo CISA evalúa proyectos y estructuras de participación caso por caso. Sin cifras genéricas, sin promesas.",
};

const PROYECTOS = [
  { chip: "En trámite", chipColor: "warning", code: "CDMX-001", updated: "2025-Q4", name: "Panorama Algarín", subloc: "Colonia Algarín · Cuauhtémoc · Ciudad de México", desc: "Torre de 23 departamentos. Edificio de uso mixto en zona con alta demanda de vivienda.", stats: [["Producto", "23 deptos + 1 local"], ["Niveles", "15"], ["Entrega", "2027 · Q4"]], wa: "Panorama%20Algar%C3%ADn" },
  { chip: "Terminada 2025", chipColor: "success", code: "EDOMEX-002", updated: "2025-Q4", name: "Residencial Fraile", subloc: "Jilotzingo · Estado de México", desc: "Torre de departamentos en zona con gran plusvalía. Listo para entrega.", stats: [["Producto", "48 departamentos"], ["Niveles", "8"], ["Entrega", "2025 · entregada"]], wa: "Residencial%20Fraile" },
  { chip: "Preventa", chipColor: "info", code: "QROO-003", updated: "2026-Q2", name: "Itzaé", subloc: "Tulum · Quintana Roo", desc: "Torre de departamentos. Diseño enfocado en privacidad, confort y entorno natural. Preventa abierta.", stats: [["Producto", "32 departamentos"], ["Niveles", "6"], ["Entrega", "2027 · Q2"]], wa: "Itza%C3%A9" },
];

const STEPS = [
  { num: "01", title: "Solicitud inicial", desc: "Comparte su interés, perfil y disponibilidad. Lo atendemos por WhatsApp o por el formulario.", time: "1–2 SEMANAS" },
  { num: "02", title: "Resumen del proyecto", desc: "Le enviamos el resumen del proyecto abierto que mejor encaje con su perfil, con la documentación base.", time: "1–2 SEMANAS" },
  { num: "03", title: "Revisión de documentos", desc: "Revisa con su abogado o contador la estructura propuesta. Le aclaramos dudas técnicas sin compromiso.", time: "2–4 SEMANAS" },
  { num: "04", title: "Aprobación", desc: "La participación se aprueba proyecto por proyecto, después de su evaluación interna de riesgo y capacidad.", time: "2–3 SEMANAS" },
  { num: "05", title: "Acompañamiento", desc: "Una vez firmado, recibe el avance del proyecto con la misma frecuencia con la que informamos al equipo interno.", time: "DURANTE EL PROYECTO" },
];

export default function InversionPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title" style={{ background: "var(--color-bg-page)", paddingTop: 32, paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "24px 0", marginBottom: 48, flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              PARA SOCIOS DE CAPITAL
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>PROYECTOS CASO POR CASO</span>
          </div>

          <div style={{ maxWidth: 880, marginBottom: 64 }}>
            <h1 id="hero-title">
              Participación en <span style={{ textDecoration: "underline", textDecorationColor: "var(--color-brand-green-light)", textUnderlineOffset: 8 }}>proyectos</span>, no en instrumentos financieros.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--color-ink-700)", margin: "32px 0", maxWidth: 760 }}>
              Grupo CISA evalúa proyectos y estructuras de participación caso por caso. La disponibilidad, la documentación y las condiciones se revisan proyecto por proyecto, no con cifras genéricas.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#proyectos" className="btn btn--primary btn--lg">Ver proyectos abiertos</a>
              <a href="https://wa.me/525517964940?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20proyectos%20abiertos%20para%20invertir." className="btn btn--secondary--green btn--lg" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* LO QUE SÍ Y LO QUE NO */}
      <section className="section" aria-labelledby="reglas-title">
        <div className="container">
          <header className="section-header">
            <h2 id="reglas-title">Lo que este sitio sí publica, y lo que nunca.</h2>
            <p>La forma en que se evalúa un proyecto y se documenta la participación está en la página. Lo que nunca decimos está aquí también.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="aplican__grid">
            <article style={{ background: "rgba(22,163,74,0.04)", border: "1.5px solid rgba(22,163,74,0.30)", borderRadius: 12, padding: 32 }}>
              <h3 style={{ color: "var(--color-success)", fontSize: 22, marginBottom: 16 }}>Lo que sí</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["La estructura legal bajo la que se concreta la participación.", "Los criterios con los que se evalúa cada proyecto (ubicación, producto, demanda, factibilidad).", "El estado del proyecto y su etapa, con la fecha de actualización.", "La documentación disponible para revisión, una vez que el proyecto pasa el filtro.", "El avance de obra, cuando el proyecto está en construcción."].map((it) => (
                  <li key={it} style={{ paddingLeft: 28, position: "relative", fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>{it}
                  </li>
                ))}
              </ul>
            </article>
            <article style={{ background: "rgba(180,83,9,0.04)", border: "1.5px solid rgba(180,83,9,0.30)", borderRadius: 12, padding: 32 }}>
              <h3 style={{ color: "var(--color-warning)", fontSize: 22, marginBottom: 16 }}>Lo que nunca</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["Rendimientos garantizados o utilidades aseguradas.", "Plazos fijos de retorno, sin condicionar al proyecto.", "\"Inversión segura\" o equivalentes.", "Cifras genéricas de retorno que apliquen a \"proyectos similares\".", "Comparativos con instrumentos financieros regulados."].map((it) => (
                  <li key={it} style={{ paddingLeft: 28, position: "relative", fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--color-warning)", fontWeight: 700 }}>—</span>{it}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
        <style>{`@media (min-width: 1024px) { .aplican__grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </section>

      {/* 5 PASOS */}
      <section className="section section--alt" aria-labelledby="proceso-title">
        <div className="container">
          <header className="section-header">
            <h2 id="proceso-title">Cómo se estructura la participación.</h2>
            <p>Cinco pasos. Cada paso se documenta antes de pasar al siguiente.</p>
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
        <style>{`@media (min-width: 768px) { .inversion ol[role="list"] { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .inversion ol[role="list"] { grid-template-columns: repeat(5, 1fr) !important; } }`}</style>
      </section>

      {/* 3 PROYECTOS ABIERTOS */}
      <section className="section" id="proyectos" aria-labelledby="devs-title">
        <div className="container">
          <header className="section-header">
            <h2 id="devs-title">Proyectos abiertos a participación.</h2>
            <p>Los tres proyectos vigentes, en distintas etapas. La disponibilidad real se confirma con un asesor después de la solicitud inicial.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="devs-grid">
            {PROYECTOS.map((p) => (
              <article key={p.code} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, overflow: "hidden" }}>
                <div aria-hidden="true" style={{ background: "var(--color-bg-section)", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span className="mono" style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: p.chipColor === "warning" ? "rgba(180,83,9,0.10)" : p.chipColor === "success" ? "rgba(22,163,74,0.10)" : "rgba(29,78,216,0.10)", color: p.chipColor === "warning" ? "var(--color-warning)" : p.chipColor === "success" ? "var(--color-success)" : "var(--color-info)" }}>{p.chip}</span>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-green-dark)" strokeWidth={1}>
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                  </svg>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                  <div className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", marginBottom: 8 }}>{p.code} · {p.updated}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ color: "var(--color-ink-500)", fontSize: 14, marginBottom: 12 }}>{p.subloc}</p>
                  <p style={{ color: "var(--color-ink-700)", fontSize: 15, lineHeight: 1.5, marginBottom: 16, flex: 1 }}>{p.desc}</p>
                  <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 16, borderTop: "1px solid var(--color-ink-100)", margin: 0, marginBottom: 16 }}>
                    {p.stats.map(([dt, dd]) => (
                      <div key={dt}>
                        <dt style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", color: "var(--color-ink-500)", textTransform: "uppercase", marginBottom: 4 }}>{dt}</dt>
                        <dd style={{ fontSize: 14, fontWeight: 600, color: "var(--color-ink-900)", margin: 0 }}>{dd}</dd>
                      </div>
                    ))}
                  </dl>
                  <p style={{ fontSize: 13, color: "var(--color-ink-500)", marginBottom: 16, fontStyle: "italic" }}>Resumen disponible después de solicitud inicial.</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href="#solicitar" className="btn btn--primary">Solicitar resumen</a>
                    <a href={`https://wa.me/525517964940?text=Hola%2C%20quiero%20el%20resumen%20de%20${p.wa}.`} className="btn btn--secondary--green" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .devs-grid { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .devs-grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
      </section>

      {/* FORMULARIO */}
      <section className="section section--alt" id="solicitar" aria-labelledby="form-title">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 64 }} className="revelation">
            <div>
              <h2 id="form-title">Solicite el resumen de proyectos abiertos.</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 24 }}>
                Le enviamos un resumen de los proyectos que están abiertos a participación, junto con la documentación base. Sin compromiso, sin cifras genéricas, sin promesas.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 16 }}>
                <strong>Lo que pasa después.</strong> Un asesor revisa su solicitud en 48 horas hábiles. Si el perfil encaja con algún proyecto, agendamos una llamada. Si no encaja, también se lo decimos.
              </p>
            </div>
            <aside aria-label="Formulario de solicitud de resumen" style={{ background: "var(--color-cream)", border: "1px solid var(--color-ink-100)", borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 24, marginBottom: 8 }}>Cuéntenos sobre su interés</h3>
              <p style={{ fontSize: 14, color: "var(--color-ink-500)", marginBottom: 24 }}>48 horas hábiles · sin compromiso</p>
              <form action="#" method="post" noValidate>
                <Field label="Su nombre" name="nombre" placeholder="Nombre completo" required />
                <Field label="Correo electrónico" name="correo" type="email" placeholder="nombre@empresa.com" required />
                <Field label="Teléfono con lada" name="telefono" type="tel" placeholder="55 1234 5678" required />
                <SelectField label="Monto aproximado con el que participaría" name="monto" options={["Hasta $1,000,000 MXN", "$1,000,000 – $5,000,000 MXN", "$5,000,000 – $20,000,000 MXN", "Más de $20,000,000 MXN", "Prefiero no decirlo"]} />
                <SelectField label="Proyecto de su interés" name="proyecto" options={["Panorama Algarín · CDMX", "Residencial Fraile · EdoMex", "Itzaé · Tulum", "Todos los vigentes"]} />
                <button type="submit" className="btn btn--primary btn--lg" style={{ width: "100%", marginTop: 8 }}>
                  Solicitar el resumen
                </button>
                <p style={{ fontSize: 12, color: "var(--color-ink-500)", marginTop: 12, lineHeight: 1.5 }}>
                  Al enviar, acepta nuestro <a href="/aviso-de-privacidad" style={{ textDecoration: "underline" }}>aviso de privacidad</a>. Su información no se comparte con terceros.
                </p>
              </form>
            </aside>
          </div>
        </div>
        <style>{`@media (min-width: 1024px) { .revelation { grid-template-columns: 1.1fr 1fr !important; gap: 80px !important; } }`}</style>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-ink-900)", marginBottom: 6 }}>{label}{required && <span style={{ color: "var(--color-danger)" }}> *</span>}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} required={required} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-ink-300)", borderRadius: 8, fontSize: 16, fontFamily: "inherit", background: "white" }} />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-ink-900)", marginBottom: 6 }}>{label}</label>
      <select id={name} name={name} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-ink-300)", borderRadius: 8, fontSize: 16, fontFamily: "inherit", background: "white" }}>
        <option value="">Seleccione una opción</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
