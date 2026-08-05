import { motion } from 'motion/react'
import Section from '../shared/Section'
import Container from '../shared/Container'

const etapas = [
  { numero: '01', nombre: 'Aportación del terreno', detalle: 'Se define qué aporta cada parte y bajo qué figura jurídica.' },
  { numero: '02', nombre: 'Conceptualización y factibilidad', detalle: 'Qué puede construirse ahí y si tiene sentido económico.' },
  { numero: '03', nombre: 'Proyecto arquitectónico', detalle: 'El desarrollo toma forma y define la superficie vendible.' },
  { numero: '04', nombre: 'Esquema legal', detalle: 'Contratos, permisos, licencias y la figura del propietario.' },
  { numero: '05', nombre: 'Esquema financiero', detalle: 'Cómo se financia la obra y cómo se reparte el resultado.' },
  { numero: '06', nombre: 'Construcción', detalle: 'Obra con avance documentado y fechado, visible para el propietario.' },
  { numero: '07', nombre: 'Preventa y entrega', detalle: 'Comercialización, escrituración y entrega de unidades.' }
]

export default function Metodo() {
  return (
    <Section id="metodo" className="bg-[var(--color-bg-soft)] border-y border-[var(--color-line)]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-kicker">El proceso, abierto</p>
          <h2 className="section-title">Siete etapas. En todo momento sabe en cuál está.</h2>
          <p className="section-lede">
            Publicamos el proceso completo porque es la parte que casi nadie
            explica, y es justo donde nacen las dudas.
          </p>
        </motion.div>

        <ol className="metodo-list mt-14">
          {etapas.map((e, i) => (
            <motion.li
              key={e.numero}
              className="metodo-step"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="step-pin" aria-hidden="true">{e.numero}</span>
              <h3>{e.nombre}</h3>
              <p>{e.detalle}</p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
