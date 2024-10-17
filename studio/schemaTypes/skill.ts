type RuleType = {
  min: (arg: number) => RuleType
  max: (arg: number) => RuleType
  error: (msg: string) => RuleType
}

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
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Een percentage (0-100) dat aangeeft hoe goed je bent in deze vaardigheid.',
      validation: (Rule: RuleType) =>
        Rule.min(0).max(100).error('Rating moet een waarde tussen 0 en 100 zijn.'),
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
}
