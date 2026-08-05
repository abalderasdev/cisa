import { motion } from 'motion/react'
import Section from '../shared/Section'
import Container from '../shared/Container'

const proyectos = [
  {
    nombre: 'Bosques de Calacoaya',
    ubicacion: 'Atizapán · EdoMéx',
    descripcion: '24 departamentos de 120 m² y 11 casas de 183 m² dentro de un conjunto privado.',
    estatus: 'En preventa',
    ref: '001'
  },
  {
    nombre: 'Residencial Fraile',
    ubicacion: 'Jilotzingo · EdoMéx',
    descripcion: 'Torre de departamentos con gran plusvalía. Algunas unidades disponibles.',
    estatus: 'Terminada 2025',
    ref: '002'
  },
  {
    nombre: 'Panorama Algarín',
    ubicacion: 'Cuauhtémoc · CDMX',
    descripcion: 'Torre de 23 departamentos en colonia con alta demanda de vivienda.',
    estatus: 'En trámite',
    ref: '003'
  },
  {
    nombre: 'Itzaé',
    ubicacion: 'Tulum · Quintana Roo',
    descripcion: 'Torre de departamentos de lujo enfocada en privacidad, confort y entorno natural.',
    estatus: 'Primavera 2026',
    ref: '004'
  }
]

export default function Prueba() {
  return (
    <Section id="desarrollos">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-kicker">Obra, no propuesta</p>
          <h2 className="section-title">No es una propuesta teórica. Es lo que hacemos.</h2>
          <p className="section-lede">
            Obra propia, en desarrollo y entregada en el Valle de México y en
            destinos turísticos. Cada proyecto se construye con el mismo equipo y
            la misma estructura de capital.
          </p>
        </motion.div>

        <div className="prueba-grid mt-14">
          {proyectos.map((p, i) => (
            <motion.article
              key={p.ref}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="prueba-card"
            >
              <div className="prueba-cover" aria-hidden="true">
                <span className="ref">Ref · {p.ref}</span>
                <span className="badge">{p.estatus}</span>
              </div>
              <div className="prueba-body">
                <h3>{p.nombre}</h3>
                <p className="prueba-loc">{p.ubicacion}</p>
                <p>{p.descripcion}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
