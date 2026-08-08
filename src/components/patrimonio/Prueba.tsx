import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import { copy } from '../../lib/copy/copy'

const proyectosImagenes: Record<string, string> = {
  'Bosques de Calacoaya': '/projects/calacoaya.svg',
  'Viaducto 14': '/projects/viaducto.svg',
  'Bomadica': '/projects/bomadica.svg',
  'Cumbres del Lago': '/projects/cumbres.svg'
}

export default function Prueba() {
  return (
    <Section className="bg-[var(--color-bg-soft)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-accent)]">
            — La prueba
          </span>
          <h2
            className="mt-8 font-[family-name:var(--font-heading)] text-4xl md:text-5xl leading-tight text-[var(--color-fg)]"
            style={{ fontStyle: 'italic', fontWeight: 500 }}
          >
            {copy.prueba.titular}
          </h2>
          <p className="mt-6 text-base text-[var(--color-fg-soft)] leading-relaxed">
            {copy.prueba.parrafo}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-16">
          {copy.prueba.proyectos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-5 aspect-[4/3] bg-[var(--color-bg)] border border-[var(--color-line)] overflow-hidden">
                <img
                  src={proyectosImagenes[p.nombre] || '/projects/calacoaya.svg'}
                  alt={`Plano de ${p.nombre}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7">
                <div className="flex items-baseline gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                    Proyecto {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs italic text-[var(--color-fg-mute)]">{p.estatus}</span>
                </div>
                <h3
                  className="mt-3 font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--color-fg)]"
                  style={{ fontStyle: 'italic', fontWeight: 500 }}
                >
                  {p.nombre}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-soft)]">
                  {p.ubicacion}
                </p>
                <p className="mt-4 text-base text-[var(--color-fg-soft)] leading-relaxed">
                  {p.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}