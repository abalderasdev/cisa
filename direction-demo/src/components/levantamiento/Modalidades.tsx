import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import Button from '../shared/Button'
import { copy } from '../../lib/copy/copy'

const modalidadesImagenes: Record<string, string> = {
  'Aportación de terreno': '/modalities/terreno.svg',
  'Co-desarrollo': '/modalities/codesarrollo.svg',
  'Construcción por encargo': '/modalities/construccion.svg',
  'Inversión en proyectos': '/modalities/inversion.svg'
}

export default function Modalidades() {
  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium">
            Lo que hacemos
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl leading-tight text-[var(--color-fg)]">
            {copy.modalidades.titular}
          </h2>
          <p className="mt-6 text-lg text-[var(--color-fg-soft)] leading-relaxed">
            {copy.modalidades.parrafo}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {copy.modalidades.items.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[var(--color-bg)] p-8 md:p-10"
            >
              <div className="aspect-square w-32 mb-6 mx-auto">
                <img
                  src={modalidadesImagenes[m.titulo] || '/modalities/terreno.svg'}
                  alt={m.titulo}
                  className="w-full h-full"
                />
              </div>
              <div className="font-mono text-xs text-[var(--color-fg-mute)] mb-3">
                {m.numero}
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-fg)] mb-4">
                {m.titulo}
              </h3>
              <p className="text-sm text-[var(--color-fg-soft)] leading-relaxed">
                {m.descripcion}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <Button variant="secondary">Ver todas las modalidades</Button>
        </div>
      </Container>
    </Section>
  )
}