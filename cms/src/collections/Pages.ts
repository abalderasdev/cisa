import type { Access, CollectionConfig } from 'payload'

const readAccess: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: readAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: [
        'home',
        'su-terreno',
        'desarrollos',
        'inversion',
        'nosotros',
        'contacto',
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
