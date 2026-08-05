import Container from '../shared/Container'

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container className="py-16">
        <div className="footer-grid">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="brand-orbit" aria-hidden="true" />
              <strong className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-fg)]">
                GRUPO CISA
              </strong>
            </div>
            <p style={{ maxWidth: '34ch' }}>
              Desarrollo e inversión inmobiliaria en México. Modelo de aportación,
              co-desarrollo y preventa.
            </p>
          </div>

          <div>
            <h5>Visitar</h5>
            <ul>
              <li>Circuito Circunvalación Poniente 16</li>
              <li>Local V-W · Ciudad Satélite</li>
              <li>Naucalpan, Estado de México 53100</li>
            </ul>
          </div>

          <div>
            <h5>Contactar</h5>
            <ul>
              <li><a href="tel:+525517964940">55 1796 4940</a></li>
              <li><a href="https://wa.me/5215517964940" target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><a href="mailto:contacto@gcisa.mx">contacto@gcisa.mx</a></li>
            </ul>
          </div>

          <div>
            <h5>Plataforma</h5>
            <ul>
              <li><a href="#rutas">Cómo trabajar</a></li>
              <li><a href="#desarrollos">Desarrollos</a></li>
              <li><a href="#metodo">Método</a></li>
              <li><a href="#contacto">Precalificar terreno</a></li>
              <li><a href="/direcciones">Ver direcciones de arte</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-meta">
          <span>© 2026 Grupo CISA · ABDev</span>
          <span>Certificación ISO 9001:2015 · por confirmar</span>
          <span><a href="/aviso-de-privacidad">Aviso de privacidad</a></span>
        </div>
      </Container>
    </footer>
  )
}
