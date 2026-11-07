#!/usr/bin/env node
/**
 * Normaliza los logos de la seccion "Aliados" para que se vean homologados.
 *
 * Que hace:
 *   1. Quita el fondo solido quemado en la imagen (CARVID venia con gris
 *      #F7F7F7, FUNDACION con crema, CAPITALTA y KIMBRA con blanco) usando
 *      flood fill desde los bordes, para no comerse el blanco interno del logo.
 *   2. Recorta cada logo a su caja de contenido real.
 *   3. Los guarda en WebP con canal alfa, a resolucion nativa.
 *
 * Con esto todos los logos quedan transparentes y el CSS los escala al mismo
 * ancho dentro de tarjetas cuadradas identicas.
 *
 * Requisito: sharp (no viene en el repo, es solo para este script)
 *   npm i -D sharp
 *   node scripts/normalize-ally-logos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('Falta sharp. Instala con:  npm i -D sharp');
  process.exit(1);
}

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'aliados');
const TOL = 30; // tolerancia de color para detectar el fondo

const near = (a, b, tol = TOL) =>
  Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol && Math.abs(a[2] - b[2]) <= tol;

/** Marca como transparente todo pixel contiguo al borde que coincida con el fondo. */
function removeBg(data, w, h, ch, bg) {
  const seen = new Uint8Array(w * h);
  const queue = [];
  const push = (x, y) => {
    const k = y * w + x;
    if (seen[k]) return;
    const i = k * ch;
    if (data[i + 3] < 250) { seen[k] = 1; return; }
    if (!near([data[i], data[i + 1], data[i + 2]], bg)) return;
    seen[k] = 1;
    queue.push(k);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (queue.length) {
    const k = queue.pop();
    data[k * ch + 3] = 0;
    const x = k % w;
    const y = (k / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
}

/**
 * Segunda pasada: el logo de KIMBRA tiene el interior de su marco verde en
 * blanco, y como esta encerrado el flood fill no lo alcanza — se quedaba un
 * bloque blanco al fondo. Aqui se quitan las areas ENCERRADAS de color fondo.
 *
 * Usa tolerancia alta (90) porque solo entra lo que este encerrado dentro
 * del logo, y exige un area minima del 3% para no tocar detalles pequenos
 * (la linea gris del techo de CARVID, por ejemplo, queda intacta).
 */
function removeEnclosed(data, w, h, ch, bg, minShare, tol) {
  const seen = new Uint8Array(w * h);
  const minArea = Math.round(w * h * minShare);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      if (seen[k]) continue;
      const i = k * ch;
      if (data[i + 3] < 250 || !near([data[i], data[i + 1], data[i + 2]], bg, tol)) { seen[k] = 1; continue; }
      const comp = [];
      const queue = [k];
      seen[k] = 1;
      while (queue.length) {
        const c = queue.pop();
        comp.push(c);
        const cx = c % w, cy = (c / w) | 0;
        const nb = [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]];
        for (const [nx, ny] of nb) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const nk = ny * w + nx;
          if (seen[nk]) continue;
          const ni = nk * ch;
          if (data[ni + 3] < 250 || !near([data[ni], data[ni + 1], data[ni + 2]], bg, tol)) { seen[nk] = 1; continue; }
          seen[nk] = 1;
          queue.push(nk);
        }
      }
      if (comp.length >= minArea) for (const c of comp) data[c * ch + 3] = 0;
    }
  }
}

/** Caja que envuelve el contenido con alfa. */
function contentBox(data, w, h, ch) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * ch + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

const sources = fs.readdirSync(DIR).filter((f) => f.endsWith('.png')).sort();

for (const file of sources) {
  const src = path.join(DIR, file);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;

  let opaque = 0;
  for (let i = 3; i < data.length; i += ch) if (data[i] > 250) opaque++;
  if (opaque / (w * h) > 0.7) {
    const bg = [data[0], data[1], data[2]];
    removeBg(data, w, h, ch, bg);
    removeEnclosed(data, w, h, ch, bg, 0.03, 90);
  }

  const box = contentBox(data, w, h, ch);
  if (!box) {
    console.warn(`  ${file}: sin contenido, se omite`);
    continue;
  }

  // PNG intermedio: obliga a sharp a materializar el canal alfa.
  const png = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: box.left, top: box.top, width: box.width, height: box.height })
    .png()
    .toBuffer();

  const out = path.join(DIR, file.replace(/\.png$/, '.webp'));
  await sharp(png).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(out);

  console.log(
    `  ${file.padEnd(18)} ${String(w).padStart(4)}x${String(h).padEnd(4)} -> ` +
    `${file.replace(/\.png$/, '.webp').padEnd(18)} ${box.width}x${box.height} ` +
    `(${(fs.statSync(out).size / 1024).toFixed(1)} KB)`
  );
}
