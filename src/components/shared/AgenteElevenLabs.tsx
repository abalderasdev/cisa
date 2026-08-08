import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useConversationControls, useConversationStatus } from '@elevenlabs/react'

interface AgenteProps {
  botonPrimario?: boolean
  etiqueta?: string
}

export default function AgenteElevenLabs({
  botonPrimario = false,
  etiqueta = 'Hablar con el agente'
}: AgenteProps) {
  const [abierto, setAbierto] = useState(false)
  const { startSession, endSession } = useConversationControls()
  const { status } = useConversationStatus()

  const handleClick = () => {
    if (status === 'connected') {
      endSession()
      setAbierto(false)
    } else {
      setAbierto(true)
      startSession({
        onConnect: () => console.log('Agente conectado'),
        onError: (msg) => console.error('Error agente:', msg)
      })
    }
  }

  const estilosBoton = botonPrimario
    ? 'bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] px-6 py-3 text-sm font-medium transition-colors'
    : 'fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--color-fg)] text-[var(--color-bg)] px-5 py-3 rounded-full shadow-lg hover:bg-[var(--color-accent)] transition-colors text-sm font-medium'

  return (
    <>
      <button onClick={handleClick} className={estilosBoton}>
        {status === 'connected' ? (
          <>
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            Cerrar conversación
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {etiqueta}
          </>
        )}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-[var(--color-bg)] border border-[var(--color-line-strong)] shadow-2xl rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-[var(--color-line)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg text-[var(--color-fg)]">
                    Agente Grupo CISA
                  </h3>
                  <p className="text-xs text-[var(--color-fg-mute)] mt-1">
                    Estado: {status === 'connected' ? 'conectado' : 'conectando...'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    endSession()
                    setAbierto(false)
                  }}
                  className="text-[var(--color-fg-mute)] hover:text-[var(--color-fg)] text-2xl leading-none"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-[var(--color-bg)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-[var(--color-fg-soft)]">
                  {status === 'connected'
                    ? 'Te escucho. Pregúntame lo que quieras.'
                    : 'Conectando con el agente...'}
                </p>
                <p className="mt-4 text-xs text-[var(--color-fg-mute)]">
                  El widget oficial de ElevenLabs se renderizará aquí en producción.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[var(--color-bg-soft)] text-[10px] uppercase tracking-widest text-[var(--color-fg-mute)] text-center">
              Powered by ElevenLabs
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}