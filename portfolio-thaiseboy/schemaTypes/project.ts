export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'De naam van het project.',
    },
    {
      name: 'description',
      title: 'Beschrijving',
      type: 'text',
      description: 'Een korte beschrijving van het project.',
    },
    {
      name: 'image',
      title: 'Afbeelding',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Een afbeelding van het project.',
    },
    {
      name: 'url',
      title: 'Project URL',
      type: 'url',
      description: 'Een link naar het live project.',
    },
    {
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
      description: 'Een link naar de GitHub-repository.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
}
