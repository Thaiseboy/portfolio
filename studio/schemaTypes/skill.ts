import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons/Bolt'

export const skillLevels = [
  {title: 'Beginner', value: 'beginner'},
  {title: 'Intermediate', value: 'intermediate'},
  {title: 'Advanced', value: 'advanced'},
]

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      description: 'De naam van de vaardigheid, bijv. React of Laravel.',
      type: 'string',
      validation: (rule) => rule.required().error('Vul een naam in.'),
    }),
    defineField({
      name: 'level',
      title: 'Niveau',
      description: 'Op de site als 1, 2 of 3 rode blokjes.',
      type: 'string',
      options: {list: skillLevels, layout: 'radio', direction: 'horizontal'},
      initialValue: 'intermediate',
      validation: (rule) => rule.required().error('Kies een niveau.'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Liefst een vierkant logo met transparante of witte achtergrond.',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  orderings: [{title: 'Naam (A–Z)', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', level: 'level', media: 'logo'},
    prepare({title, level, media}) {
      const label = skillLevels.find((option) => option.value === level)?.title
      return {title: title || 'Naamloze skill', subtitle: label ?? 'Geen niveau', media}
    },
  },
})
