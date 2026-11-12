import type { Access, CollectionConfig } from 'payload'

const readAccess: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'audience',
      type: 'select',
      options: [
        'dueno-de-terreno',
        'comprador',
        'inversionista',
        'general',
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
