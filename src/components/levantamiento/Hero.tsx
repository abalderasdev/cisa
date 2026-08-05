import { motion } from 'motion/react'
import AgenteElevenLabs from '../shared/AgenteElevenLabs'
import Button from '../shared/Button'
import Container from '../shared/Container'
import { copy } from '../../lib/copy/copy'

export default function Hero() {
  return (
    <div className="relative">
      <Container className="pt-24 md:pt-32 pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8 text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-soft)]"
        >
          <span className="block w-8 h-px bg-[var(--color-fg-soft)]" />
          <span>Desarrollo inmobiliario · Equipo propio · Procesos abiertos</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-5xl text-[var(--color-fg)]"
        >
          Somos Grupo CISA. Diseñamos, gestionamos, construimos.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 font-[family-name:var(--font-heading)] text-xl md:text-2xl text-[var(--color-fg-soft)] max-w-3xl italic"
        >
          Y tenemos un agente que te atiende en lo que sea, al instante.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--color-fg-soft)]"
        >
          Más de 20 años haciendo desarrollo inmobiliario en CDMX, Estado de México
          y Querétaro. Equipo propio. Procesos abiertos. Sin compromiso de hablar
          con nosotros.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <AgenteElevenLabs botonPrimario etiqueta="Hablar con el agente" />
          <Button variant="secondary">Conoce la empresa ↓</Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-5 text-xs text-[var(--color-fg-mute)]"
        >
          Disponible 24/7 · Voz y texto · Sin compromiso
        </motion.p>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-line-strong)]" />
    </div>
  )
}