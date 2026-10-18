import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {
  MAIL_STATUSES,
  MAX_REPLY_FILES,
  MAX_REPLY_FILES_BYTES,
  MAX_REPLY_PHOTOS,
  MAX_REPLY_SUBJECT_LENGTH,
} from '../shared/replyRules.js'
import {MessageStatusInput} from '../components/inbox/MessageStatusInput'
import {InboxReplyInput} from '../components/inbox/InboxReplyInput'
import {InboxThreadInput} from '../components/inbox/InboxThreadInput'
import {ReplyFilesInput, ReplyPhotosInput} from '../components/inbox/ReplyAssetsInput'

// One message through the contact form, created by the website with id "message.<uuid>" (the dot
// keeps it out of the public API). Edited live: no "Publish", changes apply at once.

// Written by the website: a reply from the Studio ("sent") or a reaction of the visitor ("received").
const messageReply = defineArrayMember({
  name: 'messageReply',
  title: 'Bericht',
  type: 'object',
  fields: [
    defineField({name: 'direction', title: 'Richting', type: 'string'}),
    defineField({name: 'status', title: 'Status', type: 'string', options: {list: MAIL_STATUSES}}),
    defineField({name: 'createdAt', title: 'Aangemaakt op', type: 'datetime'}),
    defineField({name: 'lastAttemptAt', title: 'Laatste poging', type: 'datetime'}),
    defineField({name: 'sentAt', title: 'Verzonden op', type: 'datetime'}),
    defineField({name: 'sentBy', title: 'Verstuurd door', type: 'string'}),
    defineField({name: 'to', title: 'Aan', type: 'string'}),
    defineField({name: 'subject', title: 'Onderwerp', type: 'string'}),
    defineField({name: 'body', title: 'Bericht', type: 'replyText'}),
    // Plain text: the reaction itself, or the reply as text.
    defineField({name: 'message', title: 'Tekst', type: 'text'}),
    defineField({
      name: 'files',
      title: 'Bijlagen',
      type: 'array',
      of: [defineArrayMember({type: 'file'})],
    }),
    defineField({
      name: 'photos',
      title: "Foto's",
      type: 'array',
      of: [defineArrayMember({type: 'image'})],
    }),
    defineField({name: 'error', title: 'Foutmelding', type: 'string'}),
  ],
  preview: {select: {title: 'subject', subtitle: 'createdAt'}},
})

export default defineType({
  name: 'contactMessage',
  title: 'Bericht',
  type: 'document',
  icon: EnvelopeIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: 'unread',
      title: 'Status',
      type: 'boolean',
      components: {input: MessageStatusInput},
    }),
    defineField({name: 'name', title: 'Naam', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'E-mail', type: 'string', readOnly: true}),
    defineField({name: 'receivedAt', title: 'Ontvangen op', type: 'datetime', readOnly: true}),
    defineField({name: 'message', title: 'Bericht', type: 'text', rows: 6, readOnly: true}),
    // The concept, saved as you type; the website empties it after sending.
    defineField({
      name: 'replyDraft',
      title: 'Antwoorden',
      type: 'object',
      components: {input: InboxReplyInput},
      fields: [
        defineField({
          name: 'subject',
          title: 'Onderwerp',
          type: 'string',
          validation: (rule) => rule.max(MAX_REPLY_SUBJECT_LENGTH),
        }),
        defineField({name: 'body', title: 'Bericht', type: 'replyText'}),
        defineField({
          name: 'files',
          title: 'Bijlagen',
          description: `PDF, JPG of PNG; hoogstens ${MAX_REPLY_FILES} bestanden, samen ${MAX_REPLY_FILES_BYTES / 1024 / 1024} MB.`,
          type: 'array',
          of: [defineArrayMember({type: 'file'})],
          components: {input: ReplyFilesInput},
        }),
        defineField({
          name: 'photos',
          title: "Foto's in de mail",
          description: `JPG of PNG (iPhone-foto's worden JPG); hoogstens ${MAX_REPLY_PHOTOS}. Ze staan onder je bericht.`,
          type: 'array',
          of: [defineArrayMember({type: 'image'})],
          components: {input: ReplyPhotosInput},
        }),
      ],
    }),
    defineField({
      name: 'replies',
      title: 'Gesprek',
      description: 'Je antwoorden en de reacties van de bezoeker via de link in je mail.',
      type: 'array',
      readOnly: true,
      of: [messageReply],
      components: {input: InboxThreadInput},
    }),
  ],
  orderings: [
    {title: 'Nieuwste eerst', name: 'receivedDesc', by: [{field: 'receivedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {name: 'name', email: 'email', unread: 'unread', receivedAt: 'receivedAt'},
    prepare({name, email, unread, receivedAt}) {
      const date = receivedAt
        ? new Date(receivedAt).toLocaleString('nl-NL', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Europe/Amsterdam',
          })
        : ''
      return {
        title: `${unread ? '● ' : ''}${name || 'Onbekend'}`,
        subtitle: [email, date].filter(Boolean).join(' · '),
        media: EnvelopeIcon,
      }
    },
  },
})
