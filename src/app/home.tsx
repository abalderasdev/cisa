import { motion } from 'motion/react'

export default function Home() {
  const direcciones = [
    {
      href: '/levantamiento',
      nombre: 'Levantamiento',
      tagline: 'El plano que se convierte en volumen',
      descripcion:
        'Inspirada en la retícula del plano arquitectónico. Tipografía técnica, numeración visible, líneas finas. Es la única dirección que un competidor no puede copiar sin copiar también el modelo de negocio.',
      paleta: 'Papel cálido · tinta azul · acento bronce',
      tipografia: 'Fraunces + Inter'
    },
    {
      href: '/patrimonio',
      nombre: 'Patrimonio',
      tagline: 'El legado familiar que se proyecta al futuro',
      descripcion:
        'Verde profundo y latón, con una tipografía clásica en cursiva. Más conservadora, con foco en seguridad jurídica. Conviene si el público pesa más del lado patrimonial que del lado de originación.',
      paleta: 'Marfil · verde profundo · acento latón',
      tipografia: 'Cormorant Garamond + Inter'
    }
  ]

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-stone-500">
            ABDev · Demo interna
          </span>
          <h1 className="mt-6 font-serif text-4xl md:text-6xl leading-tight">
            Grupo CISA
          </h1>
          <p className="mt-4 text-stone-500 text-sm uppercase tracking-widest">
            Dos direcciones de arte sobre el copy real
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 text-center max-w-2xl mx-auto"
        >
          <p className="text-stone-600 leading-relaxed">
            Esta es la demo que se le presenta al cliente. Cada dirección es una página
            completa con el mismo copy, distinta estética. La estructura, las
            animaciones y el stack son los mismos que se usarán en producción
            (Next.js, Tailwind v4, Motion, GSAP, React Three Fiber).
          </p>
          <p className="mt-4 text-stone-500 text-sm italic">
            Elige una para verla en pantalla completa.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {direcciones.map((d, i) => (
            <motion.a
              key={d.href}
              href={d.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="group block bg-white border border-stone-200 p-8 md:p-10 hover:border-stone-900 transition-all duration-300"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                Dirección 0{i + 1}
              </div>
              <h2 className="mt-3 font-serif text-3xl text-stone-900 group-hover:underline">
                {d.nombre}
              </h2>
              <p className="mt-2 text-sm text-stone-600 italic">
                {d.tagline}
              </p>
              <p className="mt-5 text-sm text-stone-600 leading-relaxed">
                {d.descripcion}
              </p>

              <div className="mt-8 pt-6 border-t border-stone-100 space-y-2 text-xs">
                <div>
                  <span className="text-stone-500">Paleta · </span>
                  <span className="text-stone-700">{d.paleta}</span>
                </div>
                <div>
                  <span className="text-stone-500">Tipografía · </span>
                  <span className="text-stone-700">{d.tipografia}</span>
                </div>
              </div>

              <div className="mt-8 text-xs uppercase tracking-widest text-stone-900 group-hover:translate-x-1 transition-transform">
                Ver demo →
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 pt-10 border-t border-stone-200 text-center"
        >
          <p className="text-xs text-stone-500">
            Stack · Vite + React 18 + TypeScript · Tailwind v4 · Motion · Lenis · GSAP · React Three Fiber
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-stone-400">
            ABDev · Alberto Balderas · {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </main>
  )
}
