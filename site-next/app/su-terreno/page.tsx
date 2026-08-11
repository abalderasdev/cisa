import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aportar su terreno | Grupo CISA · Su terreno puede producir sin venderse",
  description:
    "Si tiene un terreno urbano o periurbano, puede aportarlo a un desarrollo y conservar participación. La revisión inicial es sin costo y no lo compromete.",
};

const DOLOR = [
  "Llega el predial cada año por algo que no genera un peso.",
  "Un corredor le ofreció una cifra que se sintió como la mitad de lo que vale, y aun así estuvo tentado a aceptarla.",
  "Lo heredaron entre varios y la conversación termina siempre igual: en nada, o en discusión.",
  "El letrero de \"se vende\" lleva tanto tiempo puesto que ya se decoloró.",
  "Tiene la carpeta con las escrituras, pero nadie ha revisado qué permite construir el uso de suelo.",
];

const STEPS = [
  { num: "01", title: "Aportación del terreno", desc: "Se define qué aporta cada parte y bajo qué figura.", time: "2–4 SEMANAS" },
  { num: "02", title: "Conceptualización y factibilidad", desc: "Qué se puede construir ahí y si tiene sentido económico.", time: "4–8 SEMANAS" },
  { num: "03", title: "Proyecto arquitectónico", desc: "El desarrollo toma forma y superficie vendible.", time: "2–4 MESES" },
  { num: "04", title: "Esquema legal", desc: "Contratos, permisos y licencias.", time: "3–6 MESES" },
  { num: "05", title: "Esquema financiero", desc: "Cómo se financia la obra y cómo se reparte el resultado.", time: "2–3 MESES" },
  { num: "06", title: "Construcción", desc: "Obra con avance documentado y fechado.", time: "12–24 MESES" },
  { num: "07", title: "Preventa y entrega", desc: "Comercialización y escrituración.", time: "3–6 MESES" },
];

const FAQS = [
  { q: "¿Tengo que pagar algo para empezar?", a: "No. La revisión de factibilidad preliminar es sin costo. Si el proyecto avanza, los costos quedan definidos por escrito antes de que usted firme nada." },
  { q: "¿Pierdo la propiedad de mi terreno?", a: "No la vende. Se formaliza una figura jurídica en la que su aportación queda reconocida y protegida, con lo que recibe definido desde el inicio." },
  { q: "¿Y si no me gusta el proyecto que proponen?", a: "La factibilidad y el proyecto se presentan antes de comprometer el terreno. Si no le convence, no avanza y no debe nada." },
  { q: "¿Qué pasa si las unidades no se venden?", a: "El riesgo comercial existe. Cómo se maneja queda escrito en el acuerdo desde el inicio. La preventa se trabaja desde el día uno para reducirlo." },
  { q: "El terreno es de varios herederos. ¿Se puede?", a: "Sí, es uno de los casos más frecuentes. Se requiere que la sucesión esté resuelta o en proceso, y que haya acuerdo entre los propietarios. Podemos orientarle sobre qué hace falta." },
  { q: "No sé cuál es el uso de suelo de mi terreno.", a: "La mayoría no lo sabe. Lo revisamos nosotros: forma parte de la factibilidad preliminar sin costo." },
  { q: "¿Quién construye?", a: "Grupo CISA. No subcontratamos la responsabilidad del desarrollo: diseñamos, gestionamos, construimos y comercializamos." },
  { q: "¿Cuánto tiempo tengo que esperar para recibir algo?", a: "Un desarrollo se mide en años. Desde la factibilidad le damos el calendario estimado por etapa y el avance queda documentado con fecha." },
];

export default function SuTerrenoPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title" style={{ background: "var(--color-bg-page)", paddingTop: 32, paddingBottom: 0, overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "24px 0", marginBottom: 48, flexWrap: "wrap" }}>
            <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", display: "inline-block" }} />
              PARA DUEÑOS DE TERRENO · 45–70 AÑOS
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-ink-700)", letterSpacing: "0.05em" }}>PRIMERA REVISIÓN SIN COSTO</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 64, alignItems: "center" }} className="hero__main">
            <div>
              <h1 id="hero-title">
                Su terreno no tiene que venderse para <span style={{ textDecoration: "underline", textDecorationColor: "var(--color-brand-green-light)", textUnderlineOffset: 8 }}>empezar a producir</span>.
              </h1>
              <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--color-ink-700)", margin: "32px 0", maxWidth: 620 }}>
                Aportarlo a un desarrollo le puede dejar metros construidos en lugar de una sola venta. El primer paso no cuesta nada y no lo compromete a nada: saber qué se puede construir ahí.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 56 }}>
                <a href="#precalificar" className="btn btn--primary btn--lg">Precalificar mi terreno</a>
                <a href="#metodo" className="btn btn--secondary--green btn--lg">Conocer el proceso ↓</a>
              </div>

              <div role="list" aria-label="Datos clave" style={{ display: "flex", gap: 32, flexWrap: "wrap", padding: "20px 0", borderTop: "1px solid var(--color-ink-100)" }}>
                <ProofItem value="3 min" label="Precalificación" />
                <ProofDivider />
                <ProofItem value="48 h" label="Respuesta hábiles" />
                <ProofDivider />
                <ProofItem value="Gratis" label="Sin costo inicial" />
                <ProofDivider />
                <ProofItem value="0" label="Compromisos" />
              </div>
            </div>

            <div aria-hidden="true" style={{ position: "relative", aspectRatio: "1/1", maxWidth: 560, margin: "0 auto", width: "100%" }}>
              <TerrainPolygon />
            </div>
          </div>
        </div>
      </section>

      {/* DOLOR EN ESCENAS */}
      <section className="section section--alt" aria-labelledby="dolor-title">
        <div className="container">
          <header className="section-header">
            <h2 id="dolor-title">Si tiene un terreno detenido, seguramente ya vivió alguna de estas escenas.</h2>
            <p>Ninguna de estas escenas significa que el terreno sea malo. Casi siempre significa que le han ofrecido la salida equivocada.</p>
          </header>
          <ol role="list" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }} className="dolor__list">
            {DOLOR.map((d, i) => (
              <li key={i} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
                <span className="num" style={{ fontSize: 32, fontWeight: 800, color: "var(--color-brand-green)", lineHeight: 1, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--color-ink-700)" }}>{d}</p>
              </li>
            ))}
          </ol>
        </div>
        <style>{`@media (min-width: 768px) { .dolor__list { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </section>

      {/* HISTORIA / TESTIMONIO PENDIENTE */}
      <section className="section" aria-labelledby="star-title">
        <div className="container">
          <header className="section-header">
            <h2 id="star-title">Una historia que ya ocurrió.</h2>
            <p>Un propietario que ya aportó su terreno y hoy tiene departamentos. Un testimonio de la empresa, en palabras del propietario, con su autorización.</p>
          </header>
          <article style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, background: "var(--color-cream)", border: "1px solid var(--color-ink-100)", borderRadius: 16, overflow: "hidden" }} className="star">
            <div aria-hidden="true" style={{ background: "var(--color-bg-section)", aspectRatio: "16/10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, position: "relative" }}>
              <span className="mono" style={{ padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: "rgba(180,83,9,0.10)", color: "var(--color-warning)" }}>[BLOQUE PENDIENTE — TESTIMONIO REAL]</span>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-green-dark)" strokeWidth={1}>
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              </svg>
            </div>
            <div style={{ padding: 32 }}>
              <blockquote style={{ borderLeft: "3px solid var(--color-brand-green-dark)", paddingLeft: 24, margin: 0, marginBottom: 24 }}>
                <p style={{ fontSize: 20, lineHeight: 1.5, color: "var(--color-ink-900)", fontWeight: 500 }}>
                  «[Nombre] tenía un terreno de [superficie] en [zona] detenido desde [año]. Le habían ofrecido [situación]. Hoy tiene [qué recibió].»
                </p>
              </blockquote>
              <p style={{ fontSize: 15, color: "var(--color-ink-500)", lineHeight: 1.6, fontStyle: "italic" }}>
                Mientras no exista un testimonio autorizado, este bloque lo ocupa el director de Grupo CISA contando por qué la empresa opera bajo este modelo y qué vio en el mercado que lo hizo necesario. Un testimonio de propietario convierte varias veces más. Es el insumo más valioso pendiente de todo el proyecto.
              </p>
            </div>
          </article>
        </div>
        <style>{`@media (min-width: 1024px) { .star { grid-template-columns: 1fr 1.2fr !important; } }`}</style>
      </section>

      {/* DOS OPCIONES vs APORTAR */}
      <section className="section section--alt" aria-labelledby="opciones-title">
        <div className="container">
          <header className="section-header">
            <h2 id="opciones-title">Las dos opciones que le han dado no son las únicas.</h2>
            <p>Una es la rápida, otra es la que parece segura. Hay una tercera que casi nadie le ofrece, porque exige que del otro lado haya quien sepa desarrollar, no solo comprar.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="opciones__grid">
            <article style={{ background: "white", border: "1.5px solid var(--color-ink-100)", borderRadius: 16, padding: 32 }}>
              <h3>Vender.</h3>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--color-ink-700)", marginTop: 12 }}>Recibe dinero una vez, y el valor que se genere después ya no es suyo. Es la opción rápida y casi siempre la más cara en el largo plazo.</p>
            </article>
            <article style={{ background: "white", border: "1.5px solid var(--color-ink-100)", borderRadius: 16, padding: 32 }}>
              <h3>Esperar.</h3>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--color-ink-700)", marginTop: 12 }}>Conserva el activo, paga predial cada año y apuesta a que la zona mejore sola. Puede funcionar. También puede tardar una generación.</p>
            </article>
            <article style={{ background: "var(--color-bg-dark)", color: "rgba(255,255,255,0.92)", border: "1.5px solid var(--color-bg-dark)", borderRadius: 16, padding: 32, position: "relative" }}>
              <span className="mono" style={{ position: "absolute", top: 16, right: 16, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", background: "var(--color-brand-green-light)", color: "var(--color-bg-dark)" }}>La tercera vía</span>
              <h3 style={{ color: "white" }}>Aportar.</h3>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,0.85)", marginTop: 12 }}>No vende el terreno: lo integra a un desarrollo. Alguien más pone el capital, el proyecto y la ejecución, y usted recibe metros construidos y participación en el resultado.</p>
            </article>
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .opciones__grid { grid-template-columns: 1fr 1fr 1fr !important; } }`}</style>
      </section>

      {/* QUÉ SIGNIFICA APORTAR */}
      <section className="section" aria-labelledby="aportar-title">
        <div className="container">
          <header className="section-header">
            <h2 id="aportar-title">Qué significa aportar su terreno.</h2>
            <p>En una palabra: su predio entra al proyecto como parte del capital, en lugar de venderse.</p>
          </header>
          <div style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.65, color: "var(--color-ink-700)" }}>
            <p style={{ marginBottom: 16 }}>
              Aportar significa que su predio entra al proyecto como parte del capital, en lugar de venderse. Se formaliza bajo una figura jurídica que deja por escrito, <strong style={{ color: "var(--color-ink-900)" }}>antes de mover una sola piedra</strong>, qué aporta cada parte, qué recibe cada parte y bajo qué condiciones.
            </p>
            <p style={{ marginBottom: 16 }}>
              A partir de ahí, Grupo CISA se encarga de todo el desarrollo: estudia qué se puede construir, diseña el proyecto, gestiona permisos y licencias, arma el esquema financiero, construye y comercializa.
            </p>
            <p>
              Cuando el desarrollo se termina, usted no recibe el precio de un terreno. Recibe la parte del proyecto que se acordó desde el principio: departamentos, locales o la participación que se haya definido.
            </p>
          </div>
        </div>
      </section>

      {/* FACTORES */}
      <section className="section section--alt" aria-labelledby="factores-title">
        <div className="container">
          <header className="section-header">
            <h2 id="factores-title">Cómo se define lo que le corresponde.</h2>
            <p>No hay una fórmula única, y desconfíe de quien le dé un porcentaje sin haber visto el predio. Lo que sí es fijo son los cuatro factores que lo determinan.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="factores__grid">
            {[
              { title: "Ubicación.", desc: "Define el precio de venta por metro cuadrado del producto final, y por lo tanto todo lo demás." },
              { title: "Uso de suelo.", desc: "Cuántos niveles y cuánta superficie permite construir. Dos terrenos idénticos con usos distintos valen cosas muy distintas." },
              { title: "Superficie aprovechable.", desc: "No es lo mismo la superficie del predio que la que realmente se puede construir, después de restricciones, retiros y accesos." },
              { title: "Situación jurídica.", desc: "Un predio escriturado y libre de gravamen avanza; uno en sucesión o en copropiedad primero se regulariza." },
            ].map((f) => (
              <article key={f.title} style={{ background: "white", border: "1px solid var(--color-ink-100)", borderRadius: 12, padding: 24 }}>
                <h3 style={{ color: "var(--color-brand-green-dark)", fontSize: 22, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--color-ink-700)", fontSize: 16, lineHeight: 1.5 }}>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
        <style>{`@media (min-width: 768px) { .factores__grid { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .factores__grid { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      </section>

      {/* 7 ETAPAS */}
      <section className="section" id="metodo" aria-labelledby="etapas-title">
        <div className="container">
          <header className="section-header">
            <h2 id="etapas-title">Siete etapas. Le entregamos el rango de tiempo en la primera entrevista.</h2>
            <p>Publicamos las etapas porque la opacidad es lo que más cuesta. Estos rangos son indicativos y se afinan proyecto por proyecto.</p>
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
        <style>{`@media (min-width: 768px) { .su-terreno ol[role="list"] { grid-template-columns: 1fr 1fr !important; } } @media (min-width: 1024px) { .su-terreno ol[role="list"] { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      </section>

      {/* QUÉ APLICA */}
      <section className="section section--alt" aria-labelledby="aplican-title">
        <div className="container">
          <header className="section-header">
            <h2 id="aplican-title">Qué terrenos sí podemos trabajar, y cuáles hoy no.</h2>
            <p>Decir a quién no le sirve genera más confianza que prometer que sirve para todos. Si su terreno no aplica, se lo decimos en la primera revisión.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="aplican__grid">
            <article style={{ background: "rgba(22,163,74,0.04)", border: "1.5px solid rgba(22,163,74,0.30)", borderRadius: 12, padding: 32 }}>
              <h3 style={{ color: "var(--color-success)", fontSize: 20, marginBottom: 16 }}>Sí trabajamos con predios que</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["Estén en zonas donde Grupo CISA opera (CDMX, EdoMex, QRO, QROO, GDL, MID, CUN).", "Tengan al menos la superficie mínima que el proyecto requiere.", "Cuenten con uso de suelo que permita usos habitacionales o mixtos.", "Tengan situación jurídica clara o regularizable."].map((it) => (
                  <li key={it} style={{ paddingLeft: 28, position: "relative", fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, top: 0, color: "var(--color-success)", fontWeight: 700 }}>✓</span>{it}
                  </li>
                ))}
              </ul>
            </article>
            <article style={{ background: "rgba(180,83,9,0.04)", border: "1.5px solid rgba(180,83,9,0.30)", borderRadius: 12, padding: 32 }}>
              <h3 style={{ color: "var(--color-warning)", fontSize: 20, marginBottom: 16 }}>Hoy no podemos avanzar con predios</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["En litigio activo o con gravámenes no regularizables.", "En régimen de propiedad que no permita aportación.", "Con superficie muy por debajo del mínimo viable del proyecto.", "Sin acceso a servicios o sin uso de suelo compatible."].map((it) => (
                  <li key={it} style={{ paddingLeft: 28, position: "relative", fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, top: 0, color: "var(--color-warning)", fontWeight: 700 }}>—</span>{it}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
        <style>{`@media (min-width: 1024px) { .aplican__grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </section>

      {/* FAQ / OBJECIONES */}
      <section className="section" id="precalificar" aria-labelledby="faq-title">
        <div className="container">
          <header className="section-header">
            <h2 id="faq-title">Lo que todos preguntan antes de dar el primer paso.</h2>
            <p>Las objeciones del mensaje maestro, una por una, sin esconderlas.</p>
          </header>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((f, i) => (
              <details key={i} style={{ borderTop: "1px solid var(--color-ink-100)" }}>
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
            <h2 id="closing-title" style={{ color: "white" }}>No tiene que decidir hoy si lo aporta. Solo saber qué podría construirse en él.</h2>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>La precalificación toma tres minutos, no tiene costo y no lo compromete. Si su terreno entra en el perfil que desarrollamos, le enviamos una revisión preliminar en 48 horas hábiles. Si no entra, también se lo decimos.</p>
          </header>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 64 }} className="closing__grid">
            <div style={{ padding: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12 }}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Si quiere empezar por el formulario</h4>
              <a href="#precalificar" className="btn btn--primary-dark btn--lg">Precalificar mi terreno</a>
            </div>
            <div style={{ padding: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12 }}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Si prefiere hablar con alguien</h4>
              <a href="https://wa.me/525517964940?text=Hola%2C%20quiero%20revisar%20el%20potencial%20de%20mi%20terreno." className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">Escríbanos por WhatsApp</a>
            </div>
            <div style={{ padding: 32, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12 }}>
              <h4 style={{ color: "white", marginBottom: 16 }}>Si quiere atención inmediata</h4>
              <a href="https://wa.me/525517964940?text=Hola%2C%20vengo%20del%20sitio%20de%20Grupo%20CISA%20y%20quiero%20informaci%C3%B3n." className="btn btn--primary-dark btn--lg" target="_blank" rel="noopener noreferrer">Hablar con el agente</a>
            </div>
          </div>
          <ClosingContact />
        </div>
        <style>{`@media (min-width: 768px) { .closing__grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
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

function TerrainPolygon() {
  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <polygon points="80,360 160,200 290,180 380,240 400,360 240,400" fill="#E8F5E9" stroke="#1F4D2A" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="290,180 340,140 430,160 380,240" fill="#8BC34A" fillOpacity="0.55" stroke="#1F4D2A" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="380,240 430,160 450,300 400,360" fill="#2E7D32" fillOpacity="0.40" stroke="#1F4D2A" strokeWidth="1.5" strokeLinejoin="round" />
      <g stroke="#1F4D2A" strokeWidth="0.6" strokeDasharray="2,3" opacity="0.5">
        <line x1="160" y1="200" x2="160" y2="360" /><line x1="240" y1="180" x2="240" y2="400" /><line x1="80" y1="280" x2="400" y2="280" />
      </g>
      <g fill="#1F4D2A">
        <circle cx="80" cy="360" r="5" /><circle cx="160" cy="200" r="5" /><circle cx="290" cy="180" r="5" />
        <circle cx="380" cy="240" r="5" /><circle cx="400" cy="360" r="5" /><circle cx="240" cy="400" r="5" />
      </g>
      <g fill="white" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" textAnchor="middle">
        <text x="80" y="364">01</text><text x="160" y="204">02</text><text x="290" y="184">03</text>
        <text x="380" y="244">04</text><text x="400" y="364">05</text><text x="240" y="404">06</text>
      </g>
    </svg>
  );
}

function ClosingContact() {
  return (
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
  );
}
