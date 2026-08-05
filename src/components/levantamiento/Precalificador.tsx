import { FormEvent, useState } from 'react'
import Section from '../shared/Section'
import Container from '../shared/Container'

const whatsappNumber = '5215517964940'

export default function Precalificador() {
  const [sent, setSent] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = [
      'Hola, quiero revisar el potencial de mi terreno.',
      `Nombre: ${data.get('nombre')}`,
      `Ubicación: ${data.get('ubicacion')}`,
      `Superficie: ${data.get('superficie')}`,
      `Uso de suelo: ${data.get('uso')}`,
      `Teléfono: ${data.get('telefono')}`
    ].join('\n')
    setSent(true)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Section id="contacto" className="prequalifier-section">
      <Container>
        <div className="prequalifier-layout">
          <div>
            <p className="section-kicker">Primera revisión</p>
            <h2 className="section-title">Empiece por saber qué puede construirse.</h2>
            <p className="section-lede">
              Cuéntenos lo básico de su predio. La revisión inicial no tiene costo y no lo compromete a aportarlo.
            </p>
            <div className="prequalifier-note">
              <span className="note-pin" aria-hidden="true">+</span>
              <p>La primera orientación no es un avalúo ni un dictamen. Es el punto de partida para saber qué revisar después.</p>
            </div>
          </div>

          <form className="prequalifier-form" onSubmit={submit}>
            <div className="form-heading">
              <span>01 / 04</span>
              <strong>Datos del predio</strong>
            </div>
            <label>
              Su nombre
              <input name="nombre" required autoComplete="name" placeholder="Nombre completo" />
            </label>
            <label>
              ¿Dónde está el terreno?
              <input name="ubicacion" required placeholder="Municipio y estado" />
            </label>
            <div className="form-row">
              <label>
                Superficie aproximada
                <input name="superficie" required placeholder="m²" inputMode="decimal" />
              </label>
              <label>
                Uso de suelo
                <select name="uso" defaultValue="no-lo-se">
                  <option value="no-lo-se">No lo sé</option>
                  <option value="habitacional">Habitacional</option>
                  <option value="comercial">Comercial</option>
                  <option value="mixto">Mixto</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
            </div>
            <label>
              Teléfono o WhatsApp
              <input name="telefono" required autoComplete="tel" placeholder="55 0000 0000" inputMode="tel" />
            </label>
            <label className="consent-label">
              <input type="checkbox" required />
              <span>Acepto el aviso de privacidad y que CISA me contacte sobre esta solicitud.</span>
            </label>
            <button className="form-submit" type="submit">Enviar y continuar por WhatsApp <span aria-hidden="true">↗</span></button>
            <p className="form-footnote">Aproximadamente 3 minutos · sin costo · sin compromiso</p>
            {sent && <p className="form-success" role="status">Abrimos WhatsApp con la información de su solicitud.</p>}
          </form>
        </div>
      </Container>
    </Section>
  )
}
