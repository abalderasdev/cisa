import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Grupo CISA · WhatsApp, teléfono y oficinas",
  description: "WhatsApp, teléfono, correo y oficinas de Grupo CISA. Respuesta en 48 horas hábiles.",
};

export default function ContactoPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title" style={{ background: "var(--color-bg-page)", paddingTop: 32, paddingBottom: 0 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "24px 0", marginBottom: 48, flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              CONTACTO DIRECTO
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>48 HORAS HÁBILES</span>
          </div>

          <div style={{ maxWidth: 880, marginBottom: 64 }}>
            <h1 id="hero-title">
              Cualquier <span style={{ textDecoration: "underline", textDecorationColor: "var(--color-brand-green-light)", textUnderlineOffset: 8 }}>canal</span>, mismo equipo.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--color-ink-700)", margin: "32px 0", maxWidth: 760 }}>
              WhatsApp, teléfono, correo o el formulario. La consulta llega al mismo equipo comercial y se responde en 48 horas hábiles.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="https://wa.me/525517964940?text=Hola%2C%20vengo%20del%20sitio%20de%20Grupo%20CISA%20y%20quiero%20informaci%C3%B3n." className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginRight: 6 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Escribir por WhatsApp
              </a>
              <a href="#form" className="btn btn--secondary--green btn--lg">Enviar formulario</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CONTACT CARDS */}
      <section className="section" aria-labelledby="canales-title">
        <div className="container">
          <header className="section-header">
            <h2 id="canales-title">Tres canales, una sola respuesta.</h2>
            <p>Elija el que prefiera. La consulta llega al mismo equipo comercial.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="contact-grid">
            <article style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 32 }}>
              <div aria-hidden="true" style={{ width: 48, height: 48, marginBottom: 16, background: "var(--color-brand-green-tint)", color: "var(--color-brand-green-dark)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h3>Oficinas</h3>
              <p style={{ marginTop: 12, color: "var(--color-ink-700)", fontSize: 15, lineHeight: 1.6 }}>Circuito Circunvalación Poniente No. 16, Local V-W</p>
              <p style={{ color: "var(--color-ink-700)", fontSize: 15, lineHeight: 1.6 }}>Ciudad Satélite, Naucalpan, Estado de México C.P. 53100</p>
              <p style={{ fontSize: 14, color: "var(--color-ink-500)", marginTop: 16 }}><strong style={{ color: "var(--color-ink-900)" }}>Horario:</strong> Lunes a viernes, 9:00 a 18:00. WhatsApp en horario extendido.</p>
            </article>

            <article style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 32 }}>
              <div aria-hidden="true" style={{ width: 48, height: 48, marginBottom: 16, background: "var(--color-whatsapp)", color: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" /></svg>
              </div>
              <h3>WhatsApp · Teléfono</h3>
              <p style={{ marginTop: 12 }}><strong style={{ color: "var(--color-ink-900)" }}>WhatsApp:</strong> <a href="https://wa.me/525517964940" style={{ color: "var(--color-brand-green-dark)", textDecoration: "underline" }}>55 1796 4940</a></p>
              <p><strong style={{ color: "var(--color-ink-900)" }}>Tel principal:</strong> <a href="tel:+525517964940" style={{ color: "var(--color-ink-700)" }}>55 1796 4940</a></p>
              <p><strong style={{ color: "var(--color-ink-900)" }}>Tel alterno:</strong> <a href="tel:+525553613771" style={{ color: "var(--color-ink-700)" }}>55 5361 3771</a> ext. 251 o 237</p>
              <p style={{ fontSize: 14, color: "var(--color-ink-500)", marginTop: 16 }}><strong style={{ color: "var(--color-ink-900)" }}>Correo:</strong> <a href="mailto:contacto@grupocisa.mx" style={{ color: "var(--color-brand-green-dark)" }}>contacto@grupocisa.mx</a></p>
            </article>

            <article style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 32 }}>
              <div aria-hidden="true" style={{ width: 48, height: 48, marginBottom: 16, background: "var(--color-brand-green-tint)", color: "var(--color-brand-green-dark)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <h3>Redes sociales</h3>
              <p style={{ marginTop: 12 }}><a href="https://instagram.com/grupocisamx" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-brand-green-dark)", textDecoration: "underline" }}>Instagram · @grupocisamx</a></p>
              <p><a href="https://facebook.com/grupocisamx" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-brand-green-dark)", textDecoration: "underline" }}>Facebook · /grupocisamx</a></p>
              <p><a href="https://linkedin.com/company/grupocisa" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-brand-green-dark)", textDecoration: "underline" }}>LinkedIn · /company/grupocisa</a></p>
              <p style={{ fontSize: 14, color: "var(--color-ink-500)", marginTop: 16, fontStyle: "italic" }}>[URLs por confirmar con CISA]</p>
            </article>
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .contact-grid { grid-template-columns: 1fr 1fr 1fr !important; } }`}</style>
      </section>

      {/* FORMULARIO GENERAL */}
      <section className="section section--alt" id="form" aria-labelledby="form-title">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 64 }} className="revelation">
            <div>
              <h2 id="form-title">O si prefiere, escríbanos por aquí.</h2>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 24 }}>
                Si el formulario no le convence, ignore esta sección. WhatsApp y teléfono están arriba. Este canal es para consultas que no requieren respuesta inmediata.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--color-ink-700)", marginTop: 16 }}>
                <strong>Lo que pasa después.</strong> Recibimos su mensaje, lo revisamos y le respondemos en 48 horas hábiles. Si requiere atención inmediata, use WhatsApp.
              </p>
            </div>
            <aside aria-label="Formulario de contacto general" style={{ background: "var(--color-cream)", border: "1px solid var(--color-ink-100)", borderRadius: 16, padding: 32 }}>
              <h3 style={{ fontSize: 24, marginBottom: 8 }}>Su mensaje</h3>
              <p style={{ fontSize: 14, color: "var(--color-ink-500)", marginBottom: 24 }}>48 horas hábiles · sin spam</p>
              <form action="#" method="post" noValidate>
                <Field label="Su nombre" name="nombre" placeholder="Nombre completo" required />
                <Field label="Correo electrónico" name="correo" type="email" placeholder="nombre@empresa.com" required />
                <Field label="Teléfono con lada (opcional)" name="telefono" type="tel" placeholder="55 1234 5678" />
                <SelectField label="¿Sobre qué es la consulta?" name="interes" options={["Aportar un terreno", "Inversión en proyectos", "Construcción por encargo", "Información de un desarrollo", "Trabajar con nosotros", "Prensa o comunicación", "Otro"]} />
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="mensaje" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--color-ink-900)", marginBottom: 6 }}>Su mensaje <span style={{ color: "var(--color-danger)" }}>*</span></label>
                  <textarea id="mensaje" name="mensaje" rows={4} placeholder="Cuéntenos brevemente en qué podemos ayudar" required style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--color-ink-300)", borderRadius: 8, fontSize: 16, fontFamily: "inherit", background: "white", resize: "vertical" }} />
                </div>
                <button type="submit" className="btn btn--primary btn--lg" style={{ width: "100%", marginTop: 8 }}>
                  Enviar mensaje
                </button>
                <p style={{ fontSize: 12, color: "var(--color-ink-500)", marginTop: 12, lineHeight: 1.5 }}>
                  Al enviar, acepta nuestro <a href="/aviso-de-privacidad" style={{ textDecoration: "underline" }}>aviso de privacidad</a>.
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
