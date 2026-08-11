import Link from "next/link";

const COL_EMPRESA = [
  { href: "/nosotros", label: "Equipo" },
  { href: "/nosotros#metodo", label: "El proceso" },
  { href: "/nosotros#asistente", label: "Asistente" },
  { href: "/contacto", label: "Preguntas frecuentes" },
];

const COL_SERVICIOS = [
  { href: "/su-terreno", label: "Aportar terreno" },
  { href: "/desarrollos", label: "Co-desarrollo" },
  { href: "/desarrollos", label: "Construcción" },
  { href: "/inversion", label: "Inversión" },
];

const COL_CONTACTO = [
  { href: "https://wa.me/525517964940", label: "WhatsApp", external: true },
  { href: "https://instagram.com/grupocisamx", label: "Instagram", external: true },
  { href: "https://facebook.com/grupocisamx", label: "Facebook", external: true },
  { href: "https://linkedin.com/company/grupocisa", label: "LinkedIn", external: true },
  { href: "/contacto", label: "Aviso de privacidad" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer section--dark" style={{ padding: "80px 0 40px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }} className="footer-grid">
          <div>
            <img src="/logo-grupo-cisa-dark.svg" alt="Grupo CISA" width={120} height={42} style={{ marginBottom: 16, filter: "brightness(0) invert(1)" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.6, maxWidth: 360 }}>
              Desarrollo e inversión inmobiliaria. 30 años en el mercado. Sede en Ciudad Satélite, Estado de México.
            </p>
          </div>

          <FooterCol title="EMPRESA" items={COL_EMPRESA} />
          <FooterCol title="SERVICIOS" items={COL_SERVICIOS} />
          <FooterCol title="CONTACTO" items={COL_CONTACTO} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            © 2026 Grupo CISA. Todos los derechos reservados.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            Plataforma desarrollada por <strong style={{ color: "white" }}>ABDev</strong>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { href: string; label: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 style={{ color: "white", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
        {title}
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it) => (
          <li key={it.label}>
            {it.external ? (
              <a href={it.href} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, transition: "color 150ms" }}>
                {it.label}
              </a>
            ) : (
              <Link href={it.href} style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, transition: "color 150ms" }}>
                {it.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
