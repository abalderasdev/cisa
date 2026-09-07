#!/usr/bin/env python3
"""
Revisa los enlaces internos del sitio: archivos que no existen y anclas
(#id) que no tienen destino en la pagina apuntada.

    python scripts/check_links.py

Sale con codigo 1 si encuentra algo roto, para poder usarlo en CI.
"""

import io
import os
import re
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", ".impeccable", "preview", "node_modules", "scripts"}

HREF = re.compile(r'\bhref="([^"]+)"')
ID = re.compile(r'\bid="([^"]+)"')
NAME_ANCHOR = re.compile(r'<a\b[^>]*\bname="([^"]+)"')


def pages():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for name in sorted(filenames):
            if name.endswith(".html"):
                rel = os.path.relpath(os.path.join(dirpath, name), ROOT)
                yield rel.replace(os.sep, "/")


def main():
    files = list(pages())
    text = {}
    ids = {}
    for rel in files:
        body = io.open(os.path.join(ROOT, rel), encoding="utf-8", newline="").read()
        text[rel] = body
        ids[rel] = set(ID.findall(body)) | set(NAME_ANCHOR.findall(body))

    problemas = defaultdict(list)

    for rel in files:
        base = os.path.dirname(rel)
        for href in set(HREF.findall(text[rel])):
            if re.match(r"^(https?:|mailto:|tel:|data:|javascript:)", href):
                continue
            # Marcadores de plantilla (__REL_1_HREF__): se rellenan al generar.
            if "__" in href:
                continue

            target, _, frag = href.partition("#")

            if not target:
                # Ancla dentro de la misma pagina
                if frag and frag not in ids[rel]:
                    problemas[rel].append("ancla inexistente en esta pagina: #" + frag)
                continue

            if target.startswith("/"):
                # Ruta absoluta: cuelga de la raiz del sitio, no de la pagina.
                destino = os.path.normpath(target.lstrip("/")).replace(os.sep, "/")
            else:
                destino = os.path.normpath(os.path.join(base, target)).replace(os.sep, "/")
            if not os.path.exists(os.path.join(ROOT, destino)):
                problemas[rel].append("archivo inexistente: " + href)
                continue

            if frag and destino in ids and frag not in ids[destino]:
                problemas[rel].append(
                    "ancla inexistente en {}: #{}".format(destino, frag))

    if not problemas:
        print("{} paginas revisadas. Sin enlaces internos rotos.".format(len(files)))
        return 0

    total = 0
    for rel in sorted(problemas):
        print("\n" + rel)
        for msg in sorted(set(problemas[rel])):
            print("  - " + msg)
            total += 1
    print("\n{} problemas en {} paginas.".format(total, len(problemas)))
    return 1


if __name__ == "__main__":
    sys.exit(main())
