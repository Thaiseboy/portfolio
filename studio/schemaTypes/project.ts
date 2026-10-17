import {defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons/Projects'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'media', title: 'Afbeelding'},
    {name: 'links', title: 'Links'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'De naam van het project. Op de site in hoofdletters.',
      type: 'string',
      group: 'content',
      validation: (rule) => [
        rule.required().error('Vul een titel in.'),
        rule.max(90).warning('Een korte titel past beter op de projectkaart.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      description:
        'Gebruik Enter voor een nieuwe alinea. Kopjes, lijstjes, links en codeblokken vind je in de balk boven het tekstvak. De eerste regels staan op de kaart; de rest zie je na "Read more".',
      type: 'richText',
      group: 'content',
      validation: (rule) => rule.required().error('Schrijf een beschrijving.'),
    }),
    defineField({
      name: 'tags',
      title: 'Gebruikte technieken',
      description: 'Bijv. React, TypeScript, Laravel. Typ een techniek en druk op Enter.',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'order',
      title: 'Volgorde',
      description: 'Lager nummer staat hoger op de site. Leeg laten zet het project onderaan.',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Afbeelding',
      description: 'Een screenshot van het project. Klik op het potloodje om het belangrijkste deel te kiezen.',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Omschrijving voor schermlezers',
          description: 'Wat staat er op de afbeelding? Bijv. "Dashboard van de inspectie-app".',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'Live website',
      description: 'De link naar het live project, beginnend met https://',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'github',
      title: 'GitHub',
      description: 'De link naar de GitHub-repository.',
      type: 'url',
      group: 'links',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
  ],
  orderings: [
    {title: 'Volgorde op de site', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Titel (A–Z)', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', tags: 'tags', order: 'order', media: 'image'},
    prepare({title, tags, order, media}) {
      const position = typeof order === 'number' ? `#${order}` : 'Geen volgorde'
      const stack = Array.isArray(tags) && tags.length > 0 ? tags.join(' · ') : 'Geen technieken'
      return {title: title || 'Naamloos project', subtitle: `${position} — ${stack}`, media}
    },
  },
})
