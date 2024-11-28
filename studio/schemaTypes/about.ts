import { defineType } from 'sanity';

export default defineType({
  name: 'aboutMePhotos',
  title: 'About Me Photos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Een korte titel voor de foto',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Een korte beschrijving van de foto',
    },
  ],
});