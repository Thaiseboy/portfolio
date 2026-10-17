import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {nlNLLocale} from '@sanity/locale-nl-nl'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'
import {startTool} from './tools/StartTool'
import {ViewOnSiteAction} from './actions/ViewOnSiteAction'

// The CV can only be published or reverted, never duplicated or deleted.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Portfolio thaiseboy',

  projectId: 'w696z6zz',
  dataset: 'portfolio-thaiseboy',

  plugins: [
    structureTool({structure}),
    codeInput(),
    // Studio buttons and menus in Dutch ("Publiceren" instead of "Publish").
    nlNLLocale(),
    visionTool(),
  ],

  // The start screen opens first.
  tools: (tools) => [startTool, ...tools],

  schema: {
    types: schemaTypes,
    // No "new CV" template: the structure opens the one CV directly.
    templates: (templates) => [
      ...templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
      {
        id: 'skill-with-level',
        title: 'Skill met niveau',
        schemaType: 'skill',
        parameters: [{name: 'level', type: 'string'}],
        value: (params: {level: string}) => ({level: params.level}),
      },
    ],
  },

  document: {
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? [
            ...actions.filter(({action}) => action && singletonActions.has(action)),
            ViewOnSiteAction,
          ]
        : [...actions, ViewOnSiteAction],
    // "Skill met niveau" is only offered inside the per-level skill lists.
    newDocumentOptions: (options, {creationContext}) =>
      creationContext.type === 'global'
        ? options.filter(({templateId}) => templateId !== 'skill-with-level')
        : options,
  },
})
