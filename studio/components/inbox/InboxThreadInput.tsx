import {Badge, Card, Flex, Stack, Text} from '@sanity/ui'
import type {ArrayOfObjectsInputProps} from 'sanity'
import {MAIL_STATUSES, normalizeReplyBody, replyBodyToText} from '../../shared/replyRules.js'

// The conversation of one message, newest first: replies sent from the Studio and reactions of the
// visitor through the link in the mail. Written by the website; read-only here.

type Entry = {
  _key: string
  direction?: string | null
  status?: string | null
  createdAt?: string | null
  sentAt?: string | null
  sentBy?: string | null
  to?: string | null
  subject?: string | null
  body?: unknown
  message?: string | null
  files?: unknown[] | null
  photos?: unknown[] | null
  error?: string | null
}

const STATUS_TONES: Record<string, 'positive' | 'caution' | 'critical'> = {
  sent: 'positive',
  pending: 'caution',
  uncertain: 'caution',
  failed: 'critical',
  notConfigured: 'critical',
}

function dateText(iso: string | null | undefined): string {
  const time = Date.parse(iso ?? '')
  return Number.isFinite(time)
    ? new Date(time).toLocaleString('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '–'
}

function countText(count: number, one: string, many: string): string {
  return count === 0 ? '' : count === 1 ? `1 ${one}` : `${count} ${many}`
}

export function InboxThreadInput(props: ArrayOfObjectsInputProps) {
  const entries = [...((props.value ?? []) as Entry[])].reverse()

  if (entries.length === 0) {
    return (
      <Text size={1} muted>
        Nog geen gesprek. Je antwoorden en reacties van de bezoeker komen hier te staan.
      </Text>
    )
  }

  return (
    <Stack gap={3}>
      {entries.map((entry) => {
        const received = entry.direction === 'received'
        const status = entry.status ?? ''
        const label = received
          ? 'Reactie'
          : (MAIL_STATUSES.find((item) => item.value === status)?.title ?? status)
        const body = normalizeReplyBody(entry.body)
        const extras = [
          countText(entry.files?.length ?? 0, 'bijlage', 'bijlagen'),
          countText(entry.photos?.length ?? 0, 'foto', "foto's"),
        ]
          .filter(Boolean)
          .join(' · ')

        return (
          <Card
            key={entry._key}
            padding={3}
            radius={2}
            border
            tone={received ? 'primary' : 'default'}
          >
            <Stack gap={3}>
              <Flex gap={2} align="center" wrap="wrap">
                <Badge tone={received ? 'primary' : (STATUS_TONES[status] ?? 'default')}>
                  {label}
                </Badge>
                <Text size={1} muted>
                  {dateText(entry.sentAt ?? entry.createdAt)}
                  {received
                    ? ' · van de bezoeker, via de link in je mail'
                    : `${entry.sentBy ? ` · ${entry.sentBy}` : ''}${entry.to ? ` · aan ${entry.to}` : ''}`}
                </Text>
              </Flex>
              {entry.subject && (
                <Text size={1} weight="semibold">
                  {entry.subject}
                </Text>
              )}
              <Text size={1} style={{whiteSpace: 'pre-wrap'}}>
                {body ? replyBodyToText(body) : (entry.message ?? '')}
              </Text>
              {extras && (
                <Text size={1} muted>
                  Met {extras}
                </Text>
              )}
              {entry.error && status !== 'sent' && (
                <Text size={1} muted>
                  Foutmelding: {entry.error}
                </Text>
              )}
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}
