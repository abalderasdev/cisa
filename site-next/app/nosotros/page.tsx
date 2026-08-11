import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | Grupo CISA · 30 años en desarrollo inmobiliario",
  description: "Una empresa mexicana de desarrollo e inversión inmobiliaria. 30 años en el mercado. Operamos en CDMX, EdoMex, Querétaro, Quintana Roo, Guadalajara, Mérida y Cancún.",
};

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

const ROLES = ["Director general", "Originación", "Arquitectura", "Construcción", "Comercialización"];

const ALIADOS = ["CARVID", "Péndulo", "Capitalta", "Kimbra", "Fundación Nuestra Historia", "ISO 9001:2015"];

export default function NosotrosPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title" style={{ background: "var(--color-bg-page)", paddingTop: 32, paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "24px 0", marginBottom: 48, flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              GRUPO CISA · 30 AÑOS
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>DESDE 1994</span>
          </div>

          <div style={{ maxWidth: 880, marginBottom: 64 }}>
            <h1 id="hero-title">
              Una empresa mexicana de <span style={{ color: "var(--color-brand-green-dark)" }}>desarrollo e inversión inmobiliaria</span>.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--color-ink-700)", margin: "32px 0", maxWidth: 760 }}>
              Reunimos análisis, diseño, gestión, construcción y comercialización en un mismo proceso. Operamos en CDMX, Estado de México, Querétaro, Quintana Roo, Guadalajara, Mérida y Cancún.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#metodo" className="btn btn--primary btn--lg">Conocer el proceso</a>
              <a href="https://wa.me/525517964940?text=Hola%2C%20quiero%20conocer%20m%C3%A1s%20sobre%20Grupo%20CISA." className="btn btn--secondary--green btn--lg" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ SÍ Y QUÉ NO */}
      <section className="section" aria-labelledby="que-title">
        <div className="container">
          <header className="section-header">
            <h2 id="que-title">Qué hacemos y qué no.</h2>
            <p>Lo que hacemos es la mitad. La otra mitad es lo que decidimos no hacer, porque la claridad cuesta más cuando se firma.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="aplican__grid">
            <article style={{ background: "rgba(22,163,74,0.04)", border: "1.5px solid rgba(22,163,74,0.30)", borderRadius: 12, padding: 32 }}>
              <h3 style={{ color: "var(--color-success)", fontSize: 22, marginBottom: 16 }}>Lo que sí hacemos</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["Diseño, gestión, construcción y comercialización de desarrollos propios.", "Aportación de terrenos bajo figura jurídica con reglas escritas.", "Co-desarrollo con socios de capital, evaluando proyecto por proyecto.", "Construcción por encargo para clientes con proyecto y licencias propias.", "Comercialización de unidades en preventa o entrega inmediata."].map((it) => (
                  <li key={it} style={{ paddingLeft: 28, position: "relative", fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>{it}
                  </li>
                ))}
              </ul>
            </article>
            <article style={{ background: "rgba(180,83,9,0.04)", border: "1.5px solid rgba(180,83,9,0.30)", borderRadius: 12, padding: 32 }}>
              <h3 style={{ color: "var(--color-warning)", fontSize: 22, marginBottom: 16 }}>Lo que no hacemos</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["Promesas de rendimiento, plusvalía o retorno sin factibilidad.", "Asesoría legal, fiscal o financiera personalizada fuera del proyecto.", "Comercialización de proyectos de terceros sin validación interna.", "Subcontratación completa de la responsabilidad del desarrollo.", "Uso de marcas registradas de aliados sin su autorización escrita."].map((it) => (
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

      {/* MÉTODO 8 ETAPAS */}
      <section className="section section--alt" id="metodo" aria-labelledby="method-title">
        <div className="container">
          <header className="section-header">
            <h2 id="method-title">El método abierto. Ocho etapas, con tiempo y entregable.</h2>
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
        <style>{`@media (min-width: 768px) { .nosotros ol[role="list"] { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .nosotros ol[role="list"] { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      </section>

      {/* EQUIPO */}
      <section className="section" id="equipo" aria-labelledby="equipo-title">
        <div className="container">
          <header className="section-header">
            <h2 id="equipo-title">Detrás de cada proyecto hay nombres, no un logotipo.</h2>
            <p>Un desarrollo es una relación de años. Conviene saber con quién la está empezando.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="team">
            {ROLES.map((role) => (
              <div key={role} style={{ background: "var(--color-bg-section)", borderRadius: 12, padding: 24, textAlign: "center" }}>
                <div aria-hidden="true" style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: "50%", background: "var(--color-ink-200)", color: "var(--color-ink-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>[NM]</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>[Nombre]</h4>
                <div style={{ fontSize: 13, color: "var(--color-ink-500)" }}>{role}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--color-ink-500)", textAlign: "center", marginTop: 24, fontStyle: "italic" }}>[Bloque pendiente — CISA debe confirmar nombres, cargos y fotos]</p>
        </div>
        <style>{`@media (min-width: 640px) { .team { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .team { grid-template-columns: repeat(5, 1fr) !important; } }`}</style>
      </section>

      {/* ALIADOS */}
      <section className="section section--dark" aria-labelledby="allies-title">
        <div className="container">
          <header style={{ textAlign: "center", marginInline: "auto", marginBottom: 32, maxWidth: 760 }}>
            <h2 id="allies-title" style={{ color: "white" }}>Aliados que participan según la necesidad de cada proyecto.</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginTop: 16 }}>CARVID, Péndulo Arquitectos, Capitalta, Kimbra, Fundación Nuestra Historia. Más la certificación ISO 9001:2015 del proceso.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }} className="allies__grid">
            {ALIADOS.map((a) => (
              <div key={a} style={{ padding: "20px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12, textAlign: "center", color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em" }}>{a}</div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 14, fontStyle: "italic" }}>
            Alianzas que nos permiten ejecutar con el mismo estándar en cualquier ciudad del país.
          </p>
        </div>
        <style>{`@media (min-width: 768px) { .allies__grid { grid-template-columns: repeat(6, 1fr) !important; } }`}</style>
      </section>

      {/* CTA FINAL */}
      <section className="section" aria-labelledby="cta-title">
        <div className="container">
          <header className="section-header section--center" style={{ marginInline: "auto", textAlign: "center", marginBottom: 32 }}>
            <h2 id="cta-title">¿Quiere saber si su caso aplica con nosotros?</h2>
            <p>Sin compromiso inicial. Le respondemos en 48 horas hábiles.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 32 }} className="closing__grid">
            <div style={{ padding: 32, background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12 }}>
              <h4 style={{ marginBottom: 16 }}>Si tiene un terreno</h4>
              <Link href="/su-terreno" className="btn btn--primary btn--lg">Precalificar mi terreno</Link>
            </div>
            <div style={{ padding: 32, background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12 }}>
              <h4 style={{ marginBottom: 16 }}>Si tiene capital para participar</h4>
              <Link href="/inversion" className="btn btn--primary btn--lg">Ver proyectos abiertos</Link>
            </div>
            <div style={{ padding: 32, background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12 }}>
              <h4 style={{ marginBottom: 16 }}>Si quiere atención inmediata</h4>
              <a href="https://wa.me/525517964940?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Grupo%20CISA." className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
            </div>
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .closing__grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
      </section>
    </>
  );
}
