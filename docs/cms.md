# CMS headless Payload de CISA

## Qué es

Payload 3 vive en la carpeta `cms/`. Es un CMS headless para Grupo CISA. **No sustituye** el HTML estático del repositorio ni el editor en vivo (que escribe HTML y abre pull requests en GitHub).

En la Fase 1 de Payload están: `developments` (desarrollos), `posts` (blog) y el global `Site` (menú y footer). También hay `Media` y `Users`.

Regla: un mismo campo no debe editarse a la vez en Payload y en el editor de GitHub.

## Cómo se conecta el HTML

El front puede consumir la API REST pública (solo documentos publicados). URL base de producción: `https://cms.cisa.abdev.io`.

`PAYLOAD_PUBLIC_SERVER_URL` define `serverURL`, **csrf** y el primer origen de **cors**. En local usa `http://localhost:3000` para que el admin no falle. CORS también incluye siempre `https://www.gcisa.mx` y `https://cisa1.vercel.app`.

Ejemplos:

- `GET /api/developments?where[_status][equals]=published&depth=1`
- `GET /api/posts?where[_status][equals]=published&depth=1`
- `GET /api/globals/site`

```js
const res = await fetch(
  'https://cms.cisa.abdev.io/api/developments?where[_status][equals]=published&depth=1'
)
const data = await res.json()
```

GraphQL opcional: `/api/graphql`. Panel admin: `/admin`. Health: `/api/health`.

## Media (uploads)

Los archivos de la colección Media se guardan en el directorio `media/` relativo al proceso del proceso (`staticDir: 'media'`).

- Local: `cms/media/`
- Contenedor: `/app/media`

En Docker Compose el volumen nombrado `cisa-cms-media` se monta en `/app/media` para que los uploads no se pierdan al redesplegar. En Coolify hay que montar un volumen persistente en la misma ruta `/app/media`.

## Schema Postgres `cisa`

El adaptador usa `schemaName` / `PAYLOAD_SCHEMA=cisa`.

**En el VPS ABDev el schema `cisa` YA existe** en el Postgres compartido de Supabase. No lo vuelvas a crear, no levantes un Postgres nuevo para este CMS y no abras el puerto 5432.

SQL de referencia **solo si alguien monta otro entorno desde cero** (no ejecutar otra vez en ABDev):

```sql
CREATE SCHEMA IF NOT EXISTS cisa;

-- Ajusta el rol al usuario de la app (p. ej. cisa_app):
GRANT USAGE ON SCHEMA cisa TO cisa_app;
GRANT CREATE ON SCHEMA cisa TO cisa_app;
GRANT ALL ON ALL TABLES IN SCHEMA cisa TO cisa_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cisa TO cisa_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA cisa
  GRANT ALL ON TABLES TO cisa_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA cisa
  GRANT ALL ON SEQUENCES TO cisa_app;
```

## Desarrollo local

```bash
cd cms
cp .env.example .env
# PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
# PAYLOAD_SECRET=...
# DATABASE_URL=...
npm install
npm run dev
```

Admin: `http://localhost:3000/admin`. Las cookies usan `secure` solo cuando `NODE_ENV=production`, para que el login funcione en HTTP local.

## Coolify en el VPS ABDev (2.25.92.86)

- Build Pack: Dockerfile (contexto `cms/` o Dockerfile en `/cms/Dockerfile`)
- Puerto interno: 3000 (no hace falta mapear `3000:3000` al host; Traefik/Coolify usa el puerto del contenedor)
- Healthcheck: `/api/health` (la imagen instala `wget` en el runner para el `HEALTHCHECK`)
- Dominio: `https://cms.cisa.abdev.io`
- Destination: red Docker del Postgres/Supabase compartido (`COMPOSE_NETWORK`)
- Hostname típico de la base: `supabase-db`
- Schema: `cisa` (`PAYLOAD_SCHEMA=cisa`) — ya creado; no recrear
- Volumen persistente: `/app/media` (uploads)
- No publicar el puerto 5432

Variables: `PAYLOAD_SECRET`, `DATABASE_URL`, `PAYLOAD_PUBLIC_SERVER_URL=https://cms.cisa.abdev.io`, `PAYLOAD_SCHEMA=cisa`.

El DNS y el deploy los hacen otros agentes (Coolify Bot / VPS ABDev). Este PR no se fusiona a `main` hasta que ABDev_git lo revise.
