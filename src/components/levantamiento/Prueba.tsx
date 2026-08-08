import { motion } from 'motion/react'
import Section from '../shared/Section'
import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

const proyectosImagenes: Record<string, string> = {
  'Bosques de Calacoaya': '/projects/calacoaya.svg',
  'Viaducto 14': '/projects/viaducto.svg',
  'Bomadica': '/projects/bomadica.svg',
  'Cumbres del Lago': '/projects/cumbres.svg'
}

export default function Prueba() {
  return (
    <Section id="desarrollos">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] font-medium">
            Bloque 06
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl leading-tight text-[var(--color-fg)]">
            {copy.prueba.titular}
          </h2>
          <p className="mt-6 text-lg text-[var(--color-fg-soft)] leading-relaxed">
            {copy.prueba.parrafo}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {copy.prueba.proyectos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border border-[var(--color-line)] bg-[var(--color-bg)] overflow-hidden group"
            >
              <div className="relative aspect-[4/3] bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] overflow-hidden">
                <img
                  src={proyectosImagenes[p.nombre] || '/projects/calacoaya.svg'}
                  alt={`Plano de ${p.nombre}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 text-[9px] uppercase tracking-widest bg-[var(--color-bg)] px-2 py-1 text-[var(--color-fg)]">
                  Ref · {String(i + 1).padStart(3, '0')}
                </div>
                <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest bg-[var(--color-fg)] text-[var(--color-bg)] px-2 py-1">
                  {p.estatus}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-fg)]">
                  {p.nombre}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-mute)]">
                  {p.ubicacion}
                </p>
                <p className="mt-3 text-sm text-[var(--color-fg-soft)] leading-relaxed">
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