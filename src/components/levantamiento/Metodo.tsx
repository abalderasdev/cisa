import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import { copy } from '../../lib/copy/copy'

export default function Metodo() {
  return (
    <Section className="bg-[var(--color-bg-soft)] border-t border-[var(--color-line)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium">
            Bloque 04
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl leading-tight text-[var(--color-fg)]">
            {copy.metodo.titular}
          </h2>
          <p className="mt-6 text-lg text-[var(--color-fg-soft)] leading-relaxed">
            {copy.metodo.parrafo}
          </p>
        </motion.div>

        {/* Timeline horizontal con numeración tipo plano */}
        <div className="mt-20 relative">
          {/* Línea horizontal */}
          <div className="absolute top-7 left-0 right-0 h-px bg-[var(--color-line-strong)]" />

          <div className="grid grid-cols-1 md:grid-cols-7 gap-y-10 md:gap-y-0 md:gap-2 relative">
            {copy.metodo.etapas.map((etapa, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative"
              >
                <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-3">
                  <div className="flex-shrink-0 w-14 h-14 border border-[var(--color-line-strong)] bg-[var(--color-bg)] flex items-center justify-center font-mono text-sm text-[var(--color-fg)] z-10 relative">
                    {etapa.numero}
                  </div>
                  <div className="md:mt-2 md:text-center">
                    <h3 className="font-[family-name:var(--font-heading)] text-base text-[var(--color-fg)] leading-snug">
                      {etapa.nombre}
                    </h3>
                    <p className="mt-2 text-xs text-[var(--color-fg-soft)] leading-relaxed md:max-w-[10rem]">
                      {etapa.detalle}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
