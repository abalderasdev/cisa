import SignatureMoment from '../components/shared/SignatureMoment'
import AgenteSection from '../components/shared/AgenteSection'
import Hero from '../components/levantamiento/Hero'
import Modalidades from '../components/levantamiento/Modalidades'
import Prueba from '../components/levantamiento/Prueba'
import Metodo from '../components/levantamiento/Metodo'
import Footer from '../components/levantamiento/Footer'

export default function Levantamiento() {
  return (
    <main className="theme-levantamiento min-h-screen">
      <Hero />
      <AgenteSection />
      <SignatureMoment theme="levantamiento" />
      <Modalidades />
      <Prueba />
      <Metodo />
      <Footer />
    </main>
  )
}