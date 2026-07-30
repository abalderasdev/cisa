import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import Button from '../shared/Button'
import { copy } from '../../lib/copy/copy'

export default function NuevaOportunidad() {
  return (
    <Section className="bg-[var(--color-bg-soft)] border-y border-[var(--color-line)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium">
            Bloque 02
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl leading-tight text-[var(--color-fg)]">
            {copy.nuevaOportunidad.titular}
          </h2>
          <p className="mt-6 text-lg text-[var(--color-fg-soft)] leading-relaxed">
            {copy.nuevaOportunidad.parrafo}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {copy.nuevaOportunidad.pasos.map((paso, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[var(--color-bg)] p-8 md:p-10"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-mute)] mb-3">
                Etapa {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-fg)] mb-4">
                {paso.titulo}
              </h3>
              <p className="text-sm text-[var(--color-fg-soft)] leading-relaxed">
                {paso.descripcion}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <Button variant="secondary">¿Aplica mi terreno? Averígüelo en 3 minutos</Button>
        </div>
      </Container>
    </Section>
  )
}
