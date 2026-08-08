import SignatureMoment from '../components/shared/SignatureMoment'
import Hero from '../components/patrimonio/Hero'
import NuevaOportunidad from '../components/patrimonio/NuevaOportunidad'
import Prueba from '../components/patrimonio/Prueba'
import Metodo from '../components/patrimonio/Metodo'
import Footer from '../components/patrimonio/Footer'

export default function Patrimonio() {
  return (
    <main className="theme-patrimonio min-h-screen">
      <Hero />
      <SignatureMoment theme="patrimonio" />
      <NuevaOportunidad />
      <Prueba />
      <Metodo />
      <Footer />
    </main>
  )
}
