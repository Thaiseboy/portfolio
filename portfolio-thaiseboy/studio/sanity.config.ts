import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portfolio thaiseboy',

  projectId: 'w696z6zz',
  dataset: 'portfolio-thaiseboy',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
