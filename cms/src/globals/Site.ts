import type { GlobalConfig } from 'payload'

export const Site: GlobalConfig = {
  slug: 'site',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactWhatsApp',
      type: 'text',
    },
    {
      name: 'footerNote',
      type: 'textarea',
    },
  ],
}
