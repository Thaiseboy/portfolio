import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {BoltIcon} from '@sanity/icons/Bolt'
import {InboxIcon} from '@sanity/icons/Inbox'
import {DocumentPdfIcon} from '@sanity/icons/DocumentPdf'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {ImagesIcon} from '@sanity/icons/Images'
import {ProjectsIcon} from '@sanity/icons/Projects'
import {skillLevels} from './schemaTypes/skill'
import {ABOUT_DOCUMENT_ID} from './shared/aboutDefaults.js'
import {apiVersion} from './siteUrl'

// Only one CV and one About text exist; they are opened directly instead of through a list.
export const singletonTypes = new Set(['cv', 'aboutPage'])

// Starts the About text with the current site texts (see sanity.config.ts).
export const ABOUT_TEMPLATE_ID = 'about-page-defaults'

// Created by the website only: no "new" button, only delete.
export const websiteTypes = new Set(['contactMessage'])

function messageList(S: StructureBuilder, id: string, title: string, filter: string) {
  return S.listItem()
    .id(id)
    .title(title)
    .schemaType('contactMessage')
    .child(
      S.documentList()
        .id(id)
        .title(title)
        .schemaType('contactMessage')
        .apiVersion(apiVersion)
        .filter(filter)
        .defaultOrdering([{field: 'receivedAt', direction: 'desc'}])
        .initialValueTemplates([]),
    )
}

function skillList(S: StructureBuilder, id: string, title: string, level: string | null) {
  return S.listItem()
    .id(id)
    .title(title)
    .schemaType('skill')
    .child(
      S.documentList()
        .id(id)
        .title(title)
        .schemaType('skill')
        .apiVersion(apiVersion)
        .filter(level ? '_type == "skill" && level == $level' : '_type == "skill"')
        .params(level ? {level} : {})
        .defaultOrdering([{field: 'name', direction: 'asc'}])
        .initialValueTemplates([
          level
            ? S.initialValueTemplateItem('skill-with-level', {level})
            : S.initialValueTemplateItem('skill'),
        ]),
    )
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Inhoud')
    .items([
      S.listItem()
        .id('inbox')
        .title('Inbox')
        .icon(InboxIcon)
        .child(
          S.list()
            .id('inbox')
            .title('Inbox')
            .items([
              messageList(
                S,
                'inbox-unread',
                'Ongelezen',
                '_type == "contactMessage" && unread == true',
              ),
              messageList(S, 'inbox-all', 'Alle berichten', '_type == "contactMessage"'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .id('projects')
        .title('Projecten')
        .icon(ProjectsIcon)
        .schemaType('project')
        .child(
          S.documentTypeList('project')
            .title('Projecten')
            .defaultOrdering([
              {field: 'order', direction: 'asc'},
              {field: '_createdAt', direction: 'desc'},
            ]),
        ),
      S.listItem()
        .id('skills')
        .title('Skills')
        .icon(BoltIcon)
        .child(
          S.list()
            .id('skills')
            .title('Skills')
            .items([
              skillList(S, 'skills-all', 'Alle skills', null),
              S.divider(),
              ...skillLevels
                .slice()
                .reverse()
                .map(({title, value}) => skillList(S, `skills-${value}`, title, value)),
            ]),
        ),
      S.listItem()
        .id('about')
        .title('Tekst Over mij')
        .icon(DocumentTextIcon)
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId(ABOUT_DOCUMENT_ID)
            .initialValueTemplate(ABOUT_TEMPLATE_ID)
            .title('Tekst Over mij'),
        ),
      S.listItem()
        .id('photos')
        .title("Foto's Over mij")
        .icon(ImagesIcon)
        .schemaType('aboutMePhotos')
        .child(S.documentTypeList('aboutMePhotos').title("Foto's Over mij")),
      S.divider(),
      S.listItem()
        .id('cv')
        .title('CV')
        .icon(DocumentPdfIcon)
        .child(() =>
          context
            .getClient({apiVersion})
            .fetch<string | null>(
              '*[_type == "cv" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._id',
            )
            .then((id) =>
              S.document()
                .schemaType('cv')
                .documentId(id ?? 'cv')
                .title('CV'),
            ),
        ),
    ])
