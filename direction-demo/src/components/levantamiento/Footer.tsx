import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg)]">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img
              src="/brand/logo-mono.svg"
              alt="Grupo CISA"
              className="h-12 w-auto text-[var(--color-fg)]"
            />
            <p className="mt-3 text-sm text-[var(--color-fg-mute)]">
              Dirección 01 · Levantamiento
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[var(--color-fg-mute)]">
              Demo de dirección de arte
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-mute)] mb-3">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-fg-soft)]">
              <li>{copy.marca.telefono}</li>
              <li>{copy.marca.whatsapp}</li>
              <li>{copy.marca.correo}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-mute)] mb-3">
              Aviso
            </h4>
            <p className="text-xs text-[var(--color-fg-mute)] leading-relaxed">
              {copy.footer.aviso}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-line)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-fg-mute)]">
            © 2026 Grupo CISA · ABDev
          </p>
          <a
            href="/patrimonio"
            className="text-[10px] uppercase tracking-widest text-[var(--color-fg-mute)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-2"
          >
            Ver dirección 02 · Patrimonio
            <img src="/decor/arrow.svg" alt="" className="w-6 h-3" />
          </a>
        </div>
      </Container>
    </footer>
  )
}