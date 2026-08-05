import { useEffect } from 'react'
import { Route, Switch, Router } from 'wouter'
import Home from './app/home'
import Levantamiento from './app/levantamiento'
import Patrimonio from './app/patrimonio'
import Lenis from 'lenis'
import {
  ConversationProvider,
  useConversationStatus
} from '@elevenlabs/react'

const AGENT_ID = 'agent_placeholder_cisa'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <ConversationProvider agentId={AGENT_ID}>
      <Router>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/levantamiento" component={Levantamiento} />
          <Route path="/patrimonio" component={Patrimonio} />
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <BotonAgenteFlotante />
      </Router>
    </ConversationProvider>
  )
}

function BotonAgenteFlotante() {
  const { status } = useConversationStatus()

  if (status === 'connected') return null

  return (
    <a
      href="/levantamiento"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-full shadow-lg hover:bg-amber-700 transition-colors text-sm font-medium"
    >
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      Hablar con el agente
    </a>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-900 font-sans">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-stone-500">404</p>
        <h1 className="mt-4 text-4xl font-serif">No encontramos esa página</h1>
        <a href="/" className="mt-8 inline-block underline">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}