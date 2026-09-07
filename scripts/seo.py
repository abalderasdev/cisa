#!/usr/bin/env python3
"""
Genera el SEO tecnico del sitio: canonical + Open Graph por pagina,
sitemap.xml y robots.txt.

Es idempotente: se puede correr las veces que haga falta. Solo toca el
<head>; no altera el markup visible ni el CSS.

Cuando el dominio definitivo (grupocisa.mx) apunte a Vercel, se cambia
SITE_ORIGIN aqui, se vuelve a correr, y todas las paginas quedan al dia:

    python scripts/seo.py

Paginas excluidas del sitemap y marcadas noindex: las plantillas y todo
lo que no sea contenido publico.
"""

import os
import re
import sys
from datetime import date

# --- Unico lugar donde vive el dominio -------------------------------------
SITE_ORIGIN = "https://cisa1.vercel.app"
SITE_NAME = "Grupo CISA"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Directorios que nunca se publican
SKIP_DIRS = {".git", ".impeccable", "preview", "node_modules", "scripts", "docs", "agente-cisa"}
# Archivos que existen pero no son paginas indexables
SKIP_FILES = {"_plantilla.html"}

# Prioridad en el sitemap por seccion
PRIORITY = [
    (re.compile(r"^index\.html$"), "1.0", "weekly"),
    (re.compile(r"^(su-terreno|desarrollos|inversion|contacto)\.html$"), "0.9", "weekly"),
    (re.compile(r"^desarrollos/"), "0.8", "weekly"),
    (re.compile(r"^(nosotros|contenido)\.html$"), "0.7", "monthly"),
    (re.compile(r"^contenido/"), "0.6", "monthly"),
]

# Etiquetas que este script administra. Se borran y se vuelven a escribir
# para que correrlo dos veces no duplique nada.
MANAGED = re.compile(
    r'[ \t]*<(?:link|meta)[^>]*(?:rel="canonical"'
    r'|property="og:(?:url|type|site_name|locale)"'
    r'|name="twitter:card")[^>]*>\r?\n?',
    re.IGNORECASE,
)


def html_pages():
    """Todas las paginas publicas, como rutas relativas con / como separador."""
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for name in sorted(filenames):
            if not name.endswith(".html") or name in SKIP_FILES:
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), ROOT)
            yield rel.replace(os.sep, "/")


def url_for(rel_path):
    """La URL canonica. index.html es la raiz del sitio."""
    if rel_path == "index.html":
        return SITE_ORIGIN + "/"
    return SITE_ORIGIN + "/" + rel_path


def sitemap_meta(rel_path):
    for pattern, priority, freq in PRIORITY:
        if pattern.search(rel_path):
            return priority, freq
    return "0.5", "monthly"


def inject(rel_path):
    path = os.path.join(ROOT, rel_path)
    with open(path, "r", encoding="utf-8", newline="") as fh:
        html = fh.read()

    if "<head>" not in html:
        print("  ! sin <head>, se omite: " + rel_path)
        return False

    cleaned = MANAGED.sub("", html)
    url = url_for(rel_path)

    block = (
        '  <link rel="canonical" href="{url}" />\n'
        '  <meta property="og:url" content="{url}" />\n'
        '  <meta property="og:type" content="{og_type}" />\n'
        '  <meta property="og:site_name" content="{site}" />\n'
        '  <meta property="og:locale" content="es_MX" />\n'
        '  <meta name="twitter:card" content="summary_large_image" />\n'
    ).format(
        url=url,
        og_type="article" if rel_path.startswith("contenido/") else "website",
        site=SITE_NAME,
    )

    # Va despues de <meta charset>, que debe seguir siendo lo primero del <head>.
    charset = re.search(r'[ \t]*<meta[^>]*charset[^>]*>\r?\n?', cleaned, re.IGNORECASE)
    if charset:
        cut = charset.end()
        updated = cleaned[:cut] + block + cleaned[cut:]
    else:
        updated = cleaned.replace("<head>", "<head>\n" + block.rstrip("\n"), 1)

    if updated == html:
        return False
    with open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(updated)
    return True


def write_sitemap(pages):
    today = date.today().isoformat()
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for rel in pages:
        priority, freq = sitemap_meta(rel)
        lines += [
            "  <url>",
            "    <loc>{}</loc>".format(url_for(rel)),
            "    <lastmod>{}</lastmod>".format(today),
            "    <changefreq>{}</changefreq>".format(freq),
            "    <priority>{}</priority>".format(priority),
            "  </url>",
        ]
    lines.append("</urlset>")
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(lines) + "\n")


def write_robots():
    body = (
        "# Grupo CISA\n"
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "# Endpoints y material que no aporta nada en un indice de busqueda\n"
        "Disallow: /api/\n"
        "Disallow: /contenido/_plantilla.html\n"
        "\n"
        "Sitemap: {origin}/sitemap.xml\n"
    ).format(origin=SITE_ORIGIN)
    with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(body)


def main():
    pages = sorted(html_pages())
    if not pages:
        print("No se encontraron paginas.")
        return 1

    changed = 0
    for rel in pages:
        if inject(rel):
            changed += 1

    write_sitemap(pages)
    write_robots()

    print("Origen:   " + SITE_ORIGIN)
    print("Paginas:  {} ({} actualizadas)".format(len(pages), changed))
    print("Escritos: sitemap.xml, robots.txt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
