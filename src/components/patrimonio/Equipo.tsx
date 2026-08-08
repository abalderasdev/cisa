import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'

const equipo = [
  { nombre: 'Director General', placeholder: '/team/placeholder-1.svg' },
  { nombre: 'Director de Operaciones', placeholder: '/team/placeholder-2.svg' },
  { nombre: 'Director Jurídico', placeholder: '/team/placeholder-3.svg' }
]

export default function Equipo() {
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
            — El equipo
          </span>
          <h2
            className="mt-8 font-[family-name:var(--font-heading)] text-4xl md:text-5xl leading-tight text-[var(--color-fg)]"
            style={{ fontStyle: 'italic', fontWeight: 500 }}
          >
            Detrás de cada proyecto hay nombres, no un logotipo.
          </h2>
          <p className="mt-6 text-base text-[var(--color-fg-soft)] leading-relaxed">
            Un desarrollo es una relación de años. Conviene saber con quién la estás empezando.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {equipo.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="aspect-[4/5] overflow-hidden border border-[var(--color-line)] mb-4">
                <img
                  src={p.placeholder}
                  alt={`Placeholder de ${p.nombre}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-mute)] mb-2">
                Pendiente de confirmar
              </p>
              <p
                className="font-[family-name:var(--font-heading)] text-lg text-[var(--color-fg)] italic"
                style={{ fontStyle: 'italic' }}
              >
                {p.nombre}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}