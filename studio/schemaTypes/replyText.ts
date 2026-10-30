import {defineArrayMember, defineField, defineType} from 'sanity'
import {UnderlineIcon} from '@sanity/icons/Underline'
import {replyLinkHref} from '../shared/replyRules.js'

// Text of a reply mail: paragraphs, lists, bold, italic, underline and links. No headings or colours,
// so every mail keeps the house style. Checked again by the website (normalizeReplyBody).
export default defineType({
  name: 'replyText',
  title: 'Bericht',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Alinea', value: 'normal'}],
      lists: [
        {title: 'Opsomming', value: 'bullet'},
        {title: 'Genummerde lijst', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Vet', value: 'strong'},
          {title: 'Cursief', value: 'em'},
          {title: 'Onderstrepen', value: 'underline', icon: UnderlineIcon},
        ],
        annotations: [
          defineArrayMember({
            name: 'replyLink',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Link',
                description:
                  'Een volledige URL (https://…), een e-mailadres (mailto:…) of een telefoonnummer (tel:…).',
                type: 'url',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({scheme: ['http', 'https', 'mailto', 'tel']})
                    .custom((value) =>
                      !value || replyLinkHref(value) ? true : 'Deze link kan niet in een mail.',
                    ),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
