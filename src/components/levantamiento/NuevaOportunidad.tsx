import { motion } from 'motion/react'
import Section from '../shared/Section'
import Container from '../shared/Container'

const rutas = [
  {
    number: 'R 01',
    title: 'Tengo un terreno',
    body: 'Revise si su predio puede pasar de activo dormido a un proyecto desarrollado, con su participación por escrito.',
    href: '#contacto',
    cta: 'Precalificar mi terreno'
  },
  {
    number: 'R 02',
    title: 'Quiero invertir',
    body: 'Conozca los proyectos abiertos, su estructura de capital y los criterios de entrada antes de cualquier firma.',
    href: '#contacto',
    cta: 'Solicitar resumen'
  },
  {
    number: 'R 03',
    title: 'Busco una propiedad',
    body: 'Departamentos, casas, locales, lotes y macrolotes en preventa y entrega inmediata en distintas ciudades.',
    href: '#desarrollos',
    cta: 'Ver desarrollos'
  }
]

export default function NuevaOportunidad() {
  return (
    <Section id="rutas" className="bg-[var(--color-bg-soft)] border-y border-[var(--color-line)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-kicker">Tres rutas, una decisión</p>
          <h2 className="section-title">Elija por dónde quiere entrar.</h2>
          <p className="section-lede">
            Su terreno, su capital o su próxima propiedad. Cada ruta tiene su propio
            proceso y sus propios documentos. La promesa es la misma: empezar antes
            de comprometerse.
          </p>
        </motion.div>

        <div className="rutas-grid mt-14">
          {rutas.map((r, i) => (
            <motion.a
              key={r.number}
              href={r.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="ru-number">{r.number}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <span className="ru-arrow">{r.cta} →</span>
            </motion.a>
          ))}
        </div>
      </Container>
    </Section>
  )
}
