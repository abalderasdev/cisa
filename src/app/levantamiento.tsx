import SignatureMoment from '../components/shared/SignatureMoment'
import Hero from '../components/levantamiento/Hero'
import NuevaOportunidad from '../components/levantamiento/NuevaOportunidad'
import Prueba from '../components/levantamiento/Prueba'
import Metodo from '../components/levantamiento/Metodo'
import Footer from '../components/levantamiento/Footer'

export default function Levantamiento() {
  return (
    <main className="theme-levantamiento min-h-screen">
      <Hero />
      <SignatureMoment theme="levantamiento" />
      <NuevaOportunidad />
      <Prueba />
      <Metodo />
      <Footer />
    </main>
  )
}
