import { motion } from 'motion/react'
import AgenteElevenLabs from '../shared/AgenteElevenLabs'
import Button from '../shared/Button'
import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

export default function Hero() {
  return (
    <div className="relative">
      <Container className="pt-32 md:pt-44 pb-16 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex justify-center"
        >
          <img
            src="/brand/logo-horizontal.svg"
            alt="Grupo CISA"
            className="h-16 w-auto text-[var(--color-fg)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-10 text-[10px] uppercase tracking-[0.4em] text-[var(--color-fg-soft)]"
        >
          <span className="block w-6 h-px bg-[var(--color-accent)]" />
          <span>Legado · desarrollo · seguridad jurídica</span>
          <span className="block w-6 h-px bg-[var(--color-accent)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-[var(--color-fg)] max-w-5xl mx-auto"
          style={{ fontStyle: 'italic', fontWeight: 500 }}
        >
          {copy.hero.titular}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl text-[var(--color-fg-soft)] max-w-3xl mx-auto mt-4"
          style={{ fontStyle: 'italic', fontWeight: 400 }}
        >
          Y tenemos un agente que te atiende en lo que sea, al instante.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-10 max-w-xl mx-auto text-base text-[var(--color-fg-soft)] leading-relaxed"
        >
          {copy.hero.subtitulo}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <AgenteElevenLabs botonPrimario etiqueta={copy.hero.ctaPrimario} />
          <Button variant="secondary">{copy.hero.ctaSecundario}</Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-6 text-xs text-[var(--color-fg-mute)] italic"
        >
          {copy.hero.ctaCompromiso}
        </motion.p>
      </Container>
    </div>
  )
}