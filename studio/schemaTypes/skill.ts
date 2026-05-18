export default {
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'De naam van de vaardigheid (bijv. HTML, CSS, JavaScript).',
    },
    {
      name: 'level',
      title: 'Level',
      type: 'string',
      description: 'Het niveau van de vaardigheid (bijv. beginner, intermediate, advanced).',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio', 
      },
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true, 
      },
      description: 'Upload het logo van de vaardigheid.',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
}
