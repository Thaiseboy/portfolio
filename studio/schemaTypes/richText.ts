import {defineArrayMember, defineField, defineType} from 'sanity'

// Formatted text for project descriptions: headings, lists, links and code.
// No h1/h2: the project title is already the heading on the site.
export default defineType({
  name: 'richText',
  title: 'Opgemaakte tekst',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Alinea', value: 'normal'},
        {title: 'Kop', value: 'h3'},
        {title: 'Subkop', value: 'h4'},
        {title: 'Citaat', value: 'blockquote'},
      ],
      lists: [
        {title: 'Opsomming', value: 'bullet'},
        {title: 'Genummerde lijst', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Vet', value: 'strong'},
          {title: 'Cursief', value: 'em'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Adres',
                description: 'Een volledige URL (https://…) of een e-mailadres (mailto:…).',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['http', 'https', 'mailto']}),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'code',
      title: 'Codeblok',
      options: {
        withFilename: true,
        languageAlternatives: [
          {title: 'TypeScript', value: 'typescript'},
          {title: 'JavaScript', value: 'javascript'},
          {title: 'JSX / TSX', value: 'tsx'},
          {title: 'PHP', value: 'php'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'JSON', value: 'json'},
          {title: 'Shell', value: 'sh'},
          {title: 'SQL', value: 'sql'},
        ],
      },
    }),
  ],
})
