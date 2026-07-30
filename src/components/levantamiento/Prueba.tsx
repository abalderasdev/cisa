import { motion } from 'motion/react'
import Container from '../shared/Container'
import Section from '../shared/Section'
import { copy } from '../../lib/copy/copy'

export default function Prueba() {
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
            Bloque 03
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
              className="border border-[var(--color-line)] bg-[var(--color-bg)]"
            >
              {/* Placeholder de imagen con marco técnico */}
              <div className="relative aspect-[4/3] bg-[var(--color-bg-soft)] border-b border-[var(--color-line)] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto border border-[var(--color-line-strong)] flex items-center justify-center">
                      <span className="text-[10px] tracking-widest text-[var(--color-fg-mute)]">FOTO</span>
                    </div>
                    <p className="mt-3 text-[10px] uppercase tracking-widest text-[var(--color-fg-mute)]">
                      [fotografía de obra]
                    </p>
                  </div>
                </div>
                {/* Anotación de plano */}
                <div className="absolute top-3 left-3 text-[9px] uppercase tracking-widest text-[var(--color-fg-mute)]">
                  Ref · {String(i + 1).padStart(3, '0')}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl text-[var(--color-fg)]">
                    {p.nombre}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-fg-mute)] whitespace-nowrap">
                    {p.estatus}
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wider text-[var(--color-fg-mute)]">
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
