import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import { copy } from '../../lib/copy/copy'

export default function Metodo() {
  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-accent)]">
            — El método abierto
          </span>
          <h2
            className="mt-8 font-[family-name:var(--font-heading)] text-4xl md:text-5xl leading-tight text-[var(--color-fg)]"
            style={{ fontStyle: 'italic', fontWeight: 500 }}
          >
            {copy.metodo.titular}
          </h2>
          <p className="mt-6 text-base text-[var(--color-fg-soft)] leading-relaxed">
            {copy.metodo.parrafo}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {copy.metodo.etapas.map((etapa, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="grid grid-cols-12 gap-4 py-6 border-b border-[var(--color-line)] last:border-b-0"
            >
              <div
                className="col-span-3 md:col-span-2 font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--color-accent)]"
                style={{ fontStyle: 'italic' }}
              >
                {etapa.numero}
              </div>
              <div className="col-span-9 md:col-span-10">
                <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-[var(--color-fg)]">
                  {etapa.nombre}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-fg-soft)] leading-relaxed max-w-2xl">
                  {etapa.detalle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
