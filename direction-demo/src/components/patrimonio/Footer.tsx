import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-fg)] text-[var(--color-bg)]">
      <Container className="py-20">
        <div className="max-w-2xl mx-auto text-center">
          <img
            src="/brand/logo-mono.svg"
            alt="Grupo CISA"
            className="h-12 w-auto mx-auto"
            style={{ color: 'var(--color-bg)' }}
          />
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[var(--color-accent-soft)]">
            Dirección 02 · Patrimonio
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto text-center md:text-left">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)] mb-3">
              Teléfono
            </h4>
            <p className="text-sm">{copy.marca.telefono}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)] mb-3">
              WhatsApp
            </h4>
            <p className="text-sm">{copy.marca.whatsapp}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)] mb-3">
              Correo
            </h4>
            <p className="text-sm">{copy.marca.correo}</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-fg-soft)] max-w-3xl mx-auto">
          <p className="text-xs text-[var(--color-bg-soft)] opacity-70 italic text-center leading-relaxed">
            {copy.footer.aviso}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <a
            href="/levantamiento"
            className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)] hover:text-[var(--color-bg)] transition-colors flex items-center gap-2"
          >
            <img src="/decor/arrow.svg" alt="" className="w-6 h-3 rotate-180" />
            Ver dirección 01 · Levantamiento
          </a>
        </div>
      </Container>
    </footer>
  )
}