import { useEffect } from 'react'
import { Route, Switch, Router } from 'wouter'
import { ConversationProvider } from '@elevenlabs/react'
import Home from './app/home'
import Levantamiento from './app/levantamiento'
import Patrimonio from './app/patrimonio'
import Lenis from 'lenis'

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
      </Router>
    </ConversationProvider>
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