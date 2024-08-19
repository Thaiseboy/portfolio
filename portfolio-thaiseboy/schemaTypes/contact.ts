export default {
  name: 'cv',
  title: 'CV',
  type: 'document',
  fields: [
    {
      name: 'cvFile',
      title: 'CV Bestand',
      type: 'file',
      description: 'Upload hier je meest recente CV.',
      options: {
        storeOriginalFilename: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'cvFile.originalFilename',
    },
  },
}
