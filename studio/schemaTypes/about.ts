import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

export default defineType({
  name: 'aboutMePhotos',
  title: "Foto's Over mij",
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Een korte titel voor de foto; schermlezers lezen deze voor.',
      type: 'string',
      validation: (rule) => rule.required().warning('Een titel helpt bezoekers met een schermlezer.'),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      description: 'Wordt vierkant getoond. Klik op het potloodje om het belangrijkste deel te kiezen.',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required().error('Kies een foto.'),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      description: 'Een korte beschrijving van de foto (alleen voor jezelf).',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', media: 'image'},
  },
})
