import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import Button from '../shared/Button'
import { copy } from '../../lib/copy/copy'

export default function NuevaOportunidad() {
  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-accent)]">
            — Una nueva oportunidad
          </span>
          <h2
            className="mt-8 font-[family-name:var(--font-heading)] text-4xl md:text-6xl leading-tight text-[var(--color-fg)]"
            style={{ fontStyle: 'italic', fontWeight: 500 }}
          >
            {copy.nuevaOportunidad.titular}
          </h2>
          <p className="mt-8 text-lg text-[var(--color-fg-soft)] leading-relaxed">
            {copy.nuevaOportunidad.parrafo}
          </p>
        </motion.div>

        <div className="mt-24 max-w-5xl mx-auto space-y-20">
          {copy.nuevaOportunidad.pasos.map((paso, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              <div className="md:col-span-2">
                <div
                  className="font-[family-name:var(--font-heading)] text-7xl text-[var(--color-accent)] leading-none"
                  style={{ fontStyle: 'italic' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="md:col-span-10 md:border-l md:border-[var(--color-line)] md:pl-10">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--color-fg)]">
                  {paso.titulo}
                </h3>
                <p className="mt-4 text-base text-[var(--color-fg-soft)] leading-relaxed max-w-2xl">
                  {paso.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button variant="primary">¿Aplica mi terreno? Averígüelo en 3 minutos</Button>
        </div>
      </Container>
    </Section>
  )
}
