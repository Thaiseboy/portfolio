import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {nlNLLocale} from '@sanity/locale-nl-nl'
import {schemaTypes} from './schemaTypes'
import {ABOUT_TEMPLATE_ID, singletonTypes, structure, websiteTypes} from './structure'
import {ABOUT_DEFAULTS} from './shared/aboutDefaults.js'
import {startTool} from './tools/StartTool'
import {ViewOnSiteAction} from './actions/ViewOnSiteAction'

// The CV and the About text can only be published or reverted, never duplicated or deleted.
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
    // No "new CV" or "new About text" template: the structure opens each one directly.
    templates: (templates) => [
      ...templates.filter(
        ({schemaType}) => !singletonTypes.has(schemaType) && !websiteTypes.has(schemaType),
      ),
      // Fills the About text with the current site texts the first time it is opened.
      {
        id: ABOUT_TEMPLATE_ID,
        title: 'Tekst Over mij',
        schemaType: 'aboutPage',
        value: ABOUT_DEFAULTS,
      },
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
    // Messages come from the contact form: they are only deleted, by hand.
    actions: (actions, {schemaType}) =>
      websiteTypes.has(schemaType)
        ? actions.filter(({action}) => action === 'delete')
        : singletonTypes.has(schemaType)
          ? [
              ...actions.filter(({action}) => action && singletonActions.has(action)),
              ViewOnSiteAction,
            ]
          : [...actions, ViewOnSiteAction],
    // "Skill met niveau" is only offered inside the per-level skill lists; the About text is never new.
    newDocumentOptions: (options, {creationContext}) =>
      options.filter(
        ({templateId}) =>
          templateId !== ABOUT_TEMPLATE_ID &&
          (creationContext.type !== 'global' || templateId !== 'skill-with-level'),
      ),
  },
})
