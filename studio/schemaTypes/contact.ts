import {defineField, defineType} from 'sanity'
import {DocumentPdfIcon} from '@sanity/icons/DocumentPdf'

// One CV document; the structure opens it directly (see structure.ts).
export default defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'cvFile',
      title: 'CV-bestand',
      description:
        'Upload hier je meest recente CV als PDF. Bezoekers downloaden het via "Download CV".',
      type: 'file',
      options: {storeOriginalFilename: true, accept: 'application/pdf'},
      validation: (rule) => rule.required().error('Upload een PDF.'),
    }),
  ],
  preview: {
    select: {title: 'cvFile.asset.originalFilename'},
    prepare: ({title}) => ({title: title || 'Nog geen CV geüpload'}),
  },
})
