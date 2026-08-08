import SignatureMoment from '../components/shared/SignatureMoment'
import AgenteSection from '../components/shared/AgenteSection'
import Hero from '../components/patrimonio/Hero'
import Equipo from '../components/patrimonio/Equipo'
import Modalidades from '../components/patrimonio/Modalidades'
import Prueba from '../components/patrimonio/Prueba'
import Metodo from '../components/patrimonio/Metodo'
import Footer from '../components/patrimonio/Footer'

export default function Patrimonio() {
  return (
    <main className="theme-patrimonio min-h-screen">
      <Hero />
      <AgenteSection />
      <SignatureMoment theme="patrimonio" />
      <Equipo />
      <Modalidades />
      <Prueba />
      <Metodo />
      <Footer />
    </main>
  )
}