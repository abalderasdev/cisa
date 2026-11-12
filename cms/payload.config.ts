import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import { Developments } from './src/collections/Developments'
import { Posts } from './src/collections/Posts'
import { Site } from './src/globals/Site'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://cms.cisa.abdev.io'
const corsOrigins = Array.from(new Set([serverURL, 'https://www.gcisa.mx', 'https://cisa1.vercel.app']))

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  csrf: [serverURL],
  cors: corsOrigins,
  cookiePrefix: 'cisa',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    schemaName: process.env.PAYLOAD_SCHEMA || 'cisa',
  }),
  editor: lexicalEditor(),
  collections: [Users, Media, Pages, Developments, Posts],
  globals: [Site],
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
})
