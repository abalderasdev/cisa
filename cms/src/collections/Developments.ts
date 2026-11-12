import type { Access, CollectionConfig } from 'payload'

const readAccess: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

export const Developments: CollectionConfig = {
  slug: 'developments',
  admin: { useAsTitle: 'title' },
  access: { read: readAccess },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: ['itzae', 'panorama', 'residencial-fraile', 'summit'],
    },
    { name: 'summary', type: 'textarea' },
    { name: 'location', type: 'text' },
    { name: 'stage', type: 'text' },
    { name: 'delivery', type: 'text' },
    { name: 'units', type: 'text' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
  ],
}
