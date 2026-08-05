import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import Button from '../shared/Button'
import { copy } from '../../lib/copy/copy'

export default function Modalidades() {
  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-accent)]">
            Lo que hacemos
          </span>
          <h2
            className="mt-8 font-[family-name:var(--font-heading)] text-4xl md:text-5xl leading-tight text-[var(--color-fg)]"
            style={{ fontStyle: 'italic', fontWeight: 500 }}
          >
            {copy.modalidades.titular}
          </h2>
          <p className="mt-6 text-base text-[var(--color-fg-soft)] leading-relaxed">
            {copy.modalidades.parrafo}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          {copy.modalidades.items.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-2">
                <div
                  className="font-[family-name:var(--font-heading)] text-6xl text-[var(--color-accent)] leading-none"
                  style={{ fontStyle: 'italic' }}
                >
                  {m.numero}
                </div>
              </div>
              <div className="md:col-span-10 md:border-l md:border-[var(--color-line)] md:pl-10">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--color-fg)]">
                  {m.titulo}
                </h3>
                <p className="mt-3 text-base text-[var(--color-fg-soft)] leading-relaxed max-w-2xl">
                  {m.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="primary">Ver todas las modalidades</Button>
        </div>
      </Container>
    </Section>
  )
}