# CMS headless Payload de CISA

## Qué es

Payload 3 reside en la carpeta `cms/`. Es un CMS headless para Grupo CISA. No sustituye el HTML estático del repositorio ni el editor en vivo, que escribe HTML y abre pull requests en GitHub.

En la Fase 1 de Payload se incluyen developments (desarrollos), posts (blog) y el global Site (menú y footer). También están disponibles Media y Users. Regla: un mismo campo no debe editarse al mismo tiempo en Payload y en el editor de GitHub.

## Cómo se conecta el HTML

El front-end puede consumir la API REST pública, que expone únicamente documentos publicados. URL base: `https://cms.cisa.abdev.io`. CORS permite los orígenes `https://www.gcisa.mx` y `https://cisa1.vercel.app`.

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

GraphQL es opcional y está disponible en `/api/graphql`. El panel de administración está en `/admin`.

## Desarrollo local

```bash
cd cms
cp .env.example .env
npm install
npm run dev
```

El panel de administración está en `http://localhost:3000/admin`. El endpoint de salud está en `http://localhost:3000/api/health`.

## Despliegue en Coolify en el VPS ABDev (2.25.92.86)

- Build Pack: Dockerfile, con contexto `cms/` o con el Dockerfile en `/cms/Dockerfile`
- Puerto: 3000
- Healthcheck: `/api/health`
- Dominio: `https://cms.cisa.abdev.io`
- Destination: red Docker del Postgres/Supabase compartido (`COMPOSE_NETWORK`)
- Hostname típico de la base de datos: `supabase-db`
- Schema de Postgres: `cisa` (`PAYLOAD_SCHEMA=cisa`)
- No publicar el puerto 5432

Variables de entorno: `PAYLOAD_SECRET`, `DATABASE_URL`, `PAYLOAD_PUBLIC_SERVER_URL=https://cms.cisa.abdev.io` y `PAYLOAD_SCHEMA=cisa`.

El DNS y el despliegue están a cargo de otros agentes (Coolify Bot y VPS ABDev). Este PR no debe fusionarse a `main` hasta que ABDev_git lo revise.
