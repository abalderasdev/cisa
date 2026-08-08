import { motion } from 'motion/react'
import Button from '../shared/Button'
import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

export default function Hero() {
  return (
    <div className="relative">
      <Container className="pt-32 md:pt-44 pb-16 md:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-3 mb-10 text-[10px] uppercase tracking-[0.4em] text-[var(--color-fg-soft)]"
        >
          <span className="block w-6 h-px bg-[var(--color-accent)]" />
          <span>Legado · desarrollo · seguridad jurídica</span>
          <span className="block w-6 h-px bg-[var(--color-accent)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-[var(--color-fg)] max-w-5xl mx-auto"
          style={{ fontStyle: 'italic', fontWeight: 500 }}
        >
          {copy.hero.titular}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 max-w-xl mx-auto text-base md:text-lg leading-relaxed text-[var(--color-fg-soft)]"
        >
          {copy.hero.subtitulo}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary">{copy.hero.ctaPrimario}</Button>
          <Button variant="secondary">{copy.hero.ctaSecundario}</Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-6 text-xs text-[var(--color-fg-mute)] italic"
        >
          {copy.hero.ctaCompromiso}
        </motion.p>
      </Container>
    </div>
  )
}
