import { motion } from 'motion/react'
import AgenteElevenLabs from '../shared/AgenteElevenLabs'
import Container from '../shared/Container'
import Section from '../shared/Section'
import { copy } from '../../lib/copy/copy'

export default function AgenteSection() {
  return (
    <Section className="bg-[var(--color-bg-soft)] border-y border-[var(--color-line)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
        >
          {/* Columna izquierda: copy */}
          <div className="md:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium">
              La pieza nueva
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl leading-tight text-[var(--color-fg)]">
              {copy.agente.titular}
            </h2>
            <p className="mt-6 text-lg text-[var(--color-fg-soft)] leading-relaxed">
              {copy.agente.parrafo}
            </p>

            <ul className="mt-8 space-y-3">
              {copy.agente.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-base text-[var(--color-fg-soft)]"
                >
                  <span className="mt-2 block w-1.5 h-1.5 bg-[var(--color-accent)] flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <AgenteElevenLabs botonPrimario etiqueta={copy.agente.cta} />
            </div>

            <p className="mt-4 text-xs text-[var(--color-fg-mute)] italic">
              *Disponible 24/7 · Voz y texto · En español
            </p>
          </div>

          {/* Columna derecha: demo del agente */}
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] bg-[var(--color-bg)] border border-[var(--color-line-strong)] overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                {/* Ondas estáticas de fondo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <img
                    src="/agent/waveform.svg"
                    alt=""
                    className="w-full"
                    style={{ transform: 'rotate(90deg) scale(1.5)' }}
                  />
                </div>

                {/* Anillos pulsantes */}
                <div className="relative w-32 h-32 mb-8 z-10">
                  <div className="absolute inset-0 rounded-full border border-[var(--color-accent)] opacity-30 animate-ping" />
                  <div
                    className="absolute inset-2 rounded-full border border-[var(--color-accent)] opacity-50 animate-ping"
                    style={{ animationDelay: '0.4s' }}
                  />
                  <div
                    className="absolute inset-4 rounded-full border border-[var(--color-accent)] opacity-70 animate-ping"
                    style={{ animationDelay: '0.8s' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-fg)] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-[var(--color-bg)]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="mb-4 z-10">
                  <img src="/agent/status.svg" alt="En línea" className="h-8" />
                </div>

                <p className="font-[family-name:var(--font-heading)] text-xl text-[var(--color-fg)] text-center italic z-10">
                  «Te escucho. Pregúntame lo que quieras.»
                </p>

                <div className="mt-8 pt-8 border-t border-[var(--color-line)] w-full z-10 bg-[var(--color-bg)]/80 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-mute)] text-center mb-4">
                    Powered by
                  </p>
                  <p className="text-center text-[var(--color-fg-soft)] font-medium">
                    ElevenLabs Conversational AI
                  </p>
                </div>
              </div>

              <div className="absolute top-3 left-3 text-[9px] uppercase tracking-widest text-[var(--color-fg-mute)] z-20">
                Demo · Live widget
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lo que SÍ y lo que NO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]"
        >
          <div className="bg-[var(--color-bg)] p-6 md:p-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium mb-4">
              Lo que sí hace
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-fg-soft)]">
              {copy.agente.puedeHacer.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] mt-1">+</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-bg)] p-6 md:p-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-mute)] font-medium mb-4">
              Lo que no hace
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-fg-mute)]">
              {copy.agente.noHace.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1">−</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}