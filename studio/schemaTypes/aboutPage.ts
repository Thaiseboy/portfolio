import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

// One document with the texts of the About section; the structure opens it directly (see structure.ts).
// The photos next to it are separate documents ("Foto's Over mij").
export default defineType({
  name: 'aboutPage',
  title: 'Tekst Over mij',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'De grote titel van de sectie, bijv. "Get to know me".',
      type: 'string',
      validation: (rule) => rule.required().error('Vul een titel in.'),
    }),
    defineField({
      name: 'tagline',
      title: 'Label',
      description: 'De korte regel in het label boven de kop.',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      description: 'De kop boven de tekst. Het gemarkeerde deel komt er direct achter.',
      type: 'string',
      validation: (rule) => rule.required().error('Vul een kop in.'),
    }),
    defineField({
      name: 'highlight',
      title: 'Gemarkeerd deel van de kop',
      description: 'Staat achter de kop, met de accentkleur als achtergrond. Mag leeg blijven.',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Tekst',
      description: "De alinea's over jou. Vet, cursief, lijsten en links kunnen ook.",
      type: 'richText',
      validation: (rule) => rule.required().error('Schrijf minstens één alinea.'),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline'},
  },
})
