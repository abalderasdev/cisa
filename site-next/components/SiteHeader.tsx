import Link from "next/link";

const NAV = [
  { href: "/su-terreno", label: "Modalidades" },
  { href: "/nosotros", label: "Método" },
  { href: "/desarrollos", label: "Obra" },
  { href: "/inversion", label: "Agente" },
  { href: "/contacto", label: "Equipo" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Grupo CISA — Inicio">
          {/* Logo Grupo CISA — SVG oficial vectorizado */}
          <img src="/logo-grupo-cisa.svg" alt="Grupo CISA" width={120} height={42} />
        </Link>

        <nav className="site-header__nav" aria-label="Navegación principal">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <Link href="/su-terreno" className="btn btn--primary">
          Precalificar mi terreno
        </Link>
      </div>
    </header>
  );
}
