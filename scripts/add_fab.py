#!/usr/bin/env python3
"""
Pone el FAB del agente CISA en todas las paginas publicas.

Hasta ahora solo estaba en index.html, aunque el informe del 2 sep 2026 le
dijo a CISA que aparecia en todo el sitio.

Se inserta exactamente el mismo bloque que ya vive en el home, con rutas
absolutas para que funcione igual en /, /desarrollos/ y /contenido/. No se
toca ninguna variable de color: el FAB usa --brand-green, --brand-green-dark,
--brand-green-light e --ink-900, que las 28 paginas ya definen con los mismos
valores.

Es idempotente: si la pagina ya lo tiene, no hace nada.

    python scripts/add_fab.py
"""

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", ".impeccable", "preview", "node_modules", "scripts"}
SKIP_FILES = {"_plantilla.html"}

BLOQUE = """
<!-- Agent CISA · FAB flotante (esquina inferior derecha)
     El personaje CISA acompana toda la navegacion: loop idle, saludo
     automatico cada 8-12s, hover de interaccion, y click para abrir chat.
     El widget de ElevenLabs se monta on-demand en el primer click. -->
<button type="button" id="agent-cisa-fab" data-state="idle" aria-label="Hablar con CISA, asistente virtual de Grupo CISA" title="Hablar con CISA">
  <span class="agent-fab__clip">
    <video id="agent-cisa-fab-video" class="agent-fab__video" muted playsinline loop preload="auto" aria-hidden="true">
      <source src="/assets/agent-cisa-idle.mp4" type="video/mp4">
    </video>
  </span>
  <span class="agent-fab__pulse" aria-hidden="true"></span>
  <span class="agent-fab__tag" aria-hidden="true">
    <span class="agent-fab__dot"></span>
    <span>En vivo</span>
  </span>
  <span class="agent-fab__tip" aria-hidden="true">Hablar con CISA</span>
</button>

<link rel="stylesheet" href="/assets/agent-cisa-fab.css">
<script src="/assets/agent-cisa-fab.js" defer></script>
"""


def paginas():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for name in sorted(filenames):
            if name.endswith(".html") and name not in SKIP_FILES:
                rel = os.path.relpath(os.path.join(dirpath, name), ROOT)
                yield rel.replace(os.sep, "/")


def main():
    puestas, ya_estaban = [], []

    for rel in sorted(paginas()):
        path = os.path.join(ROOT, rel)
        html = io.open(path, encoding="utf-8", newline="").read()

        if 'id="agent-cisa-fab"' in html:
            # Normaliza el bloque existente del home a rutas absolutas.
            nuevo = re.sub(r'(src|href)="assets/(agent-cisa-(?:fab\.(?:css|js)|idle\.mp4))"',
                           r'\1="/assets/\2"', html)
            if nuevo != html:
                io.open(path, "w", encoding="utf-8", newline="").write(nuevo)
            ya_estaban.append(rel)
            continue

        if "</body>" not in html:
            print("  ! sin </body>, se omite: " + rel)
            continue

        io.open(path, "w", encoding="utf-8", newline="").write(
            html.replace("</body>", BLOQUE + "</body>", 1))
        puestas.append(rel)

    print("FAB agregado en {} paginas:".format(len(puestas)))
    for rel in puestas:
        print("  + " + rel)
    print("Ya lo tenian: {} ({})".format(len(ya_estaban), ", ".join(ya_estaban) or "-"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
