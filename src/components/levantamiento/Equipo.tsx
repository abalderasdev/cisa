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
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium">
            Bloque 04
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl leading-tight text-[var(--color-fg)]">
            Detrás de cada proyecto hay nombres, no un logotipo.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-fg-soft)] leading-relaxed">
            Un desarrollo es una relación de años. Conviene saber con quién la estás empezando.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipo.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-[var(--color-line)] bg-[var(--color-bg)]"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.placeholder}
                  alt={`Placeholder de ${p.nombre}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 border-t border-[var(--color-line)]">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-mute)] mb-2">
                  Pendiente de confirmar
                </p>
                <p className="text-sm text-[var(--color-fg-soft)] italic">
                  {p.nombre}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}