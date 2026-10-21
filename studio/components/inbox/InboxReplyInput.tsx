import {useId, useState} from 'react'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {Box, Button, Card, Dialog, Flex, Stack, Text} from '@sanity/ui'
import {set, setIfMissing, useClient, useFormValue, type ObjectInputProps} from 'sanity'
import {normalizeReplyBody, normalizeReplySubject} from '../../shared/replyRules.js'
import {apiVersion} from '../../siteUrl'

// Reply to the visitor from the Studio. The concept is saved in the message as you type; the website
// (/api/inbox-reply) sends it in the mail template after a preview or a short confirmation, records it
// under "Gesprek" and empties the concept.

const SUGGESTED_SUBJECT = 'Re: your message via getdeveloper.nl'
const REQUEST_TIMEOUT_MS = 60_000

type Preview = {
  to: string
  subject: string
  html: string
  attachments: {filename: string; size: number}[]
}
type AssetItem = {asset?: {_ref?: string} | null}
type DraftValue = {subject?: string; body?: unknown; files?: AssetItem[]; photos?: AssetItem[]}
type Feedback = {tone: 'positive' | 'caution' | 'critical'; text: string; keepKey: boolean}

const UNREACHABLE: Feedback = {
  tone: 'caution',
  text: "De website antwoordde niet op tijd. Kijk bij 'Gesprek' of de mail er staat; opnieuw versturen is veilig, de bezoeker krijgt hem niet dubbel.",
  keepKey: true,
}

function assetIds(items: AssetItem[] | undefined): string[] {
  return (items ?? []).flatMap((item) => (item.asset?._ref ? [item.asset._ref] : []))
}

/** One key per concept; kept in the tab, so a repeat after a reload still never sends twice. */
function useReplyKey(messageId: string, content: string) {
  const storageKey = `inbox-reply-key:${messageId}`
  const [state, setState] = useState(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null')
      if (stored?.content === content && typeof stored.key === 'string')
        return stored as {content: string; key: string}
    } catch {
      // No storage: a new key.
    }
    return {content, key: crypto.randomUUID()}
  })

  function save(next: {content: string; key: string}) {
    setState(next)
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // Only a convenience.
    }
  }

  // A changed concept is a new message.
  if (state.content !== content) save({content, key: crypto.randomUUID()})

  return {
    key: state.content === content ? state.key : null,
    renew: () => save({content, key: crypto.randomUUID()}),
  }
}

/** What the website answered, in Dutch. */
async function feedbackOf(response: Response, to: string): Promise<Feedback> {
  const result = (await response.json().catch(() => null)) as {
    status?: string
    error?: string
  } | null

  if (response.ok) {
    return result?.status === 'sent'
      ? {tone: 'positive', text: `Verzonden naar ${to}.`, keepKey: false}
      : result?.status === 'notConfigured'
        ? {
            tone: 'critical',
            text: 'Niet verstuurd: RESEND_API_KEY ontbreekt in Netlify.',
            keepKey: false,
          }
        : {
            tone: 'critical',
            text: 'Versturen is mislukt. Je tekst staat er nog; probeer het later opnieuw.',
            keepKey: true,
          }
  }

  switch (response.status) {
    case 401:
      return {
        tone: 'critical',
        text: 'Je sessie is verlopen. Log opnieuw in bij de Studio en probeer het nog eens.',
        keepKey: true,
      }
    case 403:
      return {
        tone: 'critical',
        text: 'Je hebt geen rechten om dit bericht te wijzigen.',
        keepKey: true,
      }
    case 409:
      return {
        tone: 'caution',
        text: "Deze mail wordt al verstuurd. Wacht even en kijk bij 'Gesprek'.",
        keepKey: true,
      }
    case 422:
      return {
        tone: 'critical',
        text: 'Een bijlage of foto kan niet mee: verkeerd type, te groot of verwijderd.',
        keepKey: false,
      }
    case 400:
      return {
        tone: 'critical',
        text: 'Onderwerp of bericht ontbreekt of is te lang, of er zijn te veel bijlagen.',
        keepKey: true,
      }
    default:
      return result?.error === 'not-configured'
        ? {tone: 'critical', text: 'SANITY_WRITE_TOKEN ontbreekt in Netlify.', keepKey: true}
        : UNREACHABLE
  }
}

export function InboxReplyInput(props: ObjectInputProps) {
  const client = useClient({apiVersion})
  const previewId = useId()
  const confirmId = useId()
  const idValue = useFormValue(['_id'])
  const emailValue = useFormValue(['email'])
  const id = typeof idValue === 'string' ? idValue : ''
  const email = typeof emailValue === 'string' ? emailValue : ''
  const draft = (props.value ?? {}) as DraftValue
  const subject = normalizeReplySubject(draft.subject) ?? ''
  const body = normalizeReplyBody(draft.body)
  const files = assetIds(draft.files)
  const photos = assetIds(draft.photos)
  const {key, renew} = useReplyKey(id, JSON.stringify({subject, body, files, photos}))
  const [preview, setPreview] = useState<Preview | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState<'preview' | 'send' | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const ready = Boolean(id && email && subject && body && key)
  const extras = [
    files.length === 1 ? '1 bijlage' : files.length ? `${files.length} bijlagen` : '',
    photos.length === 1 ? '1 foto' : photos.length ? `${photos.length} foto's` : '',
  ]
    .filter(Boolean)
    .join(' en ')

  async function post(extra: Record<string, unknown>): Promise<Response | Feedback> {
    // The Studio's own login; the website checks it with Sanity.
    const token = client.config().token
    if (!token) {
      return {
        tone: 'critical',
        text: 'Je Studio-sessie kan hiervoor niet worden gebruikt. Log uit en weer in.',
        keepKey: true,
      }
    }

    try {
      return await fetch('/api/inbox-reply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({id, subject, body: draft.body ?? [], files, photos, ...extra}),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    } catch {
      return UNREACHABLE
    }
  }

  async function showPreview() {
    setBusy('preview')
    setFeedback(null)
    const response = await post({preview: true})

    if (!(response instanceof Response)) setFeedback(response)
    else if (response.ok) setPreview((await response.json()) as Preview)
    else setFeedback(await feedbackOf(response, email))

    setBusy(null)
  }

  async function send() {
    setBusy('send')
    const response = await post({key})
    const result = response instanceof Response ? await feedbackOf(response, email) : response

    setPreview(null)
    setConfirming(false)
    setBusy(null)
    setFeedback(result)
    // After sending, the website empties the concept itself.
    if (!result.keepKey) renew()
  }

  const sendButton = (
    <Button
      icon={EnvelopeIcon}
      text={busy === 'send' ? 'Wordt verstuurd…' : `Versturen naar ${email}`}
      tone="primary"
      disabled={busy !== null}
      onClick={send}
    />
  )

  return (
    <Stack gap={4}>
      <Text size={1} muted>
        De bezoeker krijgt je antwoord in je eigen mailtemplate, met een knop om te reageren.
        Reageert de bezoeker, dan komt dat hieronder bij &lsquo;Gesprek&rsquo;. Je concept wordt
        automatisch bewaard en na het versturen leeggemaakt.
      </Text>
      <Text size={1}>
        <strong>Aan:</strong> {email || '–'}
      </Text>
      {!subject && (
        <Box>
          <Button
            text={`Onderwerp invoegen: ${SUGGESTED_SUBJECT}`}
            mode="ghost"
            fontSize={1}
            disabled={props.readOnly}
            onClick={() => props.onChange([setIfMissing({}), set(SUGGESTED_SUBJECT, ['subject'])])}
          />
        </Box>
      )}
      {props.renderDefault(props)}
      {(!subject || !body) && (
        <Text size={1} muted>
          Vul een onderwerp en een bericht in om de mail te kunnen bekijken en versturen.
        </Text>
      )}
      <Flex gap={2} wrap="wrap">
        <Button
          icon={EyeOpenIcon}
          text={busy === 'preview' ? 'Voorbeeld wordt gemaakt…' : 'Voorbeeld bekijken'}
          tone="primary"
          disabled={!ready || busy !== null}
          onClick={showPreview}
        />
        <Button
          icon={EnvelopeIcon}
          text="Direct versturen"
          mode="ghost"
          disabled={!ready || busy !== null}
          onClick={() => {
            setFeedback(null)
            setConfirming(true)
          }}
        />
      </Flex>
      {feedback && (
        <Card tone={feedback.tone} padding={3} radius={2} role="status">
          <Text size={1}>{feedback.text}</Text>
        </Card>
      )}
      {confirming && (
        <Dialog
          id={confirmId}
          header="Mail versturen?"
          width={1}
          onClose={() => busy === null && setConfirming(false)}
          footer={
            <Flex gap={2} justify="flex-end" padding={3}>
              <Button
                text="Annuleren"
                mode="ghost"
                disabled={busy !== null}
                onClick={() => setConfirming(false)}
              />
              {sendButton}
            </Flex>
          }
        >
          <Box padding={4}>
            <Text size={2}>
              &lsquo;{subject}&rsquo; versturen naar {email}
              {extras ? `, met ${extras}` : ''}?
            </Text>
          </Box>
        </Dialog>
      )}
      {preview && (
        <Dialog
          id={previewId}
          header={`Voorbeeld: ${preview.subject}`}
          width={2}
          onClose={() => busy === null && setPreview(null)}
          footer={
            <Flex gap={2} justify="flex-end" align="center" padding={3}>
              {preview.attachments.length > 0 && (
                <Box flex={1}>
                  <Text size={1} muted>
                    Bijlagen: {preview.attachments.map((file) => file.filename).join(', ')}
                  </Text>
                </Box>
              )}
              <Button
                text="Aanpassen"
                mode="ghost"
                disabled={busy !== null}
                onClick={() => setPreview(null)}
              />
              {sendButton}
            </Flex>
          }
        >
          <Box padding={3}>
            {/* Sandboxed: the mail HTML runs no scripts and cannot reach the Studio. */}
            <iframe
              title="Voorbeeld van de e-mail"
              srcDoc={preview.html}
              sandbox=""
              style={{display: 'block', width: '100%', height: 640, border: 0}}
            />
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}
