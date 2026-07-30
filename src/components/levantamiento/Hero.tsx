import { motion } from 'motion/react'
import Button from '../shared/Button'
import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

export default function Hero() {
  return (
    <div className="relative">
      <Container className="pt-24 md:pt-32 pb-12 md:pb-20">
        {/* Etiqueta superior tipo anotación de plano */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8 text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-soft)]"
        >
          <span className="block w-8 h-px bg-[var(--color-fg-soft)]" />
          <span>Desarrollo inmobiliario · Aportación de terrenos</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-5xl text-[var(--color-fg)]"
        >
          {copy.hero.titular}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--color-fg-soft)]"
        >
          {copy.hero.subtitulo}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Button variant="primary">{copy.hero.ctaPrimario}</Button>
          <Button variant="secondary">{copy.hero.ctaSecundario}</Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-5 text-xs text-[var(--color-fg-mute)]"
        >
          {copy.hero.ctaCompromiso}
        </motion.p>
      </Container>

      {/* Línea base de plano */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-line-strong)]" />
    </div>
  )
}
